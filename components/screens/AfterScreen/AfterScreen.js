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

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import moment from 'moment';
import { useIsFocused, useRoute } from '@react-navigation/core';
import { io } from 'socket.io-client';

import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#dceaff',
    paddingTop: height / 4.5,
  },
  innerContainer: { flexDirection: 'row' },

  title: {},
  logo: {
    flex: 1,
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#E64398',
    alignSelf: 'center',
    margin: 10,
    marginTop: 35,
  },
  rangeContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 25,
    marginTop: 25,
    marginBottom: 25,
  },
  responseContainer: { flex: 1, alignItems: 'center' },
  response: {
    fontSize: 11,
  },
  headingContainer: { flex: 1, alignItems: 'center' },
  heading: {
    fontSize: 26,
    color: '#E64398',
  },
  slider: {
    width: width / 1.5,
    height: 1 / 2,
  },
  range: {
    marginBottom: 1,
  },
  end: { fontSize: 10, alignItems: 'center' },
  input: {
    height: 63,
    // color: '#E64398',
    // borderRadius: 5,
    overflow: 'hidden',
    // backgroundColor: 'white',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 30,
    marginRight: 30,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingBottom: 20,
  },

  firstname: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 63,
    borderRadius: 5,
    overflow: 'visible',
    // backgroundColor: 'white',
    maxWidth: width / 2.5,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 3,
    paddingLeft: 16,
  },
  lastname: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 63,
    borderRadius: 5,
    overflow: 'hidden',
    //backgroundColor: 'white',
    maxWidth: width / 2.5,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 35,
    marginRight: 3,
    paddingLeft: 0,
  },
  button: {
    // backgroundColor: '#e64398',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGroup: {},
  button: {
    backgroundColor: '#e64398',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    height: 48,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generalError: {
    fontSize: 11,
    paddingBottom: 8 / 2,
    paddingTop: 8 / 2,
    textAlign: 'center',
    color: '#fc1f4a',
  },
  register: {
    backgroundColor: '#e64398',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    marginBottom: 35,
    height: 48,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  Confirm: {
    flex: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#2e2e2d',
  },
  footerLink: {
    color: '#E64398',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default function AfterScreen({ route, navigation }) {
  const DEFAULT_COIN_IMAGE =
    'https://firebasestorage.googleapis.com/v0/b/meet-a-dime.appspot.com/o/default_1.png?alt=media&token=23ab5b95-0214-42e3-9c54-d7811362aafc';

  const { match_id, type } = route.params;
  const pageType = type;
  const firestore = firebase.firestore();
  const isFocused = useIsFocused();
  const messageRef = useRef('');
  const socketRef = useRef('');
  const matchPhotoRef = useRef(DEFAULT_COIN_IMAGE);
  const myPhotoRef = useRef('');
  const [error, setError] = useState('');
  const [match_exitMessage, setExitMessage] = useState('');
  const [match_phoneNumber, setPhoneNumber] = useState('');
  const [messages, setMessages] = useState([]);
  const [sentMessage, setSentMessage] = useState(false);
  const [room, setRoom] = useState('');
  const roomRef = useRef('');
  const [socket, setSocket] = useState('');
  const { currentUser, logout } = useAuth();

  const [match_age, setMatchAge] = useState('');
  const [match_name, setMatchName] = useState('user');
  const [match_sex, setMatchSex] = useState('');
  const [match_photo, setMatchPhoto] = useState(DEFAULT_COIN_IMAGE);
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
      console.log(response.data.photo);
      if (response.data.photo === '/DimeAssets/hearteyes.png') {
        matchPhotoRef.current = '../../../assets' + response.data.photo;
      } else matchPhotoRef.current = response.data.photo;
      myPhotoRef.current = response.data.photo;
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMatchOnMatchMade() {
    try {
      const token = currentUser && (await currentUser.getIdToken());
      // console.log(token);
      var config = {
        method: 'post',
        url: 'https://meetadime.herokuapp.com/api/getendmessages',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: {
          user_uid: currentUser.uid,
          match_uid: match_id,
        },
      };
      var response = await axios(config);

      // Recursion! Keep calling until it resolves.
      if (
        response &&
        response.data &&
        response.data.error === 'Not authorized; missing from matches'
      ) {
        setTimeout(() => {
          fetchMatchOnMatchMade();
        }, 500);
      }

      setExitMessage(response.data.matchExitMessage);
      setPhoneNumber(response.data.matchPhone);
      console.log(response.data.matchExitMessage);
      console.log(response.data.matchPhone);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchMatchInfo().then(() => {
        async function purgeOld() {
          try {
            // If I am "document host", clear the match field first.
            try {
              await firestore
                .collection('searching')
                .doc(currentUser.uid)
                .update({ match: '' });
              console.log('cleared old match before delete');
            } catch (error) {
              console.log('tried to clear match before delete, but failed');
              console.log('most of the time this is ok');
              // this is okay because this most likely wont exist on each load.
            }

            // Delete the document (if exists) if I am a "document host".
            await firestore
              .collection('searching')
              .doc(currentUser.uid)
              .delete();

            // The final mechanism for clearing. This is if I was a previous
            // "document joiner" or "filling in" the existing doc.
            // I will search all docs where my id is the match field, and clear it.
            // This will signal to those listening to that field that I am
            // no longer available.
            firestore
              .collection('searching')
              .where('match', '==', currentUser.uid)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  try {
                    firestore
                      .collection('searching')
                      .doc(doc.id)
                      .update({ match: '' });
                  } catch (error) {
                    console.log('doc match clear error on start');
                  }
                });
              })
              .catch((error) => {
                console.log('Error getting documents: ', error);
              });
          } catch (error) {
            console.log(error);
          }
        }
        // call the function that was just defined here.
        purgeOld();
        if (type === 'match_made') {
          fetchMatchOnMatchMade();
        }
      });
    }
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='never'
      >
        <Image style={styles.logo} source={{ uri: match_photo }} />
        <View style={styles.headingContainer}>
          {/* <Text stype={styles.heading}>{myPhoto.toString()}</Text> */}

          <Text style={styles.heading}>
            {match_name + ' ' + match_age + ' ' + match_sex}
          </Text>
          <Text style={styles.heading}>
            {pageType && pageType === 'match_abandoned' && 'Your match left 😥'}
            {pageType &&
              pageType === 'user_abandoned' &&
              "Sorry it didn't go well.. Keep flipping the coin 😊"}
            {pageType &&
              pageType === 'match_didnt_go_well' &&
              'Awkward, the other user said no. Keep looking 😌'}
            {pageType &&
              pageType === 'user_didnt_go_well' &&
              "Sorry it didn't go well.. Keep looking 😊"}
            {pageType &&
              pageType === 'match_timedout' &&
              'Your match timed out. You can match again in the future ⌛'}
            {pageType &&
              pageType === 'match_made' &&
              "You've matched with a Dime 🥰"}
            {pageType &&
              pageType === 'timeout' &&
              'You timed out. You can match again in the future ⌛'}
            {pageType && pageType === 'error' && 'Something went wrong ⚠️'}
            {pageType &&
              pageType === 'extended_timeout' &&
              'Timed out. You said yes, so you can match again in the future 🕓'}
            {pageType &&
              pageType === 'user_reported' &&
              'Other user was reported. This report is secret and they were not alerted 🚫'}
          </Text>
          {pageType && pageType == 'match_made' && (
            <Text style={styles.heading}>{match_phoneNumber}</Text>
          )}
          {pageType && pageType == 'match_made' && (
            <Text style={styles.heading}>{match_exitMessage}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.buttonTitle}>Go Home</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
