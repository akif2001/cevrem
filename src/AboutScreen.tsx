import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from '@firebase/database';
import { collection, doc, getDoc, getDocs, getFirestore, Query } from '@firebase/firestore';

const AboutScreen = ({ navigation, route }: any) => {
    const { myNickname, personNickname, personPhoto, personName } = route.params;

    const [personData, setPersonData] = useState([]);

    useEffect(() => {
        /*const db = getDatabase();
        const referance = ref(db, 'kullanicilar/' + personNickname);

        onValue(referance, (snapshot) => {
            setPersonData([snapshot.val() as never]);
        });*/

        const firestore = getFirestore();
        const collectDoc = doc(firestore, 'kullanicilar', personNickname);
        getDoc(collectDoc as any).then((snapshot) => {
            setPersonData([snapshot.data() as never]);
        }
        );

        console.log("mynickname:", myNickname, "personnickname:", personNickname, "personPhoto.", personPhoto, "personname:", personName);
    }, []);

    const personMap = () => {
        return personData.map((x, i) => {
            return (
                <View key={i}>
                    <TouchableOpacity><Image source={{ uri: (x as any).profilePicture }} style={{ width: '100%', height: 400 }} /></TouchableOpacity>
                    <TouchableOpacity><Text style={{ backgroundColor: '#005F5F', borderRadius: 25, margin: 10, padding: 10, fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{(x as any).name}</Text></TouchableOpacity>

                    <TouchableOpacity>
                        <View style={{ backgroundColor: '#005F5F', borderRadius: 25, margin: 10, padding: 10, }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Diğer Bilgiler:</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{(x as any).notes}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ backgroundColor: '#005F5F', borderRadius: 25, margin: 10, padding: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('SendMessageScreen', { myNickname: myNickname, personNickname: personNickname, personPhoto: personPhoto, personName: personName })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="android-messages" size={24} color="white" style={{ margin: 10 }} />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', margin: 10 }}>Mesaj Gönder</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{ width: '100%', height: 1, backgroundColor: '#5A5A5A' }} />

                        <TouchableOpacity onPress={() => navigation.navigate('VideoCallScreen', { myNickname: myNickname, personNickname: personNickname, personPhoto: personPhoto, personName: personName })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="videocam" size={24} color="white" style={{ margin: 10 }} />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', margin: 10 }}>Görüntülü Ara</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{ width: '100%', height: 1, backgroundColor: '#5A5A5A' }} />

                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="keyboard-voice" size={24} color="white" style={{ margin: 10 }} />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', margin: 10 }}>Sesli Ara</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
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
        backgroundColor: '#00AB8E',
    },
});

export default AboutScreen;