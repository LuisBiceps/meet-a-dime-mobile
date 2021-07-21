import React, { useState, useCallback, useRef } from 'react';
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Reinput from 'reinput';
import { Formik } from 'formik';
import * as yup from 'yup';

import { HeaderBackButton } from '@react-navigation/stack';
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
const DEFAULT_COIN_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/meet-a-dime.appspot.com/o/default_1.png?alt=media&token=23ab5b95-0214-42e3-9c54-d7811362aafc';

export default function RegistrationScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [value, setValue] = useState(18);
  const [response, setResponse] = useState('');
  const [phone, setPhone] = useState('');

  const [rangeDisabled, setRangeDisabled] = useState(false);
  const [low, setLow] = useState(18);
  const [high, setHigh] = useState(24);
  const [min, setMin] = useState(18);
  const [max, setMax] = useState(72);
  const [floatingLabel, setFloatingLabel] = useState(true);

  const { signup, logout } = useAuth();

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
  const [sexLabel, setSexLabel] = useState('Choose your sex...');
  const [sexToggle, setSexToggle] = useState(' (open)');
  const [orientation, setOrientation] = useState('');
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

  var orient = {
    1: 'Heterosexual',
    2: 'Homosexual',
    3: 'Bisexual',
    4: 'Bisexual',
  };

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  function isLegal(date, minimum_age = 18) {
    const [year, month, day] = date.split('-');
    const [y, m, d] = moment()
      .subtract(18, 'years')
      .format('yyyy-MM-DD')
      .split('-');

    var d1 = new Date(y, m, d);
    var d2 = new Date(year, month, day);
    // console.log(d2 <= d1 ? true : false);
    return d2 <= d1 ? true : false;
  }

  function handleError(error) {
    if (error === 'auth/email-already-in-use') {
      setEmailError('This email is already in use.');
    } else if (error === 'auth/invalid-email') {
      setEmailError('Please enter a valid email address.');
    } else {
      setErrorEmail('There was an error making your account');

      setAccountError('There was an error making your account');
    }
  }

  async function handleRegister() {
    // navigation.navigate("Login");
    // ******* Form validation still needed *******
    var hasError = false;

    setConfirmError('');
    setPassError('');
    setHasGeneralError(false);
    setGeneralError('');
    setPhoneError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      hasError = true;
    }

    if (password.length <= 6) {
      setPassError('Password should be more than six characters.');
      setConfirmError('Password should be more than six characters.');
      hasError = true;
    }

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

    if (birth === 'Select your Date of Birth') {
      setHasGeneralError(true);
      setGeneralError('Please enter a valid date of birth.');
      hasError = true;
    }

    if (birth !== 'Select your Date of Birth') {
      if (!isLegal(cleanDate.current)) {
        setHasGeneralError(true);
        setGeneralError('You must be 18 years or older to sign up.');
        hasError = true;
      }
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
      var cred = await signup(email.trim(), password);
      var newUser = cred.user;
      var obj = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: newUser.email,
        sex: sex,
        sexOrientation: orientation,
        birth: cleanDate.current,
        phone: phone,
        exitMessage: response.trim(),
        userID: newUser.uid,
        photo: DEFAULT_COIN_IMAGE,
        displayName: newUser.displayName === null ? '' : newUser.displayName,
        initializedProfile: 0,
        FailMatch: [],
        SuccessMatch: [],
        ageRangeMin: low,
        ageRangeMax: high,
      };

      console.log(obj);

      var config = {
        method: 'post',
        url: 'https://meetadime.herokuapp.com/api/newuser',
        headers: {
          'Content-Type': 'application/json',
        },
        data: obj,
      };

      var res = await axios(config);
      // console.log(response.data);
      if (res.data.error === '') {
        navigation.navigate('Verify');
      }
    } catch (error) {
      console.log(error);
      handleError(error.code === undefined ? error : error.code);
      hasError = true;
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
  const handleOrientation = (preference) => {
    if (preference === 'Straight') {
      setOrientation('Heterosexual');
      setOrientLabel(preference);
    } else if (preference === 'Gay/Lesbian') {
      setOrientation('Homosexual');
      setOrientLabel(preference);
    } else if (preference === 'Bisexual' || preference === 'Other') {
      setOrientation('Bisexual');
      setOrientLabel(preference);
    } else {
      setOrientLabel(preference);
    }
  };

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
          <Text style={styles.heading}>Create an Account</Text>
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
            onChangeText={(text) => setFirstName(text)}
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
            onChangeText={(text) => setLastName(text)}
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
          onChangeText={(text) => setEmail(text)}
          autoCapitalize='none'
        />

        <Reinput
          style={styles.input}
          label='Password'
          labelActiveColor='#E64398'
          labelColor='#000000'
          placeholderColor='#000000'
          underlineColor='#000000'
          activeColor='#E64398'
          value={password}
          error={passError}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize='none'
          secureTextEntry
        />
        <Reinput
          style={styles.input}
          label='Confirm Password'
          labelActiveColor='#E64398'
          labelColor='#000000'
          placeholderColor='#000000'
          underlineColor='#000000'
          activeColor='#E64398'
          value={confirmPassword}
          error={confirmError}
          onChangeText={(text) => setConfirmPassword(text)}
          autoCapitalize='none'
          secureTextEntry
        />

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
          onChangeText={(text) => phoneWork(text)}
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
            <Picker selectedValue={sex} onValueChange={(e) => setSex(e)}>
              <Picker.Item
                label='Choose your sex...'
                value='Choose your sex...'
              />
              <Picker.Item label='Male' value='Male' />
              <Picker.Item label='Female' value='Female' />
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
              selectedValue={orientLabel}
              onValueChange={(e) => handleOrientation(e)}
            >
              <Picker.Item
                label='Choose your sexual orientation...'
                value='Choose your sexual orientation...'
              />
              <Picker.Item label='Straight' value='Straight' />
              <Picker.Item label='Gay/Lesbian' value='Gay/Lesbian' />
              <Picker.Item label='Bisexual' value='Bisexual' />
              <Picker.Item label='Other' value='Other' />
            </Picker>
          )}

          <TouchableOpacity
            style={styles.toggle}
            onPress={() => showDatePicker()}
          >
            <Text style={styles.buttonTitle}>{birth + dateToggle}</Text>
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
          //error={errorEmail}
          onChangeText={(text) => setResponse(text)}
          autoCapitalize='none'
        />
        <View style={styles.responseContainer}>
          <Text style={styles.response}>This can be changed later...</Text>
        </View>
        <TouchableOpacity
          style={styles.register}
          onPress={() => handleRegister()}
        >
          <Text style={styles.buttonTitle}>Register</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
