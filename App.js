import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/screens/LoginScreen/LoginScreen";
import HomeScreen from "./components/screens/HomeScreen/HomeScreen";
import RegistrationScreen from "./components/screens/RegistrationScreen/RegistrationScreen";
import RegistrationScreen2 from "./components/screens/RegistrationScreen/RegistrationScreen2";
import { decode, encode } from "base-64";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { AuthProvider } from "./components/contexts/AuthContext";
import { AppNavigator } from "./components/routes/AppNavigator";
// import { useAuth } from "./src/contexts/AuthContext";
// const { currentUser } = useAuth();

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
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={HomeScreen} />
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            {/* <Stack.Screen
              name="Registration Continued..."
              component={RegistrationScreen2}
            /> */}
          </>
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
