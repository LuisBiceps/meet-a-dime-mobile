import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/stack';
import LoginScreen from './components/screens/LoginScreen/LoginScreen';
import HomeScreen from './components/screens/HomeScreen/HomeScreen';
import RegistrationScreen from './components/screens/RegistrationScreen/RegistrationScreen';
import VerifyScreen from './components/screens/VerifyScreen/VerifyScreen';
import ChatScreen from './components/screens/ChatScreen/ChatScreen';

import { decode, encode } from 'base-64';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthProvider } from './components/contexts/AuthContext';
import { AppNavigator } from './components/routes/AppNavigator';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  return (
    // <AppNavigator />
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen
            name='Home'
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          <>
            <Stack.Screen
              name='Login'
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Registration'
              component={RegistrationScreen}
              options={({ navigation, route }) => ({
                headerLeft: (props) => (
                  <HeaderBackButton
                    {...props}
                    onPress={() => navigation.navigate('Login')}
                  />
                ),
                headerTransparent: 'true',
                headerTitle: '',
                headerTintColor: '#e64398',
              })}
            />
            <Stack.Screen
              name='Verify'
              component={VerifyScreen}
              options={({ navigation, route }) => ({
                headerLeft: (props) => (
                  <HeaderBackButton
                    {...props}
                    onPress={() => navigation.navigate('Login')}
                  />
                ),
                headerBackTitle: 'Login',
                headerTransparent: 'true',
                headerTitle: '',
                headerTintColor: '#e64398',
              })}
            />
            <Stack.Screen
              name='Chat'
              component={ChatScreen}
              options={({ navigation, route }) => ({
                headerLeft: (props) => (
                  <HeaderBackButton
                    {...props}
                    onPress={() => navigation.navigate('Login')}
                  />
                ),
                headerBackTitle: 'Abandon',
                headerTransparent: 'true',
                headerTitle: '',
                headerTintColor: '#e64398',
              })}
            />
          </>
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
