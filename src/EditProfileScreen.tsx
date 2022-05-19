import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ToastAndroid, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, } from 'firebase/firestore';
import CheckBox from '../components/CheckBox';
//import CheckBox from '@react-native-community/checkbox';

const EditProfileScreen = ({ navigation, route }: any) => {

    const { myNickname } = route.params;

    const [isProfilePicture, setIsProfilePicture] = useState(false);
    const [profilePicture, setProfilePicture] = useState("");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [notes, setNotes] = useState("");

    const [digest, setDigest] = useState("");

    const [isDelete, setIsDelete] = useState(false);

    useEffect(() => {
        /*const db = getDatabase();
        const referance = ref(db, 'kullanicilar/' + myNickname);
        onValue(referance, (snapshot) => {
            if (snapshot.val().profilePicture !== null || snapshot.val().profilePicture !== undefined) setIsProfilePicture(true);

            setProfilePicture(snapshot.val().profilePicture);
            setName(snapshot.val().name);
            setNickname(snapshot.val().nickname);
            setPassword(snapshot.val().password);
            setNotes(snapshot.val().notes);

            const fsInfo = FileSystem.readAsStringAsync(profilePicture, { encoding: FileSystem.EncodingType.Base64 });
            setDigest(fsInfo as any);
        });*/

        const firestore = getFirestore();
        const collectDoc = doc(firestore, 'kullanicilar', myNickname);

        getDoc(collectDoc).then((snapshot) => {
            if ((snapshot as any).data().profilePicture !== null || (snapshot as any).data().profilePicture !== undefined) setIsProfilePicture(true);

            setProfilePicture((snapshot as any).data().profilePicture);
            setName((snapshot as any).data().name);
            setNickname((snapshot as any).data().nickname);
            setPassword((snapshot as any).data().password);
            setNotes((snapshot as any).data().notes);

            const fsInfo = FileSystem.readAsStringAsync(profilePicture, { encoding: FileSystem.EncodingType.Base64 });
            setDigest(fsInfo as any);
        });
    }, []);

    const handleClickProfilePicture = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.cancelled && (profilePicture !== null || profilePicture !== undefined || profilePicture !== "" || profilePicture !== "[object, Object]")) {
            setIsProfilePicture(true);
            setProfilePicture(result.uri);
            const fsInfo = await FileSystem.readAsStringAsync(profilePicture, { encoding: FileSystem.EncodingType.Base64 });
            setDigest(fsInfo as any);
            console.log("fsinf:", digest);
        } else {
            setIsProfilePicture(false);
            setProfilePicture("[object, Object]");
        }
    }

    const handleClickGuncelle = () => {
        if (password !== passwordAgain) {
            ToastAndroid.show("Şifreler uyuşmuyor!", ToastAndroid.SHORT);
            return;
        };

        /*const db = getDatabase();

        const referance = ref(db, 'kullanicilar/' + nickname);
        set(referance, {
            profilePicture: digest === null || digest === undefined ? profilePicture : 'data:image/png;base64,' + digest,
            name: name,
            nickname: nickname,
            password: password,
            notes: notes
        });*/

        if (isDelete) {
            Alert.alert(
                'Hesabını sil',
                'Hesabınızı silmek istediğinize emin misiniz?',
                [
                    {
                        text: 'Hayır',
                        onPress: () => {
                            setIsDelete(false);
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Evet',
                        onPress: () => {
                            const firestore = getFirestore();
                            const collectDoc = doc(firestore, 'kullanicilar', nickname);
                            deleteDoc(collectDoc).then(() => {
                                navigation.navigate('LoginScreen');
                            });
                        },
                    },
                ],
                { cancelable: true },
            );
        } else {
            const firestore = getFirestore();
            const collectDoc = doc(firestore, 'kullanicilar', nickname);

            console.log("dgst:", digest);

            setDoc(collectDoc, {
                profilePicture: digest === null || digest === undefined || digest === "" ? "[object, Object]" : 'data:image/png;base64,' + digest,
                name: name === null || name === undefined ? "" : name,
                nickname: nickname === null || nickname === undefined ? "" : nickname,
                password: password === null || password === undefined ? "" : password,
                notes: notes === null || notes === undefined ? "" : notes
            }).then(() => {
                ToastAndroid.show("Güncelleme başarılı!", ToastAndroid.SHORT);
                navigation.navigate('HomeScreen', { myNickname: nickname });
            }).catch(() => {
                ToastAndroid.show("Güncelleme başarısız!", ToastAndroid.SHORT);
            });
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity>
                        {profilePicture === "[object, Object]" ? <FontAwesome name="user-circle" size={50} color="black" /> : <Image source={{ uri: profilePicture }} style={{ width: 50, height: 50, borderRadius: 100, margin: 10 }} />}
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={{ flexDirection: 'column', padding: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{name}</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#5F5F5F' }}>{nickname}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', height: 1, backgroundColor: '#5A5A5A' }} />

                <View style={{ marginTop: '10%' }}>
                    <TouchableOpacity onPress={async () => handleClickProfilePicture()} style={{ alignSelf: 'center' }}>{isProfilePicture ? <Image source={{ uri: profilePicture }} style={{ width: 400, height: 400 }} /> : <FontAwesome name="user-circle" size={100} color="black" />}</TouchableOpacity>
                    <TextInput value={name} onChangeText={e => setName(e)} placeholder="İsim & Soyisim giriniz:" textContentType="name" style={[styles.textInputStyle]} />
                    <TextInput value={nickname} onChangeText={e => setNickname(e)} placeholder="Kullanıcı adı giriniz:" textContentType="nickname" style={[styles.textInputStyle]} editable={false} />
                    <Text style={{ color: '#f00', fontSize: 10, marginLeft: 10, marginTop: -10 }}>Kullanıcı adı değiştirilemez!</Text>
                    <TextInput value={password} onChangeText={e => setPassword(e)} placeholder="Şifrenizi giriniz:" textContentType="password" secureTextEntry={true} style={[styles.textInputStyle]} />
                    <TextInput value={passwordAgain} onChangeText={e => setPasswordAgain(e)} placeholder="Şifrenizi (tekrar) giriniz:" textContentType="password" secureTextEntry={true} style={[styles.textInputStyle]} />
                    <TextInput value={notes} onChangeText={e => setNotes(e)} placeholder="Diğer bilgilerinizi giriniz:" textContentType="none" multiline={true} style={[styles.textInputStyle]} />
                    <TouchableOpacity onPress={() => handleClickGuncelle()} style={{ alignSelf: 'center', backgroundColor: '#00FF99', padding: 10, margin: 10, borderRadius: 10 }}><Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Güncelle</Text></TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                        <CheckBox onClick={(e: any) => setIsDelete(e)} />
                        <TouchableOpacity><Text style={{ color: '#f00' }}>Hesabımı silmek istiyorum!</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00AB8E',
    },
    textInputStyle: {
        backgroundColor: '#005F5F',
        borderRadius: 25,
        margin: 10,
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    }
});

export default EditProfileScreen;