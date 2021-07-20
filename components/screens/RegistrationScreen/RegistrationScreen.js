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
  // const firstName = useRef();
  const [lastName, setLastName] = useState('');
  // const lastName = useRef();

  const [email, setEmail] = useState('');
  // const email = useRef();
  const [password, setPassword] = useState('');
  // const password = useRef();
  const [confirmPassword, setConfirmPassword] = useState('');
  // const confirmPassword = useRef();
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

  // const toggleRangeEnabled = useCallback(
  //   () => setRangeDisabled(!rangeDisabled),
  //   [rangeDisabled]
  // );
  // const setMinTo50 = useCallback(() => setMin(50), []);
  // const setMinTo0 = useCallback(() => setMin(0), []);
  // const setMaxTo100 = useCallback(() => setMax(100), []);
  // const setMaxTo500 = useCallback(() => setMax(500), []);
  // const toggleFloatingLabel = useCallback(
  //   () => setFloatingLabel(!floatingLabel),
  //   [floatingLabel]
  // );
  moment.suppressDeprecationWarnings = true;
  var fromToday = moment().subtract(18, 'years').add(1, 'day').calendar();
  var dob = moment(fromToday).format('YYYY-MM-DD');

  var cleanDate = useRef('');

  const [date, setDate] = useState(new Date(dob));
  const [show, setShow] = useState(false);
  const [sexPick, setSexPick] = useState(false);
  const [orientPick, setOrientPick] = useState(false);
  const [birth, setBirth] = useState('Select your Date of Birth');

  const [sex, setSex] = useState('Choose your sex...');
  const [orientation, setOrientation] = useState(
    'Choose your sexual orientation...'
  );

  var orient = {
    1: 'Heterosexual',
    2: 'Homosexual',
    3: 'Bisexual',
    4: 'Bisexual',
  };

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  async function handleRegister() {
    // navigation.navigate("Login");
    // ******* Form validation still needed *******
    navigation.navigate('Verify');
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
        url: 'http://localhost:5000/api/newuser',
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
    } else setShow(true);
  };

  const showSexPicker = () => {
    if (sexPick) {
      setSexPick(false);
    } else setSexPick(true);
  };
  const showOrientPicker = () => {
    if (orientPick) {
      setOrientPick(false);
    } else setOrientPick(true);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='never'
        scrollEnabled='false'
      >
        <Image
          style={styles.logo}
          source={require('../../../assets/DimeAssets/coinsignup.png')}
        />
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Create an Account</Text>
        </View>
        <View style={styles.innerContainer}>
          <Reinput
            style={styles.firstname}
            label='First Name'
            labelActiveColor='#E64398'
            activeColor='#E64398'
            value={firstName}
            //error={errorEmail}
            onChangeText={(text) => setFirstName(text)}
            autoCapitalize='words'
          />

          <Reinput
            style={styles.lastname}
            label='Last Name'
            labelActiveColor='#E64398'
            activeColor='#E64398'
            value={lastName}
            //error={errorEmail}
            onChangeText={(text) => setLastName(text)}
            autoCapitalize='words'
          />
        </View>
        <Reinput
          style={styles.input}
          label='E-mail'
          labelActiveColor='#E64398'
          activeColor='#E64398'
          value={email}
          //error={errorEmail}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize='none'
        />

        <Reinput
          style={styles.input}
          label='Password'
          labelActiveColor='#E64398'
          activeColor='#E64398'
          value={password}
          //error={errorEmail}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize='none'
          secureTextEntry
        />
        <Reinput
          style={styles.input}
          label='Confirm Password'
          labelActiveColor='#E64398'
          activeColor='#E64398'
          value={confirmPassword}
          //error={errorEmail}
          onChangeText={(text) => setConfirmPassword(text)}
          autoCapitalize='none'
          secureTextEntry
        />

        <Reinput
          style={styles.input}
          label='Phone Number'
          labelActiveColor='#E64398'
          activeColor='#E64398'
          value={phone}
          //error={errorEmail}
          onChangeText={(text) => phoneWork(text)}
          autoCapitalize='none'
        />
        <View style={styles.responseContainer}>
          <Text style={styles.response}>Press to Select</Text>
        </View>
        <TouchableOpacity style={styles.toggle} onPress={() => showSexPicker()}>
          <Text style={styles.buttonTitle}>{sex}</Text>
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
          <Text style={styles.buttonTitle}>{orientation}</Text>
        </TouchableOpacity>

        {orientPick && (
          <Picker
            selectedValue={orientation}
            onValueChange={(e) => setOrientation(e)}
          >
            <Picker.Item
              label='Choose your sexual orientation...'
              value='Choose your sexual orientation...'
            />
            <Picker.Item label='Straight' value='Heterosexual' />
            <Picker.Item label='Gay/Lesbian' value='Homosexual' />
            <Picker.Item label='Bisexual' value='Bisexual' />
            <Picker.Item label='Other' value='Other' />
          </Picker>
        )}

        <TouchableOpacity
          style={styles.toggle}
          onPress={() => showDatePicker()}
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

        <View style={styles.rangeContainer}>
          <Text style={styles.range}>Select an age range</Text>
          {/* <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={18}
            maximumValue={72}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="red"
            onValueChange={(val) => setValue(Math.floor(val))}
          /> */}
          <Text style={styles.range}>
            {Math.floor(low) + ' - ' + Math.floor(high)}
          </Text>

          <Slider
            style={styles.slider}
            min={min}
            max={max}
            low={low}
            high={high}
            step={1}
            disableRange={rangeDisabled}
            floatingLabel={floatingLabel}
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            renderNotch={renderNotch}
            onValueChanged={handleValueChange}
          />
        </View>

        <Reinput
          style={styles.input}
          label='End of Chat Response'
          labelActiveColor='#E64398'
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
          style={styles.toggle}
          onPress={() => handleRegister()}
        >
          <Text style={styles.buttonTitle}>Register</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
