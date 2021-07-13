import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/HomeScreen/HomeScreen";
import Login from "../screens/LoginScreen/LoginScreen";
import Signup from "../screens/RegistrationScreen/RegistrationScreen";
import Signup2 from "../screens/RegistrationScreen/RegistrationScreen2";

const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Registration" component={Signup} />
    <Stack.Screen name="Registration2" component={Signup2} />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
