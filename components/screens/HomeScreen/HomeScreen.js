import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import firebase from "firebase/app";
import "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import "firebase/firestore";
import Reinput from "reinput";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import moment, { relativeTimeThreshold } from "moment";
import { useRoute } from "@react-navigation/core";
import { useIsFocused } from "@react-navigation/native";
import { set } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function HomeScreen({ navigation }, props) {
  const route = useRoute();
  const isFocused = useIsFocused();
  const { currentUser, logout } = useAuth();
  const [match, setMatch] = useState("Not searching");
  const [name, setName] = useState("None");
  const [myPhoto, setMyPhoto] = useState("");
  const [searchMatchesOnce, setSearchMatchesOnce] = useState(false);
  const [id_of_match, setId] = useState("none");
  const firestore = firebase.firestore();
  const observer = useRef(null);
  const [error, setError] = useState("");
  const [lockout, setLockout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(true);
  const [matchesArray, setMatchesArray] = useState([]);
  const [progress, setProgress] = useState(-1);
  // const [sopen, setOpenSearch] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef("");

  const transferTimeoutRef = useRef();
  const MS_TRANSFER_TO_CHAT = 3000;
  const MS_BEFORE_ABANDON_SEARCH = 30000;

  const timeout = useRef(null);

  const userInfoState = useRef({
    birth: "",
    exitMessage: "",
    firstName: "",
    sex: "",
    sexOrientation: "",
    photo: "",
    ageRangeMin: "",
    ageRangeMax: "",
  });

  async function getName() {
    try {
      var doc = await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid)
        .get();
      var firstName = doc.data().firstName;
      var lastName = doc.data().lastName;
      return [firstName, lastName];
    } catch (error) {
      console.log(error);
    }
  }

  function clearAllTimeouts() {
    clearTimeout(timeout.current);
  }

  useEffect(() => {
    if (!currentUser) {
      navigation.navigate("Login");
    }
    if (isFocused) {
      console.log(currentUser.uid);
      setLockout(true);
      if (!currentUser) {
        console.log("We In the use effect");
      } else {
        // console.log('Current User ID: ' + `"${currentUser.uid}"`);
        // console.log(currentUser.getIdToken());
        async function deleteItem() {
          await AsyncStorage.removeItem("chatExpiry");
        }
        // document.body.style.backgroundColor = 'white';
        deleteItem();
        async function getIntialUserPhoto() {
          try {
            const token = currentUser && (await currentUser.getIdToken(true));
            // console.log(token);
            var config = {
              method: "post",
              url: "https://meetadime.herokuapp.com/api/getbasicuser",
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`,
              },
              data: { uid: currentUser.uid },
            };
            // console.log(config.data)
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            var response = await axios(config);
            console.log(response.data);
            setMyPhoto(response.data.photo);
            if (myPhoto) console.log(myPhoto);
            setName(response.data.firstName);
          } catch (error) {
            console.log(error);
            console.log("issue in fetch data");
          }
        }

        async function purgeOld() {
          // Lock the search button until these tasks are complete.
          setLockout(true);
          console.log("I SHOULD ONLY PRINT ONCE PER PAGE LOAD");
          try {
            // If I am "document host", clear the match field first.
            try {
              await firestore
                .collection("searching")
                .doc(currentUser.uid)
                .update({ match: "" });
              console.log("cleared old match before delete");
            } catch (error) {
              console.log("tried to clear match before delete, but failed");
              console.log("most of the time this is ok");
              // this is okay because this most likely wont exist on each load.
            }

            // Delete the document (if exists) if I am a "document host".
            await firestore
              .collection("searching")
              .doc(currentUser.uid)
              .delete();

            // The final mechanism for clearing. This is if I was a previous
            // "document joiner" or "filling in" the existing doc.
            // I will search all docs where my id is the match field, and clear it.
            // This will signal to those listening to that field that I am
            // no longer available.
            firestore
              .collection("searching")
              .where("match", "==", currentUser.uid)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  try {
                    firestore
                      .collection("searching")
                      .doc(doc.id)
                      .update({ match: "" });
                  } catch (error) {
                    console.log("doc match clear error on start");
                  }
                });
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
          } catch (error) {
            console.log(error);
          }
          setLockout(false);
        }
        // call the function that was just defined here.

        purgeOld();
        getIntialUserPhoto();
        fetchSuccessMatch("", true);
      }

      return () => {
        setMatch("Not searching");
        setId("none");
        clearTimeout(timeout.current);
        clearAllTimeouts();
        console.log("LEAVING! cleanup");
        setLockout(false);
        if (observer.current !== null) {
          observer.current();
        } else {
          console.log("could not clear observer");
        }
      };
    }
  }, [isFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  if (currentUser && !currentUser.emailVerified) {
    navigation.navigate("Verify");
  }

  async function fetchData() {
    try {
      const token = currentUser && (await currentUser.getIdToken());
      var config = {
        method: "post",
        url: "https://meetadime.herokuapp.com/api/getuser",
        header: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        data: { uid: currentUser.uid },
      };
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // console.log('Here is the config data: ', config.data);
      // console.log('Bear bud: ', token);
      // console.log('Auth:', config.header.Authorization);
      var response = await axios(config);
      // console.log(response);

      userInfoState.current.birth = response.data.birth;
      userInfoState.current.exitMessage = response.data.exitMessage;
      userInfoState.current.firstName = response.data.firstName;
      userInfoState.current.sex = response.data.sex;
      userInfoState.current.sexOrientation = response.data.sexOrientation;
      userInfoState.current.photo = response.data.photo;
      userInfoState.current.ageRangeMax = response.data.ageRangeMax;
      userInfoState.current.ageRangeMin = response.data.ageRangeMin;

      // await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  }

  function redirectToProfile() {
    navigation.navigate("Profile");
  }

  async function killSearch() {
    setId("none");
    setMatch("Not searching");
    setError("");
    setIsSearching(true);
    clearAllTimeouts();
    if (transferTimeoutRef.current !== undefined)
      clearInterval(transferTimeoutRef.current);
    setProgress(-1);

    // Lock the search button until these tasks are complete.
    setLockout(true);
    setLoading(true);
    console.log("Clicking out of modal");
    if (observer.current !== null) observer.current();
    try {
      // If I am "document host", clear the match field first.
      try {
        await firestore
          .collection("searching")
          .doc(currentUser.uid)
          .update({ match: "" });

        // Delete the document (if exists) if I am a "document host".
        await firestore.collection("searching").doc(currentUser.uid).delete();
      } catch (error) {
        console.log("Threw error of type", error.code);
        // this is okay because this most likely wont exist on each load.
      }

      // The final mechanism for clearing. This is if I was a previous
      // "document joiner" or "filling in" the existing doc.
      // I will search all docs where my id is the match field, and clear it.
      // This will signal to those listening to that field that I am
      // no longer available.
      firestore
        .collection("searching")
        .where("match", "==", currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            try {
              firestore
                .collection("searching")
                .doc(doc.id)
                .update({ match: "" });
            } catch (error) {
              console.log(error);
            }
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    } catch (error) {
      console.log(error);
    }
    // Unlock the button now that initial tasks are done.
    setLockout(false);
    setLoading(false);
  }

  async function searching() {
    setMatch("Searching");
    await fetchData();
    console.log("USER DATA:", userInfoState.current);
    // if ((await AsyncStorage.getItem('user_data')) === null) {
    //   console.log('1');
    //   await fetchData();
    //   try {
    //   } catch (error) {
    //     setLockout(false);
    //     console.log(error);
    //   }
    // } else {
    //   var local = JSON.parse(await AsyncStorage.getItem('user_data'));

    //   // userInfoState.birth = local.birth;
    //   // userInfoState.exitMessage = local.exitMessage;
    //   // userInfoState.firstName = local.firstName;
    //   // userInfoState.sex = local.sex;
    //   // userInfoState.sexOrientation = local.sexOrientation;
    //   // userInfoState.photo = local.photo;
    //   // userInfoState.ageRangeMin = local.ageRangeMin;
    //   // userInfoState.ageRangeMax = local.ageRangeMax;
    //   setUserInfoState({
    //     birth: local.birth,
    //     exitMessage: local.exitMessage,
    //     firstName: local.firstName,
    //     sex: local.sex,
    //     sexOrientation: local.sexOrientation,
    //     photo: local.photo,
    //     ageRangeMin: local.ageRangeMin,
    //     ageRangeMax: local.ageRangeMax,
    //   });
    // }

    setLockout(true);

    var matchFound = false;
    var matchInternal = "";

    function getSearchingSex() {
      var searchingSex = "";

      if (userInfoState.current.sexOrientation === "Heterosexual") {
        if (userInfoState.current.sex === "Male") {
          searchingSex = ["Female"];
        } else {
          searchingSex = ["Male"];
        }
      } else if (userInfoState.current.sexOrientation === "Homosexual") {
        if (userInfoState.current.sex === "Female") {
          searchingSex = ["Female"];
        } else {
          searchingSex = ["Male"];
        }
      } else if (userInfoState.current.sexOrientation === "Bisexual") {
        searchingSex = ["Male", "Female"];
      }
      return searchingSex;
    }

    function fillMatch(doc_id) {
      try {
        firestore
          .collection("searching")
          .doc(doc_id)
          .update({ match: currentUser.uid });
        matchFound = true;

        var count = 0;
        setProgress(count);
        var localInterval = (transferTimeoutRef.current = setInterval(() => {
          count += (100 / MS_TRANSFER_TO_CHAT) * 100;
          setProgress(count);

          if (count >= 100) {
            clearInterval(transferTimeoutRef.current);
            setMatch("Not searching");
            setId("none");
            clearTimeout(timeout.current);
            clearInterval(localInterval);
            clearAllTimeouts();
            console.log("LEAVING! A");
            count = 0;
            if (observer.current !== null) {
              observer.current();
            } else {
              console.log("could not clear observer");
            }
            setLockout(false);
            navigation.navigate("Chat", {
              match_id: doc_id,
              timeout: timeout.current,
            });
          }
        }, 100));

        setId(doc_id);
        setMatch("Found match!" + doc_id);

        clearAllTimeouts();

        matchInternal = doc_id;
      } catch (error) {
        console.log("324");
      }
    }
    try {
      // Find what sex we are seeking.
      var searchingSex = getSearchingSex();

      // The database query. Check all docs for possible matches.
      var snapshot = await firestore.collection("searching").get();
      snapshot.forEach((doc) => {
        var myAge = moment().diff(userInfoState.current.birth, "years");

        if (
          doc.data().match === "" &&
          searchingSex.includes(doc.data().sex) &&
          doc.data().search_sex.includes(userInfoState.current.sex) &&
          myAge <= doc.data().search_age_end &&
          myAge >= doc.data().search_age_start &&
          doc.data().age >= userInfoState.current.ageRangeMin &&
          doc.data().age <= userInfoState.current.ageRangeMax &&
          doc.data().isChatting === 0
        ) {
          fillMatch(doc.id);
        }
      });
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      // Still part of phase two. Listen for changes to the doc we
      // just filled in. Its possible the doc owner drops out,
      // and we need to listen for this.
      // Some things not done yet: alert the users their match was dropped.
      // now it just kicks you back to the initial state. This is easy to
      // alert, we can just change a state or something.
      if (matchFound) {
        // console.log('yes, but lets listen for changes');
        // This works only to see if fields changed, not if doc deleted.
        // The workaround is: before deleting, set the match to "" first.
        observer.current = firestore
          .collection("searching")
          .where(firebase.firestore.FieldPath.documentId(), "==", matchInternal)
          .onSnapshot((snapshot) => {
            // console.log(snapshot);
            snapshot.docChanges().forEach((change) => {
              if (change.type === "modified") {
                // So if the doc filler loses the match, then we need to reset.
                // console.log(`new match info ${change.doc.data().match}`);
                if (change.doc.data().match === "") {
                  // Uh oh. The doc match was just set empty. The doc owner
                  // must have refreshed their session.
                  matchFound = false;
                  setId("none");
                  setIsSearching(true);
                  setMatch("Not searching");
                  setError("");
                  // setOpenSearch(false);
                  // clearTimeout(timeOut);
                  // These two clear all timeouts.
                  clearAllTimeouts();
                  if (transferTimeoutRef.current !== undefined)
                    clearInterval(transferTimeoutRef.current);
                  setProgress(-1);
                  setLockout(false);
                  ////observer();
                }
              }
            });
          });
      }
    } catch (error) {
      console.log(error);
    }
    // STAGE THREE //
    // This is if we didn't find a match, then we need to make our own
    // doc in 'searching' and then just wait for someone to join.
    if (!matchFound) {
      try {
        // Same searching logic as above.
        searchingSex = getSearchingSex();

        // Lets make a new document.
        // ************************************************************8
        // This has no support for age matches yet. We only
        // match based on mutual sex compatibility. The search age values
        // are just there for now, so hopefully we can implement
        // that within the searches.
        await firestore
          .collection("searching")
          .doc(currentUser.uid)
          .set({
            match: "",
            age: moment().diff(userInfoState.current.birth, "years"),
            sex: userInfoState.current.sex,
            search_age_start: userInfoState.current.ageRangeMin,
            search_age_end: userInfoState.current.ageRangeMax,
            search_sex: searchingSex,
            seeker: currentUser.uid,
            host_socket_id: "",
            join_socket_id: "",
            seekerTail: "false",
            matchTail: "false",
            isChatting: 0,
          });
        // Just posted the new doc to the 'searching' collection.
        console.log("DOC CREATED");
        // Hang on to the observer now. This is the listener on my new
        // document. I am waiting for the match field to be filled,
        // but it can also get un-filled. Account for both.
        observer.current = firestore
          .collection("searching")
          .where(
            firebase.firestore.FieldPath.documentId(),
            "==",
            currentUser.uid
          )
          .onSnapshot((docSnapshot) => {
            docSnapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                console.log("added a doc");
                timeout.current = setTimeout(() => {
                  console.log("trying to run timeout 5 in ADD");
                  if (route.name === "Home" && id_of_match === "none") {
                    console.log("TIMEOUT DOC HOST");
                    setLockout(true);
                    setLoading(true);
                    // setOpenSearch(false);
                    // Abandoning the search should involve me clearing the old doc
                    // that I posted up.
                    async function deleteOldRecordAfterAbandon() {
                      try {
                        await firestore
                          .collection("searching")
                          .doc(currentUser.uid)
                          .update({ match: "" });
                        console.log("cleared old match before delete");
                      } catch (error) {
                        console.log(
                          "tried to clear match before delete, but failed"
                        );
                        console.log("most of the time this is ok");
                        // this is okay because this most likely wont exist on each load.
                      }

                      // Delete the document (if exists) if I am a "document host".
                      try {
                        await firestore
                          .collection("searching")
                          .doc(currentUser.uid)
                          .delete();
                        console.log("deleted my doc");
                      } catch (error) {
                        console.log("error:");
                        console.log(error);
                      }
                    }
                    deleteOldRecordAfterAbandon();
                    setIsSearching(true);
                    setMatch("Not searching");
                    setError("");
                    if (observer.current !== null) {
                      observer.current();
                    } else {
                      console.log("could not clear observer in dochost");
                    }
                    setLockout(false);
                    setLoading(false);
                  } else {
                    console.log("timeout 5 tried to run, but was ignored.");
                  }
                }, MS_BEFORE_ABANDON_SEARCH);
                return;
              }

              console.log("some edit change.");
              clearAllTimeouts();
              // console.log(change.doc.data());
              if (
                change &&
                change.doc &&
                change.doc.data() &&
                change.doc.data().match !== ""
              ) {
                matchFound = true;
                // Transfer the user to the chat in 4 seconds.

                var count = 0;
                setProgress(count);
                var localInterval = (transferTimeoutRef.current = setInterval(
                  () => {
                    count += (100 / MS_TRANSFER_TO_CHAT) * 100;
                    setProgress(count);
                    // console.log(docSnapshot.data().match);
                    if (count >= 100) {
                      clearInterval(transferTimeoutRef.current);
                      setMatch("Not searching");
                      clearInterval(localInterval);
                      setId("none");
                      clearTimeout(timeout.current);
                      clearAllTimeouts();
                      console.log("LEAVING! E");
                      count = 0;
                      setLockout(false);
                      if (observer.current !== null) {
                        observer.current();
                      } else {
                        console.log("could not clear observer");
                      }

                      navigation.navigate("Chat", {
                        match_id: change.doc.data().match,
                        timeout: timeout.current,
                      });
                    }
                  },
                  100
                ));

                // setId(docSnapshot.data().match);
                setId(change.doc.data().match);
                setMatch("Found match! " + change.doc.data().match);
                // clearTimeout(timeOut);
                clearAllTimeouts();
              } else if (
                change &&
                change.doc &&
                change.doc.data() &&
                change.doc.data().match === ""
              ) {
                // Match left..

                matchFound = false;
                setId("none");
                setMatch("Searching");
                setError("");
                // setOpenSearch(false);
                // clearTimeout(timeOut);
                // Clear timeouts, to prevent the match abandon refresh.
                clearAllTimeouts();
                if (transferTimeoutRef.current !== undefined)
                  clearInterval(transferTimeoutRef.current);
                setProgress(-1);
                timeout.current = setTimeout(() => {
                  console.log("trying to run timeout 5");
                  if (route.name === "Home" && id_of_match === "none") {
                    console.log("TIMEOUT DOC HOST");
                    setLockout(true);
                    setLoading(true);
                    // setOpenSearch(false);
                    // Abandoning the search should involve me clearing the old doc
                    // that I posted up.
                    async function deleteOldRecordAfterAbandon() {
                      try {
                        await firestore
                          .collection("searching")
                          .doc(currentUser.uid)
                          .update({ match: "" });
                        console.log("cleared old match before delete");
                      } catch (error) {
                        console.log(
                          "tried to clear match before delete, but failed"
                        );
                        console.log("most of the time this is ok");
                        // this is okay because this most likely wont exist on each load.
                      }

                      // Delete the document (if exists) if I am a "document host".
                      try {
                        await firestore
                          .collection("searching")
                          .doc(currentUser.uid)
                          .delete();
                        console.log("deleted my doc");
                      } catch (error) {
                        console.log("error:");
                        console.log(error);
                      }
                    }
                    deleteOldRecordAfterAbandon();

                    setMatch("Not searching");
                    setIsSearching(true);
                    setError("");
                    if (observer.current !== null) {
                      observer.current();
                    } else {
                      console.log("could not clear observer in dochost");
                    }
                    setLockout(false);
                    setLoading(false);
                  } else {
                    console.log("timeout 5 tried to run, but was ignored.");
                  }
                }, MS_BEFORE_ABANDON_SEARCH);
              }
            });
            // The data exists AND the match is not empty! We just found one.
          });
      } catch (error) {
        alert(error);
        setLockout(false);
      }

      if (matchFound) {
        // Here is where we would also tell the user to move to the chat.
        // They have MS_BEFORE_ABANDON_MATCH seconds to do so.
        setLockout(true);
      }
    }
  }
  async function fetchSuccessMatch(query = "", initial = false) {
    try {
      if (!initial) {
        setSearchMatchesOnce(true);
      }
      const token = currentUser && (await currentUser.getIdToken());
      var config = {
        method: "post",
        url: "https://meetadime.herokuapp.com/api/getmatches",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { uid: currentUser.uid, query: query },
      };

      var response = await axios(config);
      setMatchesArray(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
      console.log("issue in fetch data");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../../assets/DimeAssets/headerlogo.png")}
      />
      <Text style={styles.text}>Welcome back, {name}!</Text>
      <View style={styles.formContainer}>
        {match && match !== "Searching" && !match.startsWith("Found match!") && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              searching();
              setIsSearching(false);
            }}
            disabled={lockout}
          >
            <Text style={styles.buttonText}>New Chat</Text>
          </TouchableOpacity>
        )}
        {match && match === "Searching" && (
          <TouchableOpacity
            style={styles.button}
            onPress={killSearch}
            disabled={isSearching}
          >
            <Text style={styles.buttonText}>Stop Search</Text>
          </TouchableOpacity>
        )}
        {/* {match && match === "Not searching" && <Text>{match}</Text>} */}

        {match && (match === "Searching" || match.startsWith("Found match!")) && (
          <View>
            <Image
              style={styles.searchImage}
              source={require("../../../assets/DimeAssets/searchcoin.gif")}
            ></Image>
          </View>
        )}
        {match && match.startsWith("Found match!") && <Text>{match}</Text>}
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          marginTop: 10,
          width: "100%",
        }}
      >
        <Reinput
          keyboardType="web-search"
          label="Search Previous Matches"
          labelColor="#000000"
          placeholderColor="#000000"
          underlineColor="#000000"
          labelActiveColor="#E64398"
          activeColor="#E64398"
          value={search}
          ref={searchRef}
          onChangeText={(text) => {
            setSearch(text);
          }}
          onSubmitEditing={() => {
            {
              fetchSuccessMatch(search);

              Keyboard.dismiss();
            }
          }}
          autoCapitalize="none"
          style={{ width: 320 }}
        />
      </View>

      {matchesArray && matchesArray.length !== 0 && (
        <ScrollView horizontal={true}>
          {matchesArray.map((vals, index) => {
            // console.log(vals);
            var age = moment().diff(vals.birth, "years");
            return (
              <View
                key={index}
                style={{ width: 150, height: 150, marginHorizontal: 10 }}
              >
                <Image
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 100,
                    borderRadius: 150 / 2,
                    overflow: "hidden",
                    borderWidth: 3,
                    borderColor: "#e4a",
                  }}
                  source={{ uri: vals.photo }}
                ></Image>

                <View style={{ alignItems: "center" }}>
                  <Text>{vals.firstName + " " + vals.lastName}</Text>
                  <Text>{age + " • " + vals.sex[0]}</Text>

                  <Text>{vals.phone}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      {matchesArray && matchesArray.length === 0 && !searchMatchesOnce && (
        <Text>No matches yet.. 😔</Text>
      )}
      {matchesArray && matchesArray.length === 0 && searchMatchesOnce && (
        <Text>No results.</Text>
      )}
    </View>
  );
}
