import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native';

import Reinput from 'reinput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';
import moment from 'moment';
// import Slider from "@react-native-community/slider";
import Slider from 'rn-range-slider';
import Thumb from '../../slider/Thumb';
import Rail from '../../slider/Rail';
import RailSelected from '../../slider/RailSelected';
import Label from '../../slider/Label';
import Notch from '../../slider/Notch';

import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
const DEFAULT_COIN_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/meet-a-dime.appspot.com/o/default_1.png?alt=media&token=23ab5b95-0214-42e3-9c54-d7811362aafc';

export default function EditProfileScreen({ route, navigation }, props) {
  const isFocused = useIsFocused();
  const [del, setDel] = useState(false);

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passChange, setPassChange] = useState();

  const [value, setValue] = useState(18);
  const [response, setResponse] = useState('');
  const [phone, setPhone] = useState('');

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const confirmRef = useRef();
  const phoneRef = useRef();
  const responseRef = useRef();

  const [rangeDisabled, setRangeDisabled] = useState(false);
  const [low, setLow] = useState(18);
  const [high, setHigh] = useState(24);
  const [min, setMin] = useState(18);
  const [max, setMax] = useState(72);
  const [floatingLabel, setFloatingLabel] = useState(true);

  const { currentUser, updatePassword, updateEmail, deleteUser, logout } =
    useAuth();

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);

  moment.suppressDeprecationWarnings = true;
  var fromToday = moment().subtract(18, 'years').add(1, 'day').calendar();
  var dob = moment(fromToday).format('YYYY-MM-DD');

  var cleanDate = useRef('');

  const [date, setDate] = useState(new Date(dob));
  const [show, setShow] = useState(false);
  const [dateToggle, setDateToggle] = useState(' (open)');
  const [sexPick, setSexPick] = useState(false);
  const [orientPick, setOrientPick] = useState(false);
  const [birth, setBirth] = useState('Select your Date of Birth');

  const [sex, setSex] = useState('Choose your sex...');
  const [optionsState, setOptionsState] = useState('0');
  const [orientationState, setOrientationState] = useState('0');
  const [sexLabel, setSexLabel] = useState('Choose your sex...');
  const [sexToggle, setSexToggle] = useState(' (open)');
  const [orientation, setOrientation] = useState(
    'Choose your sexual orientation...'
  );
  const [orientLabel, setOrientLabel] = useState(
    'Choose your sexual orientation...'
  );
  const [orientToggle, setOrientToggle] = useState(' (open)');

  const [rangePick, setRangePick] = useState(false);
  const [rangeToggle, setRangeToggle] = useState(' (open)');

  const [confirmError, setConfirmError] = useState('');
  const [passError, setPassError] = useState('');

  const [accountError, setAccountError] = useState('');

  const [phoneError, setPhoneError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [hasGeneralError, setHasGeneralError] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [scroll, setScroll] = useState(true);

  const firestore = firebase.firestore();

  async function fetchUserData() {
    // console.log('ran');
    var snapshot = await firestore.collection('users').get();
    snapshot.forEach((doc) => {
      if (doc.data().userID === currentUser.uid) {
        var temp = moment(doc.data().birth).format('MMMM Do YYYY');

        setBirth(temp);
        setFirstName(doc.data().firstName);
        setLastName(doc.data().lastName);
        if (email === '') {
          setEmail(currentUser.email);
        }
        setPhone(doc.data().phone);
        setResponse(doc.data().exitMessage);
        setOptionsState(doc.data().sex === 'Male' ? '1' : '2');
        setSex(doc.data().sex);
        if (isNaN(doc.data().ageRangeMin)) {
          console.log('NAN FOR NOW');

          setLow(Math.max(moment().diff(doc.data().birth, 'years') - 6, 18));
          setHigh(Math.min(moment().diff(doc.data().birth, 'years') + 6, 72));
        } else {
          setLow(doc.data().ageRangeMin);
          setHigh(doc.data().ageRangeMax);
        }
        const userOrientation = doc.data().sexOrientation;
        setOrientLabel(
          userOrientation === 'Heterosexual'
            ? 'Straight'
            : userOrientation === 'Homosexual'
            ? 'Gay/Lesbian'
            : 'Bisexual'
        );
        setOrientationState(
          userOrientation === 'Heterosexual'
            ? '1'
            : userOrientation === 'Homosexual'
            ? '2'
            : '3'
        );
      }
    });
  }

  async function handleDelete() {
    try {
      await firestore.collection('users').doc(currentUser.uid).delete();
      await deleteUser();
      await AsyncStorage.removeItem('user_data');
      console.log('Account deleted');
    } catch (error) {
      console.log(error);
      return setAccountError(error);
    }
    navigation.navigate('Login');
  }

  async function getData() {
    await fetchUserData();
  }

  async function handleLogout() {
    try {
      await logout();
      await AsyncStorage.removeItem('user_data');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      getData();
      handleSex(optionsState);
      handleOrientation(orientationState);
    }
  }, [isFocused]);

  async function handlePasswordUpdate() {
    var hasError = false;
    setConfirmError('');
    setPassError('');
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      setPassChange('');
      hasError = true;
    }

    if (password.length <= 6) {
      setPassError('Password should be more than six characters.');
      setConfirmError('Password should be more than six characters.');
      setPassChange('');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (password) {
      try {
        await updatePassword(password);
        setPassChange('Password Successfully Changed!');
      } catch (error) {
        // console.log(error);
        if (error.code === 'auth/requires-recent-login') {
          console.log(error);

          Alert.alert(
            'This action requires you to log in again.',
            'You will be redirected to login',
            [
              {
                text: 'OK',
                onPress: () => {
                  handleLogout(), navigation.navigate('Login', { state: true });
                },
              },
            ]
          );
        }
      }
    }
  }

  async function handleSubmit() {
    var hasError = false;

    var path = 'Profile';
    setHasGeneralError(false);
    setGeneralError('');
    setPhoneError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');

    if (sex === 'Choose your sex...') {
      setHasGeneralError(true);
      setGeneralError('Please choose your sex.');
      hasError = true;
    }

    if (orientLabel === 'Choose your sexual orientation...') {
      setHasGeneralError(true);
      setGeneralError('Please choose your sexual orientation.');
      hasError = true;
    }

    if (phone.trim().length < 14) {
      setPhoneError('Please enter a valid phone number.');
      hasError = true;
    }

    if (firstName === '') {
      setFirstNameError('Please enter your first name.');
      hasError = true;
    }

    if (lastName === '') {
      setLastNameError('Please enter your last name.');
      hasError = true;
    }

    if (email === '') {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      if (email !== currentUser.email) {
        path = 'Login';
        updateEmail(email);
      }

      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({ firstName: firstName.trim() });
      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({ lastName: lastName.trim() });
      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({ email: email });
      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({ sex: sex });
      if (orientation !== 'Choose your sexual orientation...') {
        await firestore
          .collection('users')
          .doc(currentUser.uid)
          .update({ sexOrientation: orientation });
      }
      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({ phone: phone });
      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({ exitMessage: response.trim() });
      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({ ageRangeMin: low });
      await firestore
        .collection('users')
        .doc(currentUser.uid)
        .update({ ageRangeMax: high });
    } catch (error) {
      generalError(true);
      setGeneralError(error);
    } finally {
      navigation.navigate(path);
    }
  }

  const onChange = (event, selectedDate) => {
    var currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    currentDate = moment(currentDate).subtract(1, 'day');
    // Used for button text format
    var temp = moment(currentDate).add(1, 'day').format('MMMM Do YYYY');
    var realDate = currentDate.toJSON();
    realDate = JSON.stringify(realDate);
    // cleanDate used for database
    cleanDate.current = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');
    setBirth(temp);
    setLow(Math.max(moment().diff(selectedDate, 'years') - 6, 18));
    setHigh(Math.min(moment().diff(selectedDate, 'years') + 6, 72));
    console.log(value);
    console.log(cleanDate.current);
  };

  function formatNumber(val) {
    if (!val) return val;

    const number = val.replace(/[^\d]/g, '');
    if (number.length < 4) return number;

    if (number.length < 7) {
      return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    }

    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(
      6,
      10
    )}`;
  }

  function phoneWork(phone) {
    const formattedNumber = formatNumber(phone);
    setPhone(formattedNumber);
  }

  const showDatePicker = () => {
    if (show) {
      setShow(false);
      setDateToggle(' (open)');
    } else {
      setShow(true);
      setDateToggle(' (close)');
    }
  };

  const showRangePicker = () => {
    if (rangePick) {
      setRangePick(false);
      setScroll(true);
      setRangeToggle(' (open)');
    } else {
      setScroll(false);
      setRangePick(true);
      setRangeToggle(' (close)');
    }
  };

  function handleOrientation(preference) {
    if (preference === '0') {
      // if (orientLabel !== 'Choose your sexual orientation...')

      setOrientation('Choose your sexual orientation...');
      setOrientLabel('Choose your sexual orientation...');
    } else if (preference === '1') {
      setOrientation('Heterosexual');
      setOrientLabel('Straight');
    } else if (preference === '2') {
      setOrientation('Homosexual');

      setOrientLabel('Gay/Lesbian');
    } else if (preference === '3') {
      setOrientation('Bisexual');

      setOrientLabel('Bisexual');
    } else if (preference === '4') {
      setOrientation('Bisexual');
      setOrientLabel('Other');
    }
  }

  const showSexPicker = () => {
    if (sexPick) {
      setSexPick(false);
      setSexToggle(' (open)');
    } else {
      setSexPick(true);
      setSexToggle(' (close)');
    }
  };
  const showOrientPicker = () => {
    if (orientPick) {
      setOrientPick(false);
      setOrientToggle(' (open)');
    } else {
      setOrientPick(true);
      setOrientToggle(' (close)');
    }
  };
  function handleSex(state) {
    if (state === '0') {
      setSex('Choose your sex...');
    } else if (state === '1') {
      setSex('Male');
    } else if (state === '2') {
      setSex('Female');
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='never'
        scrollEnabled={scroll}
      >
        <Image
          style={styles.logo}
          source={require('../../../assets/DimeAssets/coinsignup.png')}
        />
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Update Profile</Text>
        </View>
        <Text style={styles.generalError}>{accountError}</Text>
        <View style={styles.innerContainer}>
          <Reinput
            style={styles.firstname}
            label='First Name'
            labelActiveColor='#E64398'
            labelColor='#000000'
            placeholderColor='#000000'
            underlineColor='#000000'
            activeColor='#E64398'
            value={firstName}
            error={firstNameError}
            ref={firstNameRef}
            onChangeText={(text) => setFirstName(text)}
            onSubmitEditing={() => {
              lastNameRef.current.focus();
            }}
            autoCapitalize='words'
          />

          <Reinput
            style={styles.lastname}
            label='Last Name'
            labelActiveColor='#E64398'
            labelColor='#000000'
            placeholderColor='#000000'
            underlineColor='#000000'
            activeColor='#E64398'
            value={lastName}
            error={lastNameError}
            ref={lastNameRef}
            onChangeText={(text) => setLastName(text)}
            onSubmitEditing={() => {
              emailRef.current.focus();
            }}
            autoCapitalize='words'
          />
        </View>
        <Reinput
          style={styles.input}
          label='E-mail'
          labelActiveColor='#E64398'
          labelColor='#000000'
          placeholderColor='#000000'
          underlineColor='#000000'
          activeColor='#E64398'
          value={email}
          error={emailError}
          ref={emailRef}
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={() => {
            passRef.current.focus();
          }}
          autoCapitalize='none'
        />

        <Reinput
          style={styles.input}
          label='Password'
          placeholder='Leave blank to keep the same password'
          placeholderVisibility={true}
          labelActiveColor='#E64398'
          labelColor='#000000'
          placeholderColor='#757575'
          underlineColor='#000000'
          activeColor='#E64398'
          value={password}
          error={passError}
          ref={passRef}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={() => {
            confirmRef.current.focus();
          }}
          autoCapitalize='none'
          secureTextEntry
        />
        <Reinput
          style={styles.input}
          label='Confirm Password'
          labelActiveColor='#E64398'
          labelColor='#000000'
          placeholder='Leave blank to keep the same password'
          placeholderVisibility={true}
          placeholderColor='#757575'
          underlineColor='#000000'
          activeColor='#E64398'
          value={confirmPassword}
          error={confirmError}
          ref={confirmRef}
          onChangeText={(text) => setConfirmPassword(text)}
          onSubmitEditing={() => {
            phoneRef.current.focus();
          }}
          autoCapitalize='none'
          secureTextEntry
        />
        {passChange !== '' && <Text style={styles.heading}>{passChange}</Text>}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePasswordUpdate()}
        >
          <Text style={styles.buttonTitle}>Change Password</Text>
        </TouchableOpacity>

        <Reinput
          style={styles.input}
          label='Phone Number'
          labelActiveColor='#E64398'
          labelColor='#000000'
          placeholderColor='#000000'
          underlineColor='#000000'
          activeColor='#E64398'
          value={phone}
          error={phoneError}
          ref={phoneRef}
          onChangeText={(text) => phoneWork(text)}
          onSubmitEditing={() => {
            responseRef.current.focus();
          }}
          autoCapitalize='none'
        />

        {hasGeneralError && (
          <Text style={styles.generalError}>{generalError}</Text>
        )}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => showSexPicker()}
          >
            <Text style={styles.buttonTitle}>{sex + sexToggle}</Text>
          </TouchableOpacity>

          {sexPick && (
            <Picker
              selectedValue={optionsState}
              onValueChange={(e) => {
                setOptionsState(e);
                handleSex(e);
              }}
            >
              <Picker.Item label='Choose your sex...' value='0' />
              <Picker.Item label='Male' value='1'>
                <Text>Male</Text>
              </Picker.Item>
              <Picker.Item label='Female' value='2'>
                <Text>Female</Text>
              </Picker.Item>
            </Picker>
          )}

          <TouchableOpacity
            style={styles.toggle}
            onPress={() => showOrientPicker()}
          >
            <Text style={styles.buttonTitle}>{orientLabel + orientToggle}</Text>
          </TouchableOpacity>

          {orientPick && (
            <Picker
              selectedValue={orientationState}
              onValueChange={(e) => {
                setOrientationState(e);
                handleOrientation(e);
                console.log(orientation);
              }}
            >
              <Picker.Item
                label='Choose your sexual orientation...'
                value='0'
              />
              <Picker.Item label='Straight' value='1' />
              <Picker.Item label='Gay/Lesbian' value='2' />
              <Picker.Item label='Bisexual' value='3' />
            </Picker>
          )}

          <TouchableOpacity
            style={styles.toggle}
            onPress={() => showDatePicker()}
            disabled={true}
          >
            <Text style={styles.buttonTitle}>{birth}</Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={date}
              mode={'date'}
              is24Hour={false}
              display='spinner'
              onChange={onChange}
              // style={styles.button}
            />
          )}
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => showRangePicker()}
          >
            <Text style={styles.buttonTitle}>
              {'Select an age range' + rangeToggle}
            </Text>
            <Text style={styles.buttonTitle}>
              {Math.floor(low) + ' - ' + Math.floor(high)}
            </Text>
          </TouchableOpacity>
          {rangePick && (
            <View style={styles.rangeContainer}>
              <Slider
                style={styles.slider}
                min={min}
                max={max}
                low={low}
                high={high}
                step={1}
                disableRange={rangeDisabled}
                floatingLabel={true}
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onValueChanged={handleValueChange}
              />
            </View>
          )}
        </View>

        <Reinput
          style={styles.input}
          label='End of Chat Response'
          labelActiveColor='#E64398'
          labelColor='#000000'
          placeholderColor='#000000'
          underlineColor='#000000'
          activeColor='#E64398'
          value={response}
          ref={responseRef}
          //error={errorEmail}
          onChangeText={(text) => setResponse(text)}
          autoCapitalize='none'
        />
        <TouchableOpacity
          style={styles.register}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.buttonTitle}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.delete}
          onPress={() => {
            Alert.alert(
              'Are you sure you want to delete your account?',
              'This action is permanent and cannot be undone...',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    handleDelete();
                  },
                },
                {
                  text: 'Cancel',
                  onPress: () => {
                    console.log('Cancel pressed');
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.buttonTitle}>Delete Account</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
