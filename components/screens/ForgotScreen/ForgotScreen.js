import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reinput from 'reinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import firebase from 'firebase';
import { auth } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';

export default function ForgotScreen({ route, navigation }) {
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('If an account exists, an email will be sent soon.');
      setTimeout(() => {
        setMessage('');
      }, 10000);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('No matching email found.');
      } else {
        setError('Unexpected error');
      }
    }
    setLoading(false);
  }

  const onLoginPress = () => {
    navigation.navigate('Login');
  };
  const onSignUpPress = () => {
    navigation.navigate('Registration');
  };

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

          <View style={styles.inputContainer}>
            <View style={styles.footerView}>
              <Text style={styles.footerText}>Password Reset</Text>
              <Text style={styles.footerSubText}>
                Please enter your email below:
              </Text>
            </View>
            {/* {message !== '' && <Text style={styles.footerLink}>{message}</Text>} */}
            <Reinput
              style={styles.input}
              label='E-mail'
              labelColor='#000000'
              placeholderColor='#000000'
              underlineColor='#000000'
              labelActiveColor='#E64398'
              activeColor='#E64398'
              value={email}
              error={error}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize='none'
            />
            {message !== '' && <Text style={styles.footerLink}>{message}</Text>}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              disabled={loading}
            >
              <Text style={styles.buttonTitle}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.register}
              onPress={() => onLoginPress()}
            >
              <Text style={styles.buttonTitle}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signupView}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text onPress={onSignUpPress} style={styles.signUpLink}>
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
