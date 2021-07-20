import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/HomeScreen/HomeScreen';
import Login from '../screens/LoginScreen/LoginScreen';
import Signup from '../screens/RegistrationScreen/RegistrationScreen';
import Verify from '../screens/VerifyScreen/VerifyScreen';
import Chat from '../screens/ChatScreen/ChatScreen';

const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name='Home' component={Home} />
    <Stack.Screen name='Login' component={Login} />
    <Stack.Screen name='Registration' component={Signup} />
    <Stack.Screen name='Verify' component={Verify} />
    <Stack.Screen name='Chat' component={Chat} />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
