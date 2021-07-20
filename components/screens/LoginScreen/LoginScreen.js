import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Reinput from 'reinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import firebase from 'firebase';
import { auth } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const onFooterLinkPress = () => {
    navigation.navigate('Registration');
  };

  function handleError(error) {
    if (error === 'auth/wrong-password') {
      setError('Incorrect password.');
    } else if (error === 'auth/user-not-found') {
      setError('Your account does not exist.');
      setErrorEmail('Your account does not exist.');
    } else if (error === 'auth/too-many-requests') {
      setError('You are submitting too many requests, wait a few minutes.');
      setErrorEmail('Your account does not exist.');
    } else {
      setErrorEmail(error);

      setError(error);
    }
  }

  async function handleSubmit() {
    try {
      setError('');
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await login(email, password);

      navigation.navigate('Home');
    } catch (error) {
      handleError(error.code === undefined ? error : error.code);
    }
  }

  useEffect(() => {
    const firestore = firebase.firestore();
    async function purgeOld() {
      console.log('THIS SHOULD ONLY PRINT ONCE PER LOAD');
      try {
        try {
          await firestore.collection('searching').doc();
        } catch (error) {}
      } catch (error) {}
    }
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.viewContainer}
        // style={{ flexGrow: 1, width: "100%" }}
        keyboardShouldPersistTaps='never'
        scrollEnabled={false}
      >
        <View style={styles.innerContainer}>
          <Image
            style={styles.logo}
            resizeMode='center'
            source={require('../../../assets/DimeAssets/headerlogo.png')}
          />
          {/* <TextInput
            style={styles.input}
            placeholder='E-mail'
            placeholderTextColor='#aaaaaa'
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
          />
          <TextInput
            style={styles.input}
            placeholderTextColor='#aaaaaa'
            secureTextEntry
            placeholder='Password'
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
          /> */}

          <Reinput
            style={styles.input}
            label='E-mail'
            labelActiveColor='#E64398'
            activeColor='#E64398'
            value={email}
            error={errorEmail}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize='none'
          />

          <Reinput
            style={styles.input}
            label='Password'
            value={password}
            error={error}
            labelActiveColor='#E64398'
            activeColor='#E64398'
            secureTextEntry
            placeholderVisibility={true}
            onChangeText={(text) => setPassword(text)}
            autoCapitalize='none'
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonTitle}>Log in</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
