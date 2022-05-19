import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from 'firebase/database';
import { collection, doc, getDoc, getDocs, getFirestore, Query } from 'firebase/firestore';

const HomeScreen = ({ navigation, route }: any) => {

    const { myNickname } = route.params;

    const [personMessages, setPersonMessages] = useState([]);

    useEffect(() => {
        /*const db = getDatabase();
        const referance = ref(db, 'mesajlar/');
        onValue(referance, (snapshot) => {
            const datas: any[] = [];

            snapshot.forEach((child) => {
                if (child.val().kimden === myNickname || child.val().kime === myNickname) {
                    datas.push(child.val());
                }
            });

            setPersonMessages(datas as never);
        });*/

        (async () => {
            const firestore = getFirestore();
            const collectDoc = collection(firestore, 'mesajlar');
            await getDocs(collectDoc as any).then((snapshot) => {
                const datas: any[] = [];
                const nicknames: any[] = [];

                snapshot.forEach((child) => {
                    if ((child as any).data().kimden === myNickname || (child as any).data().kime === myNickname) {
                        if (nicknames.includes((child as any).data().kimden) || nicknames.includes((child as any).data().kime)) return;
                        nicknames.push((child as any).data().kimden, (child as any).data().kime);
                        datas.push(child.data());
                    }
                });

                setPersonMessages(datas as never);

                console.log("con:", personMessages);
            });
        })();

        //datas.filter((item, index) => datas.indexOf(item) === index);
        //console.log("d:", d);
    }, [getDocs]);

    const personMessagesMap = () => {
        return personMessages.filter((item, index) => personMessages.lastIndexOf((item as any).nickname as never)).map((x, i) => {

            //datas.push((x as any).kimden === myNickname ? (x as any).kime : (x as any).kimden);

            return (
                <View key={i}>
                    <Text>{(x as any).kimden === myNickname ? (x as any).kime : (x as any).kimden}</Text>
                    <Text>{(x as any).mesaj}</Text>
                </View>
            );
        });
    }

    const handleClickKisiler = () => {
        navigation.navigate('ContactsScreen', { myNickname: myNickname });
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ backgroundColor: '#4b9050', flex: 1, margin: 10, padding: 10, borderRadius: 10 }}>
                    <TouchableOpacity><Text style={{ color: '#505050', fontSize: 15, fontWeight: 'bold', alignSelf: 'center' }}>Mesajlar</Text></TouchableOpacity>
                </View>

                <View style={{ backgroundColor: '#4b9050', flex: 1, margin: 10, padding: 10, borderRadius: 10 }}>
                    <TouchableOpacity><Text style={{ color: '#505050', fontSize: 15, fontWeight: 'bold', alignSelf: 'center' }}>Aramalar</Text></TouchableOpacity>
                </View>
            </View>

            <ScrollView>
                {personMessagesMap()}
            </ScrollView>

            <TouchableOpacity onPress={() => handleClickKisiler()} style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: '#4b9050', borderRadius: 100, width: 75, height: 75, padding: 10 }}><MaterialCommunityIcons name="message-reply-text" size={50} color="white" style={{ alignSelf: 'center' }} /></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dadcbe',
    },
});

export default HomeScreen;