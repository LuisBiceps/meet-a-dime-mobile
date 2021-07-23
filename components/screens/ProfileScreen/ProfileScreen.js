import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Progress from 'react-native-progress';
import { useIsFocused } from '@react-navigation/native';

// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export default function ProfileScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [myPhoto, setMyPhoto] = useState('');
  const [isUploading, setIsUploading] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const firestore = firebase.firestore();
  const [switching, setSwitching] = useState(true);
  const { currentUser, logout } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPicUploader, setShowPicUploader] = useState('');
  const [progress, setProgress] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [photoStatus, setPhotoStatus] = useState('');

  const [source, setSource] = useState({});

  if (currentUser && !currentUser.emailVerified) {
    navigation.navigate('Verify');
  }

  async function fetchUserData() {
    // console.log('ran');
    var snapshot = await firestore.collection('users').get();
    snapshot.forEach((doc) => {
      if (doc.data().userID === currentUser.uid) {
        var userBirth = doc.data().birth;
        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        var userPhone = doc.data().phone;
        var userExitMessage = doc.data().exitMessage;
        var userSex = doc.data().sex;
        var userOrientation = doc.data().sexOrientation;
        var photo = doc.data().photo;
        var ageRangeMax = doc.data().ageRangeMax;
        var ageRangeMin = doc.data().ageRangeMin;
        var userInitializedProfile = doc.data().initializedProfile;
        // document.getElementById('birth').innerHTML = userBirth;
        // document.getElementById('first').innerHTML = userFirstName;
        // document.getElementById('last').innerHTML = userLastName;
        setLastName(userLastName);
        setFirstName(userFirstName);
        setPhone(userPhone);
        // document.getElementById('phone').innerHTML = userPhone;
        // document.getElementById('exit').innerHTML = userExitMessage;
        // document.getElementById('sex').innerHTML = userSex;
        // document.getElementById('orientation').innerHTML = userOrientation;
        // if (photo.includes('DimeAssets')) {
        //   setMyPhoto('../../../assets' + photo.toString());
        //   console.log('../../../assets' + photo.toString());
        //   //   console.log(require('../../../assets' + photo.toString()));
        //   //   setSource(require('../../../assets' + photo.toString()));
        // } else {
        //   setMyPhoto(photo);
        //   setSource({ uri: photo });
        // }
        setMyPhoto(photo);
        setSource({ uri: photo });
        setSwitching(false);

        // Set some items into local storage for easy reference later
        //   its only 5 items right now just so it matches the other
        //   references on the Home.js page, but we can add all for sure

        // Ideally this should also get set when a user changes it
        // on this page as well.
      }
    });
  }

  async function getData() {
    await fetchUserData();
  }
  useEffect(() => {
    if (isFocused) {
      // console.log('=====REACHED THE PROFILE SCREEN======');
      getData();
      async () => {
        if (Platform.OS !== 'web') {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions for this to work!');
          }
        }
      };
    }
  }, [isFocused]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      var re = /(?:\.([^.]+))?$/;
      var ext = re.exec(result.uri);
      try {
        const res = await fetch(result.uri);
        const blob = await res.blob();
        var storageRef = firebase.storage().ref();
        // console.log(blob);
        var profileRef = storageRef.child(currentUser.uid + '.' + ext);
        var uploadTask = profileRef.put(blob);
        var observer = uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress_ = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setShowProgress(true);
            setProgress(progress_);
            console.log('Upload is ' + progress_ + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
              default:
                console.log('error? in switch');
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            // setError(error);
            setIsUploading(false);
          },
          () => {
            observer();
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              firestore
                .collection('users')
                .doc(currentUser.uid)
                .update({ photo: downloadURL })
                .then(() => {
                  setShowProgress(false);
                  console.log('photo set to user in database!');
                  setPhotoStatus('Done!');

                  setMyPhoto(downloadURL);
                  setSource({ uri: downloadURL });
                  setSelectedFile('');
                  setIsUploading('Done');
                  //   setSuccess(true);
                  setIsUploading(false);
                  setTimeout(() => {
                    setPhotoStatus(false);
                    //   setSuccess(false);
                  }, 5000);
                })
                .catch((error) => {
                  console.log(error);
                  //   setError('something went wrong');
                  // setPhotoStatus('something went wrong.');
                });
            });
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  function goEdit() {
    setSwitching(true);
    navigation.navigate('Edit');
  }

  function goConversation() {
    setSwitching(true);
    navigation.navigate('Conversation');
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='never'
        scrollEnabled={scroll}
      >
        <Image style={styles.logo} source={source} />

        <View style={styles.headingContainer}>
          {/* <Text stype={styles.heading}>{myPhoto.toString()}</Text> */}

          <Text style={styles.heading}>{firstName + ' ' + lastName}</Text>
          <Text style={styles.heading}>{phone}</Text>
        </View>

        {showProgress && (
          <View style={styles.responseContainer}>
            <Progress.Bar progress={progress / 100} color='#E64398' />
          </View>
        )}

        {photoStatus === 'Done!' && (
          <View style={styles.responseContainer}>
            <Text style={styles.success}>Photo uploaded successfully!</Text>
          </View>
        )}
        <View style={styles.headingContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonTitle}>📷 Change Profile Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goEdit}>
            <Text style={styles.buttonTitle}>Update Profile ✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goConversation}>
            <Text style={styles.buttonTitle}>💬 Conversation Starters</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
