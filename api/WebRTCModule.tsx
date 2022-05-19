import React, { useEffect } from 'react';
import WebrtcSimple from 'react-native-webrtc-simple';

const WebRTCModule = () => {
useEffect(() => {
    const configuration = {
      optional: null,
      key: Math.random().toString(36).substr(2, 4), //optional
    };
    
    WebrtcSimple.start(configuration as any)
        .then((status) => {
        if (status) {
            const stream = WebrtcSimple.getLocalStream();
            console.log('My stream: ', stream);

            WebrtcSimple.getSessionId((id: string) => {
                console.log('UserId: ', id);
            });
        }
        })
        .catch();

    WebrtcSimple.listenings.callEvents((type, userData) => {   
      console.log('Type: ', type);
      // START_CALL
      // RECEIVED_CALL
      // ACCEPT_CALL
      // END_CALL   
      // MESSAGE
      // START_GROUP_CALL
      // RECEIVED_GROUP_CALL
      // JOIN_GROUP_CALL
      // LEAVE_GROUP_CALL
    });

    WebrtcSimple.listenings.getRemoteStream((remoteStream) => {
      console.log('Remote stream', remoteStream);
    });

}, []);
}

export const callToUser = (userId: any) => {
  const data = {};
  WebrtcSimple.events.call(userId, data);
};

export const acceptCall = () => {
  WebrtcSimple.events.acceptCall();
};

export const endCall = () => {
  WebrtcSimple.events.endCall();
};

export const switchCamera = () => {
  WebrtcSimple.events.switchCamera();
};

export const video = (enable: boolean) => {
  WebrtcSimple.events.videoEnable(enable);
};

export const audio = (enable: boolean) => {
  WebrtcSimple.events.audioEnable(enable);
};

export const sendMessage = (message: any) => {
    WebrtcSimple.events.message(message);
};

export const groupCall = (sessionId: string[]) => {
    const data = {};
    WebrtcSimple.events.groupCall(sessionId, data);    
};

export const joinGroup = (groupSessionId: string[]) => {
  WebrtcSimple.events.joinGroup(groupSessionId);
};

export const leaveGroup = () => {
  WebrtcSimple.events.leaveGroup();
};

export default WebRTCModule;