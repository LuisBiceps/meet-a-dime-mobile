import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

export default function VerifyScreen({ navigation }) {
  const { logout, verify, currentUser } = useAuth();
  //   const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);

  //   async function handleLogout() {
  //     try {
  //       await logout();
  //       navigation.navigate("Login");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  const createAlert = () => {
    Alert.alert(
      "Verify email has been sent",
      "Please check your email",
      [{ text: "OK", onPress: () => console.log("OK pressed") }],
      { cancelable: false }
    );
  };

  async function handleSubmit() {
    try {
      setMessage("");
      setLoading(true);
      await verify();
      setMessage("Verify email has been sent");
      setPressed(true);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="never"
        scrollEnabled="false"
      >
        <View style={styles.verifyContainer}>
          <Text>Verify Your E-mail</Text>
          <Image
            style={styles.logo}
            source={require("../../../assets/DimeAssets/envelope.png")}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleSubmit(), createAlert();
            }}
            disabled={loading || pressed}
          >
            <Text style={styles.buttonTitle}>Send Email Verification</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>Make sure to check your inbox.</Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
