import React from 'react';

import { useAuth } from './contexts/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen/LoginScreen';

// Only continue to render components if the user is authenticated.
// Redirect users to login if this is not the case.

const Stack = createStackNavigator();

export default function PrivateScreen({ component: Component, ...remaining }) {
  const { currentUser } = useAuth();

  return (
    <Stack.Screen
      {...remaining}
      render={(props) => {
        return currentUser ? <Component {...props} /> : <LoginScreen />;
      }}
    ></Stack.Screen>
  );
}
