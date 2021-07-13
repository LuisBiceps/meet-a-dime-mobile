import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

export default function HomeScreen({ navigation }, props) {
  const [entityText, setEntityText] = useState("");
  const [name, setName] = useState("None");
  // const { currentUser, logout } = useAuth();

  console.log("Current prop:" + currentUser.userID);
  async function getName() {
    try {
      var doc = await firebase
        .firestore()
        .collection("users")
        .doc(props.extraData.userID)
        .get();

      var firstName = doc.data().firstName;
      var lastName = doc.data().lastName;
      return [firstName, lastName];
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogout() {
    navigation.navigate("Login");
  }

  useEffect(() => {
    try {
      getName().then((nombres) => {
        if (!nombres) console.log("Nombres doesn't exist");
        console.log(nombres[0], nombres[1]);
        setName(nombres[0] + " " + nombres[1]);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          //   placeholder="Add new entity"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEntityText(text)}
          value={name}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
