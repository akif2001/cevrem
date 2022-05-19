import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button } from 'react-native';
import { Camera } from 'expo-camera';

import {
    RTCView,
    mediaDevices,
    MediaStream,
    MediaStreamConstraints,
    RTCPeerConnection,
} from 'react-native-webrtc';

const VideoCallScreen = () => {
    const [localStream, setLocalStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();

    useEffect(() => {
        (async () => {
            await Camera.requestCameraPermissionsAsync();
            await Camera.requestMicrophonePermissionsAsync();
            //setHasPermission(status === 'granted');
        })();
    }, []);

    const startLocalStream = async () => {
            const devices = await (mediaDevices.getUserMedia({
                audio: true,
                video: true,
            }) as any).enumerateDevices();
            
            const isFrontCamera = true;
            const facing = isFrontCamera ? 'front' : 'environment';
            const videoSourceId = devices.find(
                (device: any) => device.kind === 'videoinput' && device.facing === facing,
            );

            const facingMode = isFrontCamera ? 'user' : 'environment';
            const constraints: MediaStreamConstraints = {
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500,
                        minHeight: 300,
                        minFrameRate: 30,
                    },
                    facingMode,
                    optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
                },
            };
            const newStream: any = await mediaDevices.getUserMedia(constraints);

            setLocalStream(newStream);

            console.log(devices);
    };

    const startCall = async () => {
        const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };
        const localPC = new RTCPeerConnection(configuration);
        const remotePC = new RTCPeerConnection(configuration);

        localPC.onicecandidate = (e) => {
            try {
                console.log('localPC icecandidate:', e);
                if (e.candidate) {
                    // Adım 4: Yerel cihazdan ICE adayını al ve çalıştır. Devamında oluşturulan ICE adayını yerel cihaza ilet
                    remotePC.addIceCandidate(e.candidate);
                }
            } catch (err) {
                console.error(`Error adding remotePC iceCandidate: ${err}`);
            }
        };
        remotePC.onicecandidate = (e) => {
            try {
                console.log('remotePC icecandidate:', e);
                if (e.candidate) {
                    // Adım 5: Uzak cihazdan ICE adayını al ve çalıştır.
                    localPC.addIceCandidate(e.candidate);
                }
            } catch (err) {
                console.error(`Error adding localPC iceCandidate: ${err}`);
            }
        };
        remotePC.onaddstream = (e) => {
            console.log('remotePC tracking with ', e);
            if (e.stream && remoteStream !== e.stream) {
                console.log('RemotePC received the stream', e.stream);
                setRemoteStream(e.stream);
            }
        };

        localPC.addStream(localStream as any);

        try {
            // Adım 1: Peer Connection oluşturulur ve uzak cihaza arama isteği (SDP) gönderilir.
            const offerSDP = await localPC.createOffer();
            console.log('Yerel cihaz üzerinden SDP isteği oluşturuldu:', offerSDP);
            await localPC.setLocalDescription(offerSDP);
            console.log('Uzak cihaza SDP isteği iletiliyor...');
            await remotePC.setRemoteDescription(localPC.localDescription);
            // Adım 2: Yerel cihazdan arama isteği (SDP) alındı. Yerel cihaza cevap gönderiliyor.
            console.log('Uzak cihazda cevap oluşturuluyor...');
            const answer = await remotePC.createAnswer();
            console.log('Uzak cihazda üretilen SDP cevabı:', answer.sdp);
            console.log('SDP cevabı yerel cihaza iletiliyor...');
            await remotePC.setLocalDescription(answer);
            // Adım 3: Uzak cihazın SDP yanıtı alınarak startIce() metodu çalıştırılıyor.
            await localPC.setRemoteDescription(remotePC.localDescription);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {!localStream && (
                <Button title="Kamerayı aç ve akışa başla" onPress={startLocalStream} />
            )}
            {localStream && (
                <Button
                    title="Arama yap"
                    onPress={startCall}
                    disabled={!!remoteStream}
                />
            )}
            <View style={styles.rtcview}>
                {localStream && (
                    <RTCView style={styles.rtc} streamURL={localStream.toURL()} />
                )}
            </View>
            <View style={styles.rtcview}>
                {remoteStream && (
                    <RTCView style={styles.rtc} streamURL={remoteStream.toURL()} />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },
    text: {
        fontSize: 30,
    },
    rtcview: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
        width: '100%',
        backgroundColor: 'black',
    },
    rtc: {
        width: '100%',
        height: '100%',
    },
    toggleButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default VideoCallScreen;