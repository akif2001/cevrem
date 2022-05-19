import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
//import { getDatabase, ref, onValue, push } from '@firebase/database';
import { collection, getFirestore, addDoc, getDocs } from 'firebase/firestore';

const SendMessageScreen = ({ navigation, route }: any) => {

    const { myNickname, personNickname, personPhoto, personName } = route.params;

    const [allDatas, setAllDatas] = useState([]);

    const [mesaj, setMesaj] = useState("");

    const [isOpenedMenu, setIsOpenedMenu] = useState(false);

    useEffect(() => {
        (async () => {
        /*const db = getDatabase();
        const referance1 = ref(db, 'kullanicilar/' + myNickname + '/mesajlar/');

        onValue(referance1, (snapshot) => {
            const datas: any[] = [];

            snapshot.forEach((child) => {
                if ((child.val().kimden === myNickname && child.val().kime === personNickname) || (child.val().kime === myNickname && child.val().kimden === personNickname)) {
                    datas.push(child.val());
                }
            });

            setAllDatas(datas as never);
        });*/

        const firestore = getFirestore();
        const collectDoc = collection(firestore, 'mesajlar');
        await getDocs(collectDoc).then((snapshot) => {
            const datas: any[] = [];

            console.log(snapshot.docs);

            snapshot.forEach((child) => {
                if (((child as any).data().kimden === myNickname && (child as any).data().kime === personNickname) || ((child as any).data().kime === myNickname && (child as any).data().kimden === personNickname)) {
                    datas.push((child as any).data());
                }
            });

            setAllDatas(datas as never);
        }).catch((err) => {
            console.log(err.message);
        })
    })();
    }, [(getDocs as any) || (addDoc as any)]);

    const handleClickSendMessage = async () => {
        /*const db = getDatabase();
        const referance1 = ref(db, 'kullanicilar/' + myNickname + '/mesajlar/');
        const referance2 = ref(db, 'kullanicilar/' + personNickname + '/mesajlar/');

        const tarih = new Date().toLocaleString('DD/MM/YYYY');

        push(referance1, {
            mesaj: mesaj,
            tarih: tarih,
            kimden: myNickname,
            kime: personNickname
        });

        push(referance2, {
            mesaj: mesaj,
            tarih: tarih,
            kimden: myNickname,
            kime: personNickname
        });*/

        const firestore = getFirestore();
        const collectDoc1 = collection(firestore, 'mesajlar');
        //const collectDoc2 = collection(firestore, 'mesajlar', personNickname);

        const tarih = new Date().toLocaleString('DD/MM/YYYY');

        await addDoc(collectDoc1, {
            mesaj: mesaj,
            tarih: tarih,
            kimden: myNickname,
            kime: personNickname
        });

        /*addDoc(collectDoc2, {
            mesaj: mesaj,
            tarih: tarih,
            saat: saat,
            kimden: myNickname,
            kime: personNickname
        });*/

        setMesaj("");
    }

    const allDatasMap = () => {
        return allDatas.sort((a, b) => {
            if ((a as any).tarih < (b as any).tarih || (a as any).saat < (b as any).saat) {
                return -1;
            } else {
                return 1;
            }
        }).map((x, i) => {
            return (
                <View key={i}>
                    <TouchableOpacity>
                        <View style={{ backgroundColor: '#a6d2a9', borderRadius: 25, borderBottomRightRadius:(x as any).kimden === myNickname ? 0: 25, borderBottomLeftRadius: (x as any).kime === myNickname ? 0: 25, margin: 10, padding: 10 }}>
                            <Text style={{ fontSize: 17.5 }}>{(x as any).mesaj}</Text>

                            <View style={{ width: '100%', height: 1, backgroundColor: '#000' }} />

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#9A9A9A' }}>{(x as any).saat}</Text>
                                <Text style={{ color: '#9A9A9A' }}>{(x as any).tarih}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {allDatasMap()}
            </ScrollView>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isOpenedMenu &&
                <View style={{ position: 'absolute', bottom: 50, backgroundColor: '#fff', width: '100%', height: 100 }}>

                </View>}
                <TouchableOpacity onPress={() => setIsOpenedMenu(!isOpenedMenu)} style={{ backgroundColor: '#fff', borderRadius: 100, borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: 10 }}><Feather name="paperclip" size={27.5} color="black" /></TouchableOpacity>
                <TextInput value={mesaj} onChangeText={e => setMesaj(e)} placeholder="Mesaj yazınız..." multiline={true} style={{ backgroundColor: '#fff', borderRadius: 25, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, width: '70%', padding: 10 }} />
                <TouchableOpacity onPress={() => handleClickSendMessage()} style={{ backgroundColor: '#4b9050', borderRadius: 100, padding: 10 }}><FontAwesome name="send" size={30} color="black" /></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dadcbe',
    }
});

export default SendMessageScreen;