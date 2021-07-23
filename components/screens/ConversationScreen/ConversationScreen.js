import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native';
import styles from './styles';
import Reinput from 'reinput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import moment from 'moment';

import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
const DEFAULT_COIN_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/meet-a-dime.appspot.com/o/default_1.png?alt=media&token=23ab5b95-0214-42e3-9c54-d7811362aafc';

export default function ConversationScreen({ route, navigation }, props) {
  const isFocused = useIsFocused();
  const firestore = firebase.firestore();
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadedInForm, setLoadedInForm] = useState(false);
  const [loading, setLoading] = useState('');
  const [response1, setResponse1] = useState('');
  const [response2, setResponse2] = useState('');
  const [response3, setResponse3] = useState('');
  const [response4, setResponse4] = useState('');
  const [response5, setResponse5] = useState('');
  const [response6, setResponse6] = useState('');
  const [response7, setResponse7] = useState('');
  const [response8, setResponse8] = useState('');
  const [response9, setResponse9] = useState('');
  const [response10, setResponse10] = useState('');
  const [response11, setResponse11] = useState('');
  const [response12, setResponse12] = useState('');

  const message2Ref = useRef();
  const message3Ref = useRef();
  const message4Ref = useRef();
  const message5Ref = useRef();
  const message6Ref = useRef();
  const message7Ref = useRef();
  const message8Ref = useRef();
  const message9Ref = useRef();
  const message10Ref = useRef();
  const message11Ref = useRef();
  const message12Ref = useRef();
  const submitRef = useRef();

  const MAX_ANSWER_LENGTH = 280;

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

  var orient = {
    1: 'Heterosexual',
    2: 'Homosexual',
    3: 'Bisexual',
    4: 'Bisexual',
  };

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  function isLegal(date, minimum_age = 18) {
    const [year, month, day] = date.split('-');
    const [y, m, d] = moment()
      .subtract(18, 'years')
      .format('yyyy-MM-DD')
      .split('-');

    var d1 = new Date(y, m, d);
    var d2 = new Date(year, month, day);
    // console.log(d2 <= d1 ? true : false);
    return d2 <= d1 ? true : false;
  }

  function handleError(error) {
    if (error === 'auth/email-already-in-use') {
      setEmailError('This email is already in use.');
    } else if (error === 'auth/invalid-email') {
      setEmailError('Please enter a valid email address.');
    } else {
      setErrorEmail('There was an error making your account');

      setAccountError('There was an error making your account');
    }
  }

  async function fetchUserData() {
    var doc = await firestore.collection('users').doc(currentUser.uid).get();
    if (doc && doc.exists) {
      if (doc.data().initializedProfile === 0) {
        setResponse1('');
        setResponse2('');
        setResponse3('');
        setResponse4('');
        setResponse5('');
        setResponse6('');
        setResponse7('');
        setResponse8('');
        setResponse9('');
        setResponse10('');
        setResponse11('');
        setResponse12('');
      } else {
        setResponse1(doc.data().question1Answer);
        setResponse2(doc.data().question2Answer);
        setResponse3(doc.data().question3Answer);
        setResponse4(doc.data().question4Answer);
        setResponse5(doc.data().question5Answer);
        setResponse6(doc.data().question6Answer);
        setResponse7(doc.data().question7Answer);
        setResponse8(doc.data().question8Answer);
        setResponse9(doc.data().question9Answer);
        setResponse10(doc.data().question10Answer);
        setResponse11(doc.data().question11Answer);
        setResponse12(doc.data().question12Answer);
      }
    }

    setLoadedInForm(true);
  }

  async function getData() {
    await fetchUserData();
  }
  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  async function handleSubmit() {
    setLoading(true);
    setSaving(true);
    var hasError = false;

    if (
      response1 === '' ||
      response2 === '' ||
      response3 === '' ||
      response4 === '' ||
      response5 === '' ||
      response6 === '' ||
      response7 === '' ||
      response8 === '' ||
      response9 === '' ||
      response10 === '' ||
      response11 === '' ||
      response12 === ''
    ) {
      hasError = true;
      setError('Please fill out the response');
    }
    if (
      response1.length > MAX_ANSWER_LENGTH ||
      response2.length > MAX_ANSWER_LENGTH ||
      response3.length > MAX_ANSWER_LENGTH ||
      response4.length > MAX_ANSWER_LENGTH ||
      response5.length > MAX_ANSWER_LENGTH ||
      response6.length > MAX_ANSWER_LENGTH ||
      response7.length > MAX_ANSWER_LENGTH ||
      response8.length > MAX_ANSWER_LENGTH ||
      response9.length > MAX_ANSWER_LENGTH ||
      response10.length > MAX_ANSWER_LENGTH ||
      response11.length > MAX_ANSWER_LENGTH ||
      response12.length > MAX_ANSWER_LENGTH
    ) {
      hasError = true;
      setError(
        'Your answer must be less than ' + MAX_ANSWER_LENGTH + ' characters'
      );
    }
    if (!hasError) {
      try {
        await firestore.collection('users').doc(currentUser.uid).update({
          question1Answer: response1,
          question2Answer: response2,
          question3Answer: response3,
          question4Answer: response4,
          question5Answer: response5,
          question6Answer: response6,
          question7Answer: response7,
          question8Answer: response8,
          question9Answer: response9,
          question10Answer: response10,
          question11Answer: response11,
          question12Answer: response12,
        });

        await firestore.collection('users').doc(currentUser.uid).update({
          initializedProfile: 1,
        });

        setLoading(false);
        setSaving(false);
        navigation.navigate('Profile');
      } catch (error) {
        console.log(error);
        setLoading(false);
        setSaving(false);
        setError(error);
      }
    }
  }

  function onCancelPress() {
    navigation.navigate('Profile');
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='never'
        // scrollEnabled={scroll}
      >
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Conversation Starters</Text>
        </View>

        {error !== '' && <Text style={styles.generalError}>{error}</Text>}

        {loadedInForm && (
          <View>
            <Reinput
              style={styles.input}
              label={'Question 1: ' + question1}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response1}
              returnKeyType='Next'
              //error={errorEmail}
              onChangeText={(text) => setResponse1(text)}
              onSubmitEditing={() => {
                message2Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 2: ' + question2}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response2}
              ref={message2Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse2(text)}
              onSubmitEditing={() => {
                message3Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 3: ' + question3}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response3}
              ref={message3Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse3(text)}
              onSubmitEditing={() => {
                message4Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 4: ' + question4}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response4}
              ref={message4Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse4(text)}
              onSubmitEditing={() => {
                message5Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 5: ' + question5}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response5}
              ref={message5Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse5(text)}
              onSubmitEditing={() => {
                message6Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 6: ' + question6}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response6}
              ref={message6Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse6(text)}
              onSubmitEditing={() => {
                message7Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 7: ' + question7}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response7}
              ref={message7Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse7(text)}
              onSubmitEditing={() => {
                message8Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 8: ' + question8}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response8}
              ref={message8Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse8(text)}
              onSubmitEditing={() => {
                message9Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 9: ' + question9}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response9}
              ref={message9Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse9(text)}
              onSubmitEditing={() => {
                message10Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 10: ' + question10}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response10}
              ref={message10Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse10(text)}
              onSubmitEditing={() => {
                message11Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 11: ' + question11}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response11}
              ref={message11Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse11(text)}
              onSubmitEditing={() => {
                message12Ref.current.focus();
              }}
              autoCapitalize='none'
            />
            <Reinput
              style={styles.input}
              label={'Question 12: ' + question12}
              labelActiveColor='#E64398'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              activeColor='#E64398'
              value={response12}
              ref={message12Ref}
              //error={errorEmail}
              onChangeText={(text) => setResponse12(text)}
              // onSubmitEditing={() => {
              //   submitRef.current.scrollToOffset({ offset: 0, animated: true });
              // }}
              autoCapitalize='none'
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              ref={submitRef}
            >
              <Text style={styles.buttonTitle}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            <Text onPress={onCancelPress} style={styles.footerLink}>
              Cancel
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
