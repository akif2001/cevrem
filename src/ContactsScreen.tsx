import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from '@firebase/database';
import { collection, doc, getDoc, getDocs, getFirestore, Query } from '@firebase/firestore';

const ContactsScreen = ({ navigation, route }: any) => {

    const { myNickname } = route.params;

    const [personData, setPersonData] = useState([]);

    const [contactsScreenIsSearch, setContactsScreenIsSearch] = useState(false);
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => contactsScreenIsSearch ? (
                <View style={{ flexDirection: 'row' }}>
                    <TextInput value={searchName} onChangeText={e => setSearchName(e)} style={{ width: 250, borderWidth: 1, borderColor: '#000', borderRadius: 10, marginLeft: -10, paddingLeft: 10 }} />
                </View>
            ) : <Text style={{ fontSize: 24 }}>Kişiler:</Text>,
            headerRight: () => contactsScreenIsSearch ? <TouchableOpacity onPress={() => {
                setContactsScreenIsSearch(false);
                setSearchName("");
            }}>
                <Ionicons name="close-sharp" size={24} color="black" />
                </TouchableOpacity> 
                :
                 <TouchableOpacity onPress={() => {
                setContactsScreenIsSearch(true);
                //setSearchName("");
            }}><Octicons name="search" size={24} color="black" /></TouchableOpacity>
        });
    });

    useEffect(() => {
        /*const db = getDatabase();
        const referance = ref(db, 'kullanicilar');
        onValue(referance, (snapshot) => {

            const personArray: any = [];

            snapshot.forEach((child) => {
                personArray.push(child.val() as never);
            });
            setPersonData(personArray);
        });*/

        const firestore = getFirestore();
        const collectDoc = collection(firestore, 'kullanicilar');
        getDocs(collectDoc as any).then((snapshot) => {
            const personArray: any = [];

            snapshot.forEach((child) => {
                personArray.push(child.data() as never);
            });
            setPersonData(personArray);
        }
        );
    }, [getDocs]);

    const aboutPerson = (personNickname: any, personPhoto: any, personName: any) => {
        navigation.navigate('AboutScreen', { myNickname: myNickname, personNickname: personNickname, personPhoto: personPhoto, personName: personName });
    }

    const handleClickPersonName = (personNickname: any, personPhoto: any, personName: any) => {
        navigation.navigate('SendMessageScreen', { myNickname: myNickname, personNickname: personNickname, personPhoto: personPhoto, personName: personName });
    }

    const personMap = () => {
        return personData.sort((a, b) => {
            if ((a as any).name < (b as any).name) {
                return -1;
            } else {
                return 1;
            }
        }).map((x, i) => {

            if ((x as any).nickname === myNickname) return;

            if (!(x as any).name.includes(searchName) && !(x as any).nickname.includes(searchName)) {
                return;
            } else {

                return (
                    <View key={i} style={{ margin: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => aboutPerson((x as any).nickname, (x as any).profilePicture, (x as any).name)}>
                                <Image source={{ uri: (x as any).profilePicture }} style={{ width: 50, height: 50, borderRadius: 100, margin: 10 }} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleClickPersonName((x as any).nickname, (x as any).profilePicture, (x as any).name)}>
                                <View style={{ flexDirection: 'column', padding: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{(x as any).name}</Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#5F5F5F' }}>{(x as any).nickname}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '100%', height: 1, backgroundColor: '#5A5A5A' }} />
                    </View>
                );
            }
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {personMap() as any}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default ContactsScreen;