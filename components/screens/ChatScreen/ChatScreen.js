import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Modal,
  Pressable,
  LogBox,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  GiftedChat,
  Bubble,
  Actions,
  Send,
  Composer,
  InputToolbar,
  SystemMessage,
} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import moment from 'moment';
import { useRoute } from '@react-navigation/core';
import { io } from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
export default function ChatScreen({ route, navigation }) {
  const firestore = firebase.firestore();
  const messageRef = useRef('');
  const socketRef = useRef('');
  const matchPhotoRef = useRef('');
  // const myPhotoRef = useRef('');
  const [error, setError] = useState('');
  const emojis = ['❤️', '🥰', '😇'];
  var random_emoji = emojis[Math.floor(Math.random() * 3)];

  const [welcomeMessage, setWelcomeMessage] = useState(
    'Joined the room. Good luck! ' + random_emoji
  );
  const [userSaidYes, setUserSaidYes] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalText, setModalText] = useState(
    'You did the time, do you want the dime?'
  );
  const [images, setImages] = useState([]);
  const timeoutRef1 = useRef(null);
  const [sentMessage, setSentMessage] = useState(false);
  const [room, setRoom] = useState('');
  const roomRef = useRef('');
  const [socket, setSocket] = useState('');
  const { currentUser, logout } = useAuth();
  const EXPIRE_IN_MINUTES = 1; // 10 minutes

  const modalExpire = 30000; // 30 seconds in MS

  const DEFAULT_COIN_IMAGE =
    'https://firebasestorage.googleapis.com/v0/b/meet-a-dime.appspot.com/o/default_1.png?alt=media&token=23ab5b95-0214-42e3-9c54-d7811362aafc';

  const [match_age, setMatchAge] = useState('');
  const [matchImageSize, setMatchImageSize] = useState(75);
  const [matchInfoContainer, setMatchInfoContainer] = useState(80);
  // const [matchImageSize, setMatchImageSize] = useState(170);
  // const [matchInfoContainer, setMatchInfoContainer] = useState(180);
  const isFocused = useIsFocused();
  const [match_name, setMatchName] = useState('user');
  const [match_sex, setMatchSex] = useState('');
  const [match_photo, setMatchPhoto] = useState(DEFAULT_COIN_IMAGE);
  const [modalVisible, setModalVisible] = useState(false);
  const [observerState, setObserverState] = useState(null);
  const [timeoutState, setTimeoutState] = useState(null);
  const [welcomeModal, setWelcomeModal] = useState(true);
  const [extendedTimeoutState, setExtendedTimeoutState] = useState(null);
  const { match_id, timeout, user_initialized } = route.params;
  const observer = useRef(null);
  const extendedTimeoutRef = useRef();

  const [bothInitialized, setBothInitialized] = useState(false);
  const [match_initialized, setMatchInitialized] = useState(-1);
  const [match_responses, setMatchResponses] = useState([]);
  const question1 = 'What do you like to do for fun or to relax?';
  const question2 = 'What do you do for a living?';
  const question3 = 'Would you say you are a romantic?';
  const question4 = 'Are you an optimist or a pessimist?';
  const question5 = 'What are you most passionate about?';
  const question6 = "Do you like horoscopes? If so, what's your sign?";
  const question7 = 'What does an ideal date look like in your eyes?';
  const question8 = 'What does your ideal future look like?';
  const question9 = 'What is your favorite type of music?';
  const question10 = 'Do you have any pets? If you do, tell me about them!';
  const question11 = 'Do you have any sibilings? If so, how many?';
  const question12 = 'What is your favorite game to play?';
  const questions = [
    question1,
    question2,
    question3,
    question4,
    question5,
    question6,
    question7,
    question8,
    question9,
    question10,
    question11,
    question12,
  ];
  const question_emojis = [
    '🌴',
    '💸',
    '😘',
    '😄',
    '🎺',
    '♑',
    '🥰',
    '🔮',
    '🎵',
    '🐾',
    '👨‍👨‍👦‍👦',
    '🎮',
  ];

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
      // myPhotoRef.current = response.data.photo;
      var my_initialized = user_initialized;

      // console.log(my_initialized);
      // console.log(response.data.initializedProfile);
      if (my_initialized === 1 && response.data.initializedProfile === 1) {
        setBothInitialized(true);
        setMatchResponses(response.data.answers);
        console.log('BOTH INIT');
      }
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

  function handleRandomQuestion(matches_firstname, match_responses) {
    var random_num = Math.floor(Math.random() * 12);
    var selected = questions[random_num];
    var related_emoji = question_emojis[random_num];
    console.log(`${matches_firstname} was asked: ${selected}\n`);
    console.log(`${related_emoji} ${match_responses[random_num]}`);
    Alert.alert(
      `${matches_firstname} was asked: ${selected}\n`,
      `${related_emoji} ${match_responses[random_num]}`,
      [
        {
          text: 'OK',
        },
      ]
    );
  }

  function noMatch() {
    if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
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
          FailMatch: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
        });
      socketRef.current.emit('leave-room', currentUser.uid, room);
      console.log('LEFT MY ROOM TOO');
      setModalVisible(false);
      if (observer.current !== null) observer.current();
      if (observerState !== null) observerState();
      setObserverState(null);
      observer.current = null;

      if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
      navigation.navigate('After', {
        match_id: match_id,
        type: 'user_didnt_go_well',
      });
    }, 0);
  }

  async function setIsChatting() {
    // console.log('Checking searching doc');
    try {
      var myDoc = await firestore
        .collection('searching')
        .doc(currentUser.uid)
        .get();
      if (myDoc.exists) {
        await firestore
          .collection('searching')
          .doc(currentUser.uid)
          .update({ isChatting: 1 });
      } else {
        await firestore
          .collection('searching')
          .doc(match_id)
          .update({ isChatting: 1 });
      }
      console.log('Set is chatting.');
    } catch (error) {
      console.log(error);
    }
  }

  async function noMatchTimeout() {
    var seeker = 'none';
    var match = 'none';

    try {
      var docRef = firestore.collection('searching').doc(currentUser.uid);
      var doc = await docRef.get();
      if (doc.exists) {
        seeker = currentUser.uid;
        match = match_id;
      } else {
        seeker = match_id;
        match = currentUser.uid;
      }

      if (currentUser.uid === seeker) {
        await firestore.collection('searching').doc(currentUser.uid).update({
          seekerTail: 'timeout',
        });
        console.log('I am the seeker, I set my value TIMEOUT.');
      }

      if (currentUser.uid === match) {
        await firestore.collection('searching').doc(match_id).update({
          matchTail: 'timeout',
        });
        console.log('I am the match, I set my value TIMEOUT.');
      }
    } catch (error) {
      console.log(error);
    }

    socketRef.current.emit('leave-room-silently', currentUser.uid, room);
    if (observer.current !== null) observer.current();
    if (observerState !== null) observerState();
    setObserverState(null);
    observer.current = null;

    if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
    navigation.navigate('After', { match_id: match_id, type: 'timeout' });

    console.log('Left room silently');
  }

  async function pendingMatch() {
    setUserSaidYes(true);
    if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
    // This disconnects then sends to the /after page with a state.
    function leavePageWith(stateString) {
      socketRef.current.emit(
        'leave-room-silently',
        currentUser.uid,
        roomRef.current
      );
      setModalVisible(false);
      console.log('going to after page1');
      if (observer.current !== null) observer.current();

      if (observerState !== null) observerState();
      setObserverState(null);
      observer.current = null;
      clearTimeout(extended_timeout);
      clearTimeout(extendedTimeoutRef.current);
      clearTimeout(extendedTimeoutState);
      if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
      navigation.navigate('After', { match_id: match_id, type: stateString });
      console.log('going to after page2');
    }
    // This sets both eachothe to success matches, if we get actually get there.
    async function setSuccessMatches() {
      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({
          SuccessMatch: firebase.firestore.FieldValue.arrayUnion(match_id),
        });
      await firestore
        .collection('users')
        .doc(match_id)
        .update({
          SuccessMatch: firebase.firestore.FieldValue.arrayUnion(
            currentUser.uid
          ),
        });
    }

    // This extended timeout waits for an answer.
    var extended_timeout = setTimeout(() => {
      socketRef.current.emit(
        'leave-room-silently',
        currentUser.uid,
        roomRef.current
      );
      setExtendedTimeoutState(extended_timeout);
      extendedTimeoutRef.current = extended_timeout;

      setModalVisible(false);
      if (observer.current !== null) observer.current();

      if (observerState !== null) observerState();
      setObserverState(null);
      observer.current = null;
      if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
      navigation.navigate('After', {
        match_id: match_id,
        type: 'extended_timeout',
      });
    }, modalExpire);

    // Save in ref incase a regular abandon occurs.
    extendedTimeoutRef.current = extended_timeout;

    // Identify who is who.
    var seeker = 'none';
    var match = 'none';

    // There is only one doc. If I am the doc name, I am seeker. else, match
    var docRef = firestore.collection('searching').doc(currentUser.uid);
    var doc = await docRef.get();
    if (doc.exists) {
      seeker = currentUser.uid;
      match = match_id;
    } else {
      seeker = match_id;
      match = currentUser.uid;
    }

    // If im seeker, I need to set my value to true and wait for matchTail.
    if (currentUser.uid === seeker) {
      await firestore.collection('searching').doc(currentUser.uid).update({
        seekerTail: 'true',
      });
      console.log('I am the seeker, I set my value true.');
      // Now, check immediately just in case.
      var res = await firestore
        .collection('searching')
        .doc(currentUser.uid)
        .get();
      if (res.data().matchTail === 'true') {
        // OTHER PERSON SAID YES!!!!
        setSuccessMatches();
        console.log('match said yes!!');
        clearTimeout(extended_timeout);
        clearTimeout(extendedTimeoutRef.current);
        clearTimeout(extendedTimeoutState);
        clearTimeout(extendedTimeoutRef.current);
        clearTimeout(extendedTimeoutState);

        leavePageWith('match_made');
      } else {
        // Nothing yet, lets wait for a change to the matchTail.
        var localObserver = firestore
          .collection('searching')
          .doc(currentUser.uid)
          .onSnapshot((docSnapshot) => {
            if (
              docSnapshot &&
              docSnapshot.data() &&
              docSnapshot.data().matchTail === 'true'
            ) {
              // THEY SAID YES !! (but after)
              setSuccessMatches();
              console.log('other person (the match) said yes after');
              setObserverState(null);
              observer.current = null;
              localObserver();
              clearTimeout(extended_timeout);
              clearTimeout(extendedTimeoutRef.current);
              clearTimeout(extendedTimeoutState);

              leavePageWith('match_made');
            }
            if (
              docSnapshot &&
              docSnapshot.data() &&
              docSnapshot.data().matchTail === 'timeout'
            ) {
              // The other person timed out..
              console.log('other person (the match) timed out');
              setObserverState(null);
              observer.current = null;
              localObserver();
              clearTimeout(extended_timeout);
              clearTimeout(extendedTimeoutRef.current);
              clearTimeout(extendedTimeoutState);

              leavePageWith('match_timedout');
            }
          });
        // setObserverState(localObserver);
      }
    }

    // If im match, I need to set my match to true and wait for seekerTail.
    if (currentUser.uid === match) {
      await firestore.collection('searching').doc(match_id).update({
        matchTail: 'true',
      });
      console.log('I am the match, I set my value true.');
      // Now, check immediately just in case.
      res = await firestore.collection('searching').doc(match_id).get();
      if (res.data().seekerTail === 'true') {
        // OTHER PERSON SAID YES!!!!
        setSuccessMatches();
        console.log('seeker said yes!!');
        clearTimeout(extended_timeout);
        clearTimeout(extendedTimeoutRef.current);
        clearTimeout(extendedTimeoutState);

        leavePageWith('match_made');
      } else {
        // I need to passively listen for a document change.
        var localObserver = firestore
          .collection('searching')
          .doc(match_id)
          .onSnapshot((docSnapshot) => {
            console.log(docSnapshot);
            if (
              docSnapshot &&
              docSnapshot.data() &&
              docSnapshot.data().seekerTail === 'true'
            ) {
              // THEY SAID YES !! (but after)
              setSuccessMatches();
              console.log('other person (the seeker) said yes after');

              setObserverState(null);
              observer.current = null;
              localObserver();
              clearTimeout(extended_timeout);
              clearTimeout(extendedTimeoutRef.current);
              clearTimeout(extendedTimeoutState);

              leavePageWith('match_made');
            }
            if (
              docSnapshot &&
              docSnapshot.data() &&
              docSnapshot.data().seekerTail === 'timeout'
            ) {
              // The other person timed out..
              console.log('other person (the seeker) timed out');
              setObserverState(null);
              observer.current = null;
              localObserver();
              clearTimeout(extended_timeout);
              clearTimeout(extendedTimeoutRef.current);
              clearTimeout(extendedTimeoutState);

              leavePageWith('match_timedout');
            }
          });
        // setObserverState(localObserver);
      }
    }
  }

  const id = currentUser.uid;

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    LogBox.ignoreLogs(['Animated.event now requires']);
    async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions for this to work!');
        }
      }
    };

    if (isFocused) {
      fetchMatchInfo();
      setIsChatting();
      var roomInUseEffect = '';
      if (timeout !== null) clearTimeout(timeout);
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
              _id: user,
              name: match_name,
              avatar: matchPhotoRef.current,
            },
          })
        );
      });

      sock.on(
        'image',
        (message, user, message_ID) => {
          var messageId = hash_str(message_ID + new Date().toDateString());
          console.log('new image recieved!');
          sock.emit(
            'seen-message',
            currentUser.uid,
            new_room,
            message_ID,
            function () {
              // console.log('I sent to the room that I saw that message.');
            }
          );
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, {
              _id: messageId,
              text: '',
              image: message,
              createdAt: new Date(),
              user: {
                _id: user,
                name: match_name,
                avatar: matchPhotoRef.current,
              },
            })
          );
        }
        // console.log(user);
      );

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
          if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
          if (observer.current !== null) observer.current();
          if (observerState !== null) observerState();
          setObserverState(null);
          observer.current = null;
          if (observerState !== null) observerState();

          observer.current = null;
          navigation.navigate('After', {
            match_id: match_id,
            type: 'match_abandoned',
          });
        }, 0);
      });

      setTimeout(() => {
        setModalVisible(true);
      }, EXPIRE_IN_MINUTES * 60000);
      timeoutRef1.current = setTimeout(() => {
        console.log('calling no match timeout');
        setModalVisible(false);
        noMatchTimeout();
      }, EXPIRE_IN_MINUTES * 60000 + modalExpire);
    }
    return () => {
      socketRef.current.emit('leave-room-silently', currentUser.uid, room);
      console.log('left chat, cleaned up.');
      setModalVisible(false);
      if (observer.current !== null) observer.current();
      if (observerState !== null) observerState();
      setObserverState(null);
      observer.current = null;

      if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
      if (timeoutState !== null) clearTimeout(timeoutState);
    };
  }, [isFocused]);

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

  function doubleCheck() {
    Alert.alert(
      'You are about to report this user.',
      'All reports are secret and will not alert this match.',
      [
        {
          text: 'OK',
          onPress: handleReport,
        },
        {
          text: 'Go Back',
        },
      ]
    );
  }
  async function handleReport() {
    var chat_history = [];

    messages.forEach((element) => {
      if (element.image === undefined) chat_history.push(element);
    });
    console.log(chat_history);

    try {
      var result = await firestore
        .collection('reports')
        .doc(currentUser.uid)
        .get();
      if (result.exists) {
        const obj = {};
        obj[match_id] = chat_history;
        await firestore.collection('reports').doc(currentUser.uid).update(obj);
      } else {
        const obj = {};
        obj[match_id] = chat_history;
        await firestore.collection('reports').doc(currentUser.uid).set(obj);
      }
    } catch (error) {
      console.log(error);
    }

    socketRef.current.emit('leave-room', currentUser.uid, roomRef.current);
    console.log('REPORTED OTHER USER.');

    try {
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
    } catch (error) {
      console.log(error);
    }
    if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
    if (observer.current !== null) observer.current();
    if (observerState !== null) observerState();
    setObserverState(null);
    observer.current = null;

    navigation.navigate('After', {
      match_id: match_id,
      type: 'user_reported',
    });

    return;
  }

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
    if (timeoutRef1.current !== null) clearTimeout(timeoutRef1.current);
    if (observer.current !== null) observer.current();
    if (observerState !== null) observerState();
    setObserverState(null);
    observer.current = null;

    navigation.navigate('After', {
      match_id: match_id,
      type: 'user_abandoned',
    });
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

  async function sendImage(type = 'library') {
    let result = null;

    if (type === 'library')
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        base64: true,
        aspect: [3, 3],
        quality: 1,
      });
    else if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === 'granted')
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          base64: true,
          aspect: [3, 3],
          quality: 1,
        });
    }

    if (result.cancelled) return;
    let compressed = await ImageManipulator.manipulateAsync(result.uri, [], {
      format: ImageManipulator.SaveFormat.JPEG,
      compress: 0,
      base64: true,
    });

    var the_image = compressed.base64;
    // console.log(compressed.base64);
    var image_id = Date().toString();
    socket.emit(
      'send-image-to-room',
      currentUser.uid,
      roomRef.current,
      'data:image/jpeg;base64,' + the_image,
      image_id
      // function () {
      //   console.log('recieved on server side.');
      // }
    );

    var messageId = hash_str(image_id + new Date().toDateString());

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, {
        _id: messageId,
        text: '',
        image: result.uri,
        createdAt: new Date(),
        user: {
          _id: currentUser.uid,
        },
      })
    );
  }
  return (
    <>
      <View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginTop: 50,
            height: 100,

            alignContent: 'center',
          }}>
          <Image
            style={styles.logo}
            source={require('../../../assets/DimeAssets/headerlogo.png')}
          />
          <TouchableOpacity
            onLongPress={doubleCheck}
            style={styles.button}
            onPress={handleAbandon}>
            <Text style={styles.buttonTitle}>Abandon</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalText}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {!userSaidYes && (
                  <>
                    <Pressable onPress={pendingMatch}>
                      <Image
                        style={styles.dimeImages}
                        source={require('../../../assets/DimeAssets/hearteyes.png')}></Image>
                    </Pressable>
                    <Pressable onPress={noMatch}>
                      <Image
                        style={styles.dimeImages}
                        source={require('../../../assets/DimeAssets/sleepycoin.png')}></Image>
                    </Pressable>
                  </>
                )}
                {userSaidYes && (
                  <Image
                    style={styles.dimeImages}
                    source={require('../../../assets/DimeAssets/coinWaiting.gif')}></Image>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <GiftedChat
        renderComposer={(props) => {
          return (
            <Composer
              {...props}
              placeholder="Type your message here..."
              textInputStyle={{
                color: '#222B45',
                backgroundColor: '#fff',
                borderWidth: 1,
                borderRadius: 20,
                marginRight: 10,
                borderColor: '#e5e5ea',
                paddingTop: 8.5,
                paddingHorizontal: 12,
                marginLeft: 0,
                marginBottom: 10,
              }}
            />
          );
        }}
        renderSend={(sendProps) => {
          return (
            <Send
              {...sendProps}
              containerStyle={{
                width: 35,
                height: 35,
                borderRadius: '100%',
                backgroundColor: '#e4a',
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 4,
                marginBottom: 7,
              }}>
              <Ionicons name="triangle-sharp" size={20} color="white" />
            </Send>
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                left: {
                  fontSize: props.currentMessage.text.match(
                    /\p{Extended_Pictographic}/
                  )
                    ? 30
                    : null,
                  lineHeight: props.currentMessage.text.match(
                    /\p{Extended_Pictographic}/
                  )
                    ? 30
                    : null,
                },
                right: {
                  color: 'white',
                  fontSize: props.currentMessage.text.match(
                    /\p{Extended_Pictographic}/
                  )
                    ? 30
                    : null,
                  lineHeight: props.currentMessage.text.match(
                    /\p{Extended_Pictographic}/
                  )
                    ? 30
                    : null,
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
        user={{ _id: currentUser.uid }}
        ref={messageRef}
        // renderActions={(props) => {
        //   <TouchableOpacity style={styles.button} onPress={sendImage}>
        //     <Text>Select Image</Text>
        //   </TouchableOpacity>;
        // }}

        renderChatEmpty={(props) => {
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: Dimensions.get('window').height / 2 - 100,
                // marginHorizontal: Dimensions.get("window").width / 5,
                transform: [{ scaleY: -1 }],
              }}>
              <Text style={{ fontSize: 18 }}>{welcomeMessage}</Text>
            </View>
          );
        }}
        renderActions={(props) => {
          return (
            <>
              {bothInitialized && (
                <Actions
                  {...props}
                  containerStyle={{
                    width: 30,
                    height: 40,
                    alignItems: 'flex-end',
                    justifyContent: 'center',

                    marginBottom: 6,
                  }}
                  icon={() => (
                    <View style={{}}>
                      <MaterialCommunityIcons
                        name="message-outline"
                        size={30}
                        color="#bad"
                      />
                    </View>
                  )}
                  options={{
                    'Conversation Starters': () => {
                      console.log('Conversations pressed');
                      handleRandomQuestion(match_name, match_responses);
                    },
                    Cancel: () => {
                      console.log('Cancel');
                    },
                  }}
                  optionTintColor="#e4a"
                />
              )}
              <Actions
                {...props}
                containerStyle={{
                  width: 40,
                  height: 40,
                  alignItems: 'flex-start',
                  justifyContent: 'center',

                  marginBottom: 6,
                }}
                icon={() => (
                  <View style={{}}>
                    <AntDesign name="pluscircle" size={30} color="#bad" />
                  </View>
                )}
                options={{
                  'Choose From Library': () => {
                    console.log('Choose From Library');
                    sendImage();
                  },
                  'Use Camera': () => {
                    console.log('Select Photo');
                    sendImage('camera');
                  },
                  Cancel: () => {
                    console.log('Cancel');
                  },
                }}
                optionTintColor="#e4a"
              />
            </>
          );
        }}
        alwaysShowSend
        scrollToBottom
        onPressAvatar={() => {}}
      />

      {/* <View
        style={{
          position: 'absolute',
          bottom: 100,
        }}>
        {bothInitialized && (
          <>
            <MaterialCommunityIcons
              name="message-outline"
              style={{ marginLeft: 10 }}
              size={30}
              color="#bad"
            />
            <Text style={{ marginLeft: 10, color: '#bad' }}>Convo</Text>
            <Text style={{ marginLeft: 10, color: '#bad' }}>Starters</Text>
          </>
        )}
      </View> */}

      <View
        style={{
          position: 'absolute',
          top: 140,
        }}>
        <TouchableOpacity
          onPress={() => {
            if (matchImageSize === 75) {
              setMatchImageSize(170);
              setMatchInfoContainer(180);
            }
            if (matchImageSize === 170) {
              setMatchImageSize(75);
              setMatchInfoContainer(80);
            }
          }}>
          {matchImageSize !== 170 && (
            <>
              <Text style={{ marginLeft: 10, color: '#bad' }}>Match</Text>
              <MaterialIcons
                style={{ marginLeft: 10 }}
                name="info"
                size={40}
                color="#bad"
              />
            </>
          )}

          {matchImageSize === 170 && (
            <View
              style={{
                flexDirection: 'column',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: matchImageSize === 75 ? 'center' : 'center',

                height: matchInfoContainer,
                backgroundColor: 'rgba(187, 170, 221, 0.5)',
                borderRadius: 20,
                paddingHorizontal: 10,
                alignContent: 'flex-start',
                marginLeft: 10,
              }}>
              <Image
                style={{
                  height: matchImageSize,
                  width: matchImageSize,
                  borderRadius: 400 / 2,
                  marginVertical: 10,
                  overflow: 'hidden',
                  borderWidth: 3,
                  borderColor: '#e4a',
                }}
                source={{ uri: match_photo }}
              />

              <Text
                style={{
                  color: matchImageSize === 75 ? '#E64398' : '#E64398',
                  marginLeft: 10,
                  fontSize: matchImageSize === 75 ? 16 : 20,
                }}>
                {match_name}
              </Text>

              <Text
                style={{
                  color: matchImageSize === 75 ? '#E64398' : '#E64398',
                  marginLeft: 10,
                  fontSize: matchImageSize === 75 ? 16 : 20,
                }}>
                {match_age}
              </Text>

              <Text
                style={{
                  color: matchImageSize === 75 ? '#E64398' : '#E64398',
                  marginLeft: 10,
                  fontSize: matchImageSize === 75 ? 16 : 20,
                }}>
                {match_sex}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
