import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/HomeScreen/HomeScreen';
import Login from '../screens/LoginScreen/LoginScreen';
import Signup from '../screens/RegistrationScreen/RegistrationScreen';
import Verify from '../screens/VerifyScreen/VerifyScreen';
import Chat from '../screens/ChatScreen/ChatScreen';
import Edit from '../screens/EditProfileScreen/EditProfileScreen';
import Profile from '../screens/ProfileScreen/ProfileScreen';
import After from '../screens/AfterScreen/AfterScreen';
import Forgot from '../screens/ForgotScreen/ForgotScreen';

const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name='Home' component={Home} />
    <Stack.Screen name='Login' component={Login} />
    <Stack.Screen name='Registration' component={Signup} />
    <Stack.Screen name='Verify' component={Verify} />
    <Stack.Screen name='Chat' component={Chat} />
    <Stack.Screen name='Edit' component={Edit} />
    <Stack.Screen name='Profile' component={Profile} />
    <Stack.Screen name='After' component={After} />
    <Stack.Screen name='Forgot' component={Forgot} />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
