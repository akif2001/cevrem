import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsynStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, PersistenceSettings, FirestoreSettings } from 'firebase/firestore';

import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import ContactsScreen from './src/ContactsScreen';
import AboutScreen from './src/AboutScreen';
import EditProfileScreen from './src/EditProfileScreen';
import SendMessageScreen from './src/SendMessageScreen';
import VideoCallScreen from './src/VideoCallScreen';

const Stack = createNativeStackNavigator();

export default function App({ navigation }: any) {

  const [isPermanentLogin, setIsPermanentLogin] = useState(false);
  let _menu: any = null;
  const [homeScreenMenuVisible, setHomeScreenMenuVisible] = useState(false);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyDNhQnW2_-hR_lyt6Rh4Hrq7Pmnso1AK3U",
      authDomain: "cevrem-6d30e.firebaseapp.com",
      databaseURL: "https://cevrem-6d30e-default-rtdb.firebaseio.com",
      projectId: "cevrem-6d30e",
      storageBucket: "cevrem-6d30e.appspot.com",
      messagingSenderId: "567458825355",
      appId: "1:567458825355:web:7b4d2875a49a3c74f6008e",
      measurementId: "G-VWRTKZ5H84"
    };

    const app = initializeApp(firebaseConfig);
    /*const firestore = initializeFirestore(app, ({
      persistence: true,
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      settings: {
        host: "firestore.googleapis.com",
        ssl: true
        }} as FirestoreSettings));*/
    /*enableIndexedDbPersistence(firestore, ({
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    } as PersistenceSettings));*/

    /*(async () => {
      try {
        const myNickname = AsynStorage.getItem('myNickname', (err, value) => {
          if (err) {
            return console.log(err);
          } else {
            return value as string;
          }
        });
        
        if (myNickname) {
          console.log("App.tsx:", myNickname);
          const db = getDatabase();
          const referance = ref(db, 'kullanicilar/' + myNickname);

          onValue(referance, (snapshot) => {
            setIsPermanentLogin(true);
            navigation.navigate('HomeScreen', { myNickname: snapshot.val().nickname, myName: snapshot.val().name });
          });
        }
      } catch (err) {
        console.log((err as any).message);
      }
    })();*/
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isPermanentLogin &&
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ title: "Giriş Ekranı:" }} />
        }
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({ navigation, route }) => ({
            title: (route.params as any).myNickname, headerRight: () => (
              <Menu
                visible={homeScreenMenuVisible}
                ref={(ref: any) => _menu = ref}
                anchor={
                  <TouchableOpacity onPress={() => setHomeScreenMenuVisible(true)} onPressOut={() => setHomeScreenMenuVisible(false)}>
                    <Entypo name="dots-three-vertical" size={24} color="black" />
                  </TouchableOpacity>
                }>
                <MenuItem onPress={() => { setHomeScreenMenuVisible(false), navigation.navigate('EditProfileScreen', { myNickname: (route.params as any).myNickname }), console.log("bu kullanıcı adı:", (route.params as any).myNickname) }}>Hakkımda</MenuItem>
              </Menu>
            ),
          })} />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={({ route }) => ({ title: (route.params as any).myNickname })} />
        <Stack.Screen
          name="ContactsScreen"
          component={ContactsScreen}
          options={{ title: "Kişiler:" }} />
        <Stack.Screen
          name="AboutScreen"
          component={AboutScreen}
          options={({ route }) => ({ title: (route.params as any).personNickname })} />
        <Stack.Screen
          name="SendMessageScreen"
          component={SendMessageScreen}
          options={({ route }) => ({
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -25 }}><Image source={{ uri: (route.params as any).personPhoto }} style={{ width: 40, height: 40, borderRadius: 100 }} /><Text style={{ fontSize: 20, fontWeight: 'bold' }}>{(route.params as any).personName}</Text></View>
            )
          })} />
        <Stack.Screen
          name="VideoCallScreen"
          component={VideoCallScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}