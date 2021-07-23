import React, { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Reinput from "reinput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import firebase from "firebase";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { roundToNearestPixel } from "react-native/Libraries/Utilities/PixelRatio";

export default function LoginScreen({ route, navigation }, props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [error, setError] = useState("");
  const [propState, setPropState] = useState(false);
  const [fresh, setFresh] = useState(false);
  const { login } = useAuth();
  var state = false;
  if (route && route.params && route.params.state) {
    state = route.params.state;
  }

  const onFooterLinkPress = () => {
    navigation.navigate("Registration");
  };

  const onForgotPress = () => {
    navigation.navigate("Forgot");
  };

  function handleError(error) {
    if (error === "auth/wrong-password") {
      setError("Incorrect password.");
    } else if (error === "auth/user-not-found") {
      setError("Your account does not exist.");
      setErrorEmail("Your account does not exist.");
    } else if (error === "auth/too-many-requests") {
      setError("You are submitting too many requests, wait a few minutes.");
      setErrorEmail(
        "You are submitting too many requests, wait a few minutes."
      );
    } else if (error == "auth/invalid-email") {
      setErrorEmail("Please enter a valid email.");
    }
  }

  async function storeToken(user) {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  }

  async function getToken() {
    try {
      let user_data = await AsyncStorage.getItem("user_data");
      if (user_data == null) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit() {
    try {
      setError("");
      setErrorEmail("");
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      var res = await login(email, password);
      storeToken(JSON.stringify(res.user));
      console.log(res.user);
      setEmail("");
      setPassword("");
      setPropState(false);

      navigation.navigate("Home");
    } catch (error) {
      handleError(error.code === undefined ? error : error.code);
    }
  }

  useEffect(() => {
    // setFresh(props);
    // console.log(route.params.state);
    const firestore = firebase.firestore();
    if (state == true && state != undefined && state != null) {
      setPropState(true);
    }

    getToken().then((res) => {
      if (res) {
        console.log(res);
        navigation.navigate("Home");
      }
    });

    async function purgeOld() {
      console.log("THIS SHOULD ONLY PRINT ONCE PER LOAD");
      try {
        try {
          await firestore.collection("searching").doc();
        } catch (error) {}
      } catch (error) {}
    }
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.viewContainer}
        // style={{ flexGrow: 1, width: "100%" }}
        keyboardShouldPersistTaps="never"
        scrollEnabled={true}
      >
        <View style={styles.innerContainer}>
          <Image
            style={styles.logo}
            resizeMode="center"
            source={require("../../../assets/DimeAssets/homelogo.png")}
          />

          {state && (
            <Text style={styles.generalError}>
              Extra verification is required for changing password
            </Text>
          )}
          <View style={styles.inputContainer}>
            <Reinput
              keyboardType="email-address"
              style={styles.input}
              label="E-mail"
              labelColor="#000000"
              placeholderColor="#000000"
              underlineColor="#000000"
              labelActiveColor="#E64398"
              activeColor="#E64398"
              value={email}
              error={errorEmail}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />

            <Reinput
              style={styles.input}
              label="Password"
              value={password}
              error={error}
              labelColor="#000000"
              placeholderColor="#000000"
              underlineColor="#000000"
              labelActiveColor="#E64398"
              activeColor="#E64398"
              secureTextEntry
              placeholderVisibility={true}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonTitle}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.footerView}>
              <Text style={styles.footerText}>
                <Text onPress={onForgotPress} style={styles.footerLink}>
                  Forgot Password?
                </Text>
              </Text>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity
                style={styles.register}
                onPress={() => onFooterLinkPress()}
              >
                <Text style={styles.buttonTitle}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
