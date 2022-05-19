import React, { SetStateAction, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
//import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {

    const [dataArray, setDataArray] = useState([]);

    const [isKayitOl, setIsKayitOl] = useState(false);

    const [isProfilePicture, setIsProfilePicture] = useState(false);
    const [profilePicture, setProfilePicture] = useState("");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const [nicknameOrEmail, setNicknameOrEmail] = useState("");
    const [password2, setPassword2] = useState("");

    const [digest, setDigest] = useState("");

    useEffect(() => {

    }, []);

    const handleClickGirisYap = async () => {
        /*const db = getDatabase();
        const referance = ref(db, 'kullanicilar/' + nicknameOrEmail);
        onValue(referance, (snapshot) => {
            console.log(snapshot.val().password);

            if (password2 === snapshot.val().password) {
                navigation.navigate('HomeScreen', { myNickname: snapshot.val().nickname, myName: snapshot.val().name });
            } else {
                ToastAndroid.show("Şifreler uyuşmuyor!", ToastAndroid.SHORT);
            }
        });*/

        /*fetch("https://api.jsonbin.io/v3/b", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Master-Key': '$2b$10$UHMMfkrwMGIvUwTlA2aQn.20ZkgQw7yCGrHk.cWQz8zXPgVSrfFAu'
            },
            body: JSON.stringify({
                kullanicilar: [
                    { title: "Veli" }
                ]
            })
        }).then((response) => response.json())
        .then(json => console.log(json))
        .catch((err) => {
            console.log(err.message);
        });*/

        const firestore = getFirestore();
        const collectDoc = doc(firestore, 'kullanicilar', nicknameOrEmail);

        await getDoc(collectDoc).then((snapshot) => {
            if (!snapshot.exists()) {
                ToastAndroid.show("Kullanıcı bulunamadı!", ToastAndroid.SHORT);
                return;
            } else {
                console.log(snapshot.data());
                if (password2 === (snapshot as any).data().password) {
                    navigation.navigate('HomeScreen', { myNickname: (snapshot as any).data().nickname, myName: (snapshot as any).data().name });
                    console.log("Giriş yapıldı. kullanıcı adı.:", (snapshot as any).data());
                } else {
                    ToastAndroid.show("Şifreler uyuşmuyor!", ToastAndroid.SHORT);
                }
            }
        });
    }

    const handleClickProfilePicture = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.cancelled) {
            setIsProfilePicture(true);
            setProfilePicture(result.uri);
            const fsInfo = await FileSystem.readAsStringAsync(profilePicture, { encoding: FileSystem.EncodingType.Base64 });
            setDigest(fsInfo);
            console.log(digest);
        } else {
            setIsProfilePicture(false);
        }
    }

    const handleClickKayitOl = () => {
        if (password !== passwordAgain) {
            ToastAndroid.show("Şifreler uyuşmuyor!", ToastAndroid.SHORT);
            return;
        };

        if (nickname === null || nickname === undefined || nickname === "") {
            ToastAndroid.show("Kullanıcı adı boş olamaz!", ToastAndroid.SHORT);
            return;
        };

        const firestore = getFirestore();

        const collectDoc = doc(firestore, 'kullanicilar', nickname);
        getDoc(collectDoc).then((snapshot) => {

            if (!snapshot.exists()) {
                setDoc(collectDoc, {
                    name: name,
                    nickname: nickname,
                    password: password,
                    profilePicture: digest === null || digest === undefined || digest === "" ? "[object, Object]" : 'data:image/png;base64,' + digest
                }).then(() => {
                    ToastAndroid.show("Kayıt başarılı!", ToastAndroid.SHORT);
                    setIsKayitOl(false);
                    setIsProfilePicture(false);
                    setProfilePicture("");
                    setName("");
                    setNickname("");
                    setPassword("");
                    setPasswordAgain("");
                    setNicknameOrEmail("");
                    setPassword2("");

                    navigation.navigate('HomeScreen', { myNickname: nickname });
                }).catch((error) => {
                    ToastAndroid.show("Kayıt başarısız!", ToastAndroid.SHORT);
                    console.log(error);
                });
            } else {
                ToastAndroid.show("Bu kullanıcı adına ait başka bir kullanıcı var!", ToastAndroid.SHORT);
            }
        });

        /*const referance = ref(db, 'kullanicilar/' + nickname);
        set(referance, {
            profilePicture: 'data:image/png;base64,' + digest,
            name: name,
            nickname: nickname,
            password: password
        });*/
    }

    return (
        <View style={styles.container}>
            {isKayitOl ?
                <View>
                    <TouchableOpacity onPress={async () => handleClickProfilePicture()} style={{ alignSelf: 'center' }}>{isProfilePicture ? <Image source={{ uri: profilePicture }} style={{ borderRadius: 100, width: 100, height: 100 }} /> : <FontAwesome name="user-circle" size={100} color="black" />}</TouchableOpacity>
                    <TextInput value={name} onChangeText={e => setName(e)} placeholder="İsim & Soyisim giriniz:" textContentType="name" style={[styles.textInputStyle]} />
                    <TextInput value={nickname} onChangeText={e => setNickname(e)} placeholder="Kullanıcı adı giriniz:" textContentType="nickname" style={[styles.textInputStyle]} />
                    <Text style={{ color: '#f00', fontSize: 10, marginLeft: 10, marginTop: -10 }}>Kullanıcı adı daha sonra değiştirilemez!</Text>
                    <TextInput value={password} onChangeText={e => setPassword(e)} placeholder="Şifrenizi giriniz:" textContentType="password" secureTextEntry={true} style={[styles.textInputStyle]} />
                    <TextInput value={passwordAgain} onChangeText={e => setPasswordAgain(e)} placeholder="Şifrenizi (tekrar) giriniz:" textContentType="password" secureTextEntry={true} style={[styles.textInputStyle]} />
                    <TouchableOpacity onPress={() => handleClickKayitOl()} style={{ alignSelf: 'center', backgroundColor: '#4b9050', padding: 10, margin: 10, borderRadius: 10 }}><Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Kayıt Ol</Text></TouchableOpacity>
                </View>
                :
                <View>
                    <Text style={{ fontSize: 50, fontWeight: 'bold', fontFamily: 'monospace', color: '#000', alignSelf: 'center', margin: 50, marginTop: -100 }}>Çevrem</Text>
                    <TextInput value={nicknameOrEmail} onChangeText={e => setNicknameOrEmail(e)} placeholder="Kullanıcı adınızı giriniz:" textContentType="nickname" style={[styles.textInputStyle]} />
                    <TextInput value={password2} onChangeText={e => setPassword2(e)} placeholder="Şifrenizi giriniz:" textContentType="password" secureTextEntry={true} style={[styles.textInputStyle]} />
                    <TouchableOpacity onPress={() => handleClickGirisYap()} style={{ alignSelf: 'center', backgroundColor: '#4b9050', padding: 10, margin: 10, borderRadius: 10 }}><Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Giriş Yap</Text></TouchableOpacity>
                </View>
            }

            <TouchableOpacity onPress={() => setIsKayitOl(!isKayitOl)} style={{ alignSelf: 'center', backgroundColor: '#0099FF', padding: 10, margin: 10, borderRadius: 10 }}><Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>{isKayitOl ? "Giriş Yap" : "Kayıt Ol"}</Text></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    textInputStyle: {
        backgroundColor: '#EFEFEF',
        width: 250,
        padding: 10,
        margin: 10,
    }
});

export default LoginScreen;