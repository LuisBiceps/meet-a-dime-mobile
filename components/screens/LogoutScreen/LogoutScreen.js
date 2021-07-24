import React, { useEffect, useState, useRef } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reinput from 'reinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native';
import firebase from 'firebase';
import { auth } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';

export default function LogoutScreen({ route, navigation }, props) {
  const isFocused = useIsFocused();
  const { logout } = useAuth();
  async function handleLogout() {
    try {
      await logout();
      await AsyncStorage.removeItem('user_data');
      console.log('Logging out');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      handleLogout();
    }
  }, []);
  return null;
}
