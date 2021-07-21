import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import moment from 'moment';
import { useRoute } from '@react-navigation/core';
import { io } from 'socket.io-client';

export default function ChatScreen({ route, navigation }) {
  const firestore = firebase.firestore();
  const messageRef = useRef('');
  const socketRef = useRef('');
  const matchPhotoRef = useRef('');
  const myPhotoRef = useRef('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [sentMessage, setSentMessage] = useState(false);
  const [room, setRoom] = useState('');
  const roomRef = useRef('');
  const [socket, setSocket] = useState('');
  const { currentUser, logout } = useAuth();

  const [match_age, setMatchAge] = useState('');
  const [match_name, setMatchName] = useState('user');
  const [match_sex, setMatchSex] = useState('');
  const [match_photo, setMatchPhoto] = useState('');

  const { match_id, timeout } = route.params;

  var text = '';

  async function fetchMatchInfo() {
    try {
      const token = currentUser && (await currentUser.getIdToken());
      var config = {
        method: 'post',
        url: 'https://meetadime.herokuapp.com/api/getbasicuser',
        header: {
          'Content-Type': 'application/json',
          //   Authorization: `Bearer ${token}`,
        },
        data: { uid: match_id },
      };
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      var response = await axios(config);
      console.log('Fetching data');
      setMatchAge(moment().diff(response.data.birth, 'years'));
      setMatchName(response.data.firstName);
      setMatchSex(response.data.sex);
      setMatchPhoto(response.data.photo);

      if (response.data.photo === '/DimeAssets/hearteyes.png') {
        matchPhotoRef.current = '../../../assets' + response.data.photo;
      } else matchPhotoRef.current = response.data.photo;
      myPhotoRef.current = response.data.photo;
    } catch (error) {
      console.log(error);
    }
  }

  function hash_str(str) {
    var hash = 0,
      i,
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  const id = currentUser.uid;
  useEffect(() => {
    fetchMatchInfo();
    var roomInUseEffect = '';
    const sock = io('https://meetadime.herokuapp.com/');
    sock.auth = { id };
    sock.connect();
    sock.on('connect', () => {
      console.log(
        `Email: "${currentUser.email}" \n With User ID: "${currentUser.uid}" connected with socket id: "${sock.id}"`
      );
    });

    const ids = [currentUser.uid, match_id];
    ids.sort();
    const new_room = ids[0] + ids[1];
    roomRef.current = new_room;
    sock.emit(
      'join-room',
      currentUser.uid.toString(),
      new_room.toString(),
      function (message) {
        if (message === 'joined') {
          setRoom(new_room);
          roomInUseEffect = new_room;
        }
      }
    );

    setSocket(sock);
    socketRef.current = sock;

    sock.on('message', (message, user, messageID) => {
      var messageId = hash_str(messageID + new Date().toDateString());

      sock.emit(
        'seen-message',
        currentUser.uid,
        new_room,
        messageID,
        function () {}
      );
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, {
          _id: messageId,
          text: message,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: currentUser.uid,
            avatar: matchPhotoRef.current,
          },
        })
      );
    });

    sock.on('abandoned', (message) => {
      //Somehow show the user their match left

      setTimeout(async () => {
        await firestore
          .collection('users')
          .doc(currentUser.uid)
          .update({
            FailMatch: firebase.firestore.FieldValue.arrayUnion(match_id),
          });
        await firestore
          .collection('users')
          .doc(match_id)
          .update({
            FailMatch: firebase.firestore.FieldValue.arrayUnion(
              currentUser.uid
            ),
          });

        sock.emit('leave-room', currentUser.uid, room);
        // Clear timeouts
        console.log('LEAVING ROOM');
        navigation.navigate('Home');
      }, 0);
    });
  }, []);

  const onSend = useCallback((newMessage = []) => {
    console.log(newMessage);
    console.log(matchPhotoRef.current);
    var messageId = hash_str(
      newMessage[0].text +
        new Date().toDateString() +
        Math.random(100).toString()
    );

    socketRef.current.emit(
      'send-to-room',
      currentUser.uid,
      roomRef.current,
      newMessage[0].text,
      messageId,
      true,
      () => {}
    );
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage)
    );
  }, []);

  async function handleAbandon() {
    socketRef.current.emit('leave-room', currentUser.uid, roomRef.current);
    await firestore
      .collection('users')
      .doc(currentUser.uid)
      .update({
        FailMatch: firebase.firestore.FieldValue.arrayUnion(match_id),
      });
    await firestore
      .collection('users')
      .doc(match_id)
      .update({
        FailMatch: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
      });

    navigation.navigate('Home');
  }
  //   function handleSubmit() {
  //     console.log('Made it to submit');
  //     setSentMessage(true);
  //     var temp = message;
  //     messageArray.push({
  //       key: '1',
  //       message: temp,
  //       author: 'Test author',
  //     });
  //   }

  return (
    <>
      <View>
        <TouchableOpacity style={styles.button} onPress={handleAbandon}>
          <Text>Abandon</Text>
        </TouchableOpacity>
      </View>
      <GiftedChat
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: 'white',
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: '#e5e5ea',
                },
                right: {
                  backgroundColor: '#e64398',
                },
              }}
            />
          );
        }}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        ref={messageRef}
        alwaysShowSend
        scrollToBottom
      />
    </>
  );
}
