import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
// require("react-native-dotenv").config();

const app = firebase.initializeApp({
  apiKey: "AIzaSyCiLTAfg5zKiTQ2gHsCRQpMvIV5RDyYW-0",
  authDomain: "meet-a-dime.firebaseapp.com",
  projectId: "meet-a-dime",
  storageBucket: "meet-a-dime.appspot.com",
  messagingSenderId: "397460828976",
  appId: "1:397460828976:ios:0e610becdaffbdd3d74ef5",
  measurementId: "G-0P6HTN0V6N",
});

export const auth = app.auth();

export default app;
