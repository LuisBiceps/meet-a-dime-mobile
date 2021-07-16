import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import * as firebase from "firebase";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const onFooterLinkPress = () => {
    navigation.navigate("Registration");
  };

  async function handleSubmit() {
    console.log("trying to login");
    try {
      await login(email, password);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  }

  // const onLoginPress = () => {
  //   auth
  //     .signInWithEmailAndPassword(email, password)
  //     .then((response) => {
  //       const uid = response.user.uid;
  //       console.log(uid);
  //       const usersRef = firebase.firestore().collection("users");
  //       usersRef
  //         .doc(uid)
  //         .get()
  //         .then((firestoreDocument) => {
  //           if (!firestoreDocument.exists) {
  //             alert("User does not exist anymore.");
  //             return;
  //           }
  //           const user = firestoreDocument.data();
  //           navigation.navigate("Home", { user });
  //         })
  //         .catch((error) => {
  //           alert(error);
  //         });
  //     })
  //     .catch((error) => {
  //       alert(error);
  //     });
  // };

  // async function handleSubmit() {
  //   // e.preventDefault();

  //   try {
  //     // setError('');
  //     // setLoading(true);
  //     // if (!isChecked) {
  //     //   await firebase
  //     //     .auth()
  //     //     .setPersistence(firebase.auth.Auth.Persistence.SESSION);
  //     // }
  //     await login(email, password);
  //     // console.log(currentUser);
  //     navigation.navigate("Home");
  //     // window.location.reload();
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // if (window.location.pathname === '/login') setLoading(false);
  // }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.viewContainer}
        // style={{ flexGrow: 1, width: "100%" }}
        keyboardShouldPersistTaps="never"
      >
        <View style={styles.innerContainer}>
          <Image
            style={styles.logo}
            resizeMode="center"
            source={require("../../../assets/DimeAssets/headerlogo.png")}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonTitle}>Log in</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
