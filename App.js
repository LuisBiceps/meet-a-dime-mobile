import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/stack';
import LoginScreen from './components/screens/LoginScreen/LoginScreen';
import HomeScreen from './components/screens/HomeScreen/HomeScreen';
import RegistrationScreen from './components/screens/RegistrationScreen/RegistrationScreen';
import VerifyScreen from './components/screens/VerifyScreen/VerifyScreen';
import ChatScreen from './components/screens/ChatScreen/ChatScreen';
import EditProfileScreen from './components/screens/EditProfileScreen/EditProfileScreen';
import ProfileScreen from './components/screens/ProfileScreen/ProfileScreen';
import AfterScreen from './components/screens/AfterScreen/AfterScreen';
import ForgotScreen from './components/screens/ForgotScreen/ForgotScreen';
import ConversationScreen from './components/screens/ConversationScreen/ConversationScreen';
import LogoutScreen from './components/screens/LogoutScreen/LogoutScreen';
import { decode, encode } from 'base-64';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthProvider } from './components/contexts/AuthContext';
import { AppNavigator } from './components/routes/AppNavigator';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import root from './root';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import styles from './components/screens/LoginScreen/styles';
import { color } from 'react-native-reanimated';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = (props) => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };
  return (
    <View style={root.container}>
      <View style={root.icon}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Text>
            <Entypo name="menu" size={36} color="black" />{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  function HomeWork() {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation, route }) => ({
            headerLeft: (props) => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerTransparent: 'true',
            headerTitle: '',
            headerBackTitle: ' ',
            headerTintColor: '#e64398',
            gestureEnabled: false,
          })}
        />

        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Logout"
            component={LogoutScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Registration"
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
              headerBackTitle: ' ',
              headerTintColor: '#e64398',
              gestureEnabled: false,
            })}
          />
          <Stack.Screen
            name="Verify"
            component={VerifyScreen}
            options={
              (({ navigation, route }) => ({
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
              }),
              { gestureEnabled: false })
            }
          />

          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
              drawerLockMode: '',
            }}
          />
          <Stack.Screen
            name="After"
            component={AfterScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Forgot"
            component={ForgotScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </>
      </Stack.Navigator>
    );
  }

  function ProfileWork() {
    return (
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation, route }) => ({
            headerLeft: (props) => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerTransparent: 'true',
            headerTitle: '',
            headerBackTitle: ' ',
            headerTintColor: '#e64398',
            gestureEnabled: false,
          })}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation, route }) => ({
            headerLeft: (props) => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerTransparent: 'true',
            headerTitle: '',
            headerBackTitle: ' ',
            headerTintColor: '#e64398',
            gestureEnabled: false,
          })}
        />
        <Stack.Screen
          name="Edit"
          component={EditProfileScreen}
          options={({ navigation, route }) => ({
            headerLeft: (props) => (
              <HeaderBackButton
                headerTitle=""
                {...props}
                onPress={() => navigation.navigate('Profile')}
              />
            ),
            headerTransparent: 'true',
            headerTitle: '',
            headerTintColor: '#e64398',
            gestureEnabled: true,
          })}
        />
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={({ navigation, route }) => ({
            headerLeft: (props) => (
              <HeaderBackButton
                headerTitle=""
                {...props}
                onPress={() => navigation.navigate('Profile')}
              />
            ),
            headerTransparent: 'true',
            headerTitle: '',
            headerTintColor: '#e64398',
            gestureEnabled: true,
          })}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Drawer.Navigator
          drawerType="back"
          keyboardDismissMode="on-drag"
          drawerStyle={root.drawer}
          drawerContentOptions={{
            activeBackgroundColor: '#e371ac',
            activeTintColor: 'white',
            labelStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              marginTop: 5,
              marginBottom: 5,
            },
          }}>
          <Drawer.Screen
            name="Home"
            component={HomeWork}
            options={
              (({ navigation, route }) => ({
                headerLeft: (props) => (
                  <NavigationDrawerStructure navigationProps={navigation} />
                ),
                headerTransparent: 'true',
                headerTitle: '',
                headerBackTitle: ' ',
                headerTintColor: '#e64398',
                ChatScreen: {
                  screen: ChatScreen,
                  navigationOptions: (navigation) => ({
                    drawerLockMode: 'locked-closed',
                  }),
                },
              }),
              {
                drawerIcon: ({ focused, size }) => (
                  <Text style={root.drawerIcon}>
                    <Entypo
                      name="home"
                      size={40}
                      color={focused ? 'white' : '#e64398'}
                    />
                  </Text>
                ),
              })
            }
          />
          <Drawer.Screen
            name="Profile"
            component={ProfileWork}
            options={
              (({ navigation, route }) => ({
                headerLeft: (props) => (
                  <NavigationDrawerStructure navigationProps={navigation} />
                ),
                headerTransparent: 'true',
                headerTitle: '',
                headerBackTitle: ' ',
                headerTintColor: '#e64398',
                gestureEnabled: true,
              }),
              {
                drawerIcon: ({ focused, size }) => (
                  <Text style={root.drawerIcon}>
                    <MaterialIcons
                      name="account-box"
                      size={40}
                      color={focused ? 'white' : '#e64398'}
                    />
                  </Text>
                ),
              })
            }
          />
          <Drawer.Screen
            name="Logout"
            component={LogoutScreen}
            headerTitleAlign="center"
            options={
              (({ navigation, route }) => ({
                headerLeft: (props) => (
                  <NavigationDrawerStructure navigationProps={navigation} />
                ),
                headerTransparent: 'true',
                headerTitle: '',
                headerBackTitle: ' ',
                headerTintColor: '#e64398',
                gestureEnabled: true,
              }),
              {
                drawerIcon: ({ focused, size }) => (
                  <Text style={root.drawerIcon}>
                    <MaterialIcons
                      name="exit-to-app"
                      size={40}
                      color={focused ? 'white' : '#e64398'}
                    />
                  </Text>
                ),
              })
            }
          />
        </Drawer.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
