import React, { useState, useCallback, useRef } from "react";
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./styles";
import moment from "moment";
// import Slider from "@react-native-community/slider";
import Slider from "rn-range-slider";
import Thumb from "../../slider/Thumb";
import Rail from "../../slider/Rail";
import RailSelected from "../../slider/RailSelected";
import Label from "../../slider/Label";
import Notch from "../../slider/Notch";

export default function RegistrationScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [value, setValue] = useState(18);

  const [rangeDisabled, setRangeDisabled] = useState(false);
  const [low, setLow] = useState(18);
  const [high, setHigh] = useState(24);
  const [min, setMin] = useState(18);
  const [max, setMax] = useState(72);
  const [floatingLabel, setFloatingLabel] = useState(false);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);

  const toggleRangeEnabled = useCallback(
    () => setRangeDisabled(!rangeDisabled),
    [rangeDisabled]
  );
  const setMinTo50 = useCallback(() => setMin(50), []);
  const setMinTo0 = useCallback(() => setMin(0), []);
  const setMaxTo100 = useCallback(() => setMax(100), []);
  const setMaxTo500 = useCallback(() => setMax(500), []);
  const toggleFloatingLabel = useCallback(
    () => setFloatingLabel(!floatingLabel),
    [floatingLabel]
  );

  var fromToday = moment().subtract(18, "years").add(1, "day").calendar();
  var dob = moment(fromToday).format("YYYY-MM-DD");

  var cleanDate = useRef("");

  const [date, setDate] = useState(new Date(dob));
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const [birth, setBirth] = useState("Select Date of Birth");

  const onFooterLinkPress = () => {
    navigation.navigate("Login");
  };

  const onNextPress = () => {
    navigation.navigate("Login");
  };

  const onChange = (event, selectedDate) => {
    var currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    currentDate = moment(currentDate).subtract(1, "day");
    // Used for button text format
    var temp = moment(currentDate).add(1, "day").format("MMMM Do YYYY");
    var realDate = currentDate.toJSON();
    realDate = JSON.stringify(realDate);
    // cleanDate used for database
    cleanDate.current = realDate.replace("T01:00:00.000Z", "");
    cleanDate.current = cleanDate.current.replace("T00:00:00.000Z", "");
    setBirth(temp);
    console.log(value);
    console.log(cleanDate.current);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const showDatePicker = () => {
    if (show) {
      setShow(false);
    } else setShow(true);
  };

  const hideDatePicker = () => {
    if (display) {
      setShow(false);
      setDisplay(false);
    } else setDisplay(true);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image
          style={styles.logo}
          source={require("../../../assets/DimeAssets/coinsignup.png")}
        />
        <View style={styles.innerContainer}>
          <TextInput
            style={styles.firstname}
            placeholder="First Name"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.lastname}
            placeholder="Last Name"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
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
          style={styles.password}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.confirmPass}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => showDatePicker()}
        >
          <Text style={styles.buttonTitle}>{birth}</Text>
        </TouchableOpacity>
        <View style={styles.Confirm}>
          <Text style={{ fontSize: 10 }}>
            {show ? "Tap to Close" : "Tap to Open"}
          </Text>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            is24Hour={false}
            display="spinner"
            onChange={onChange}
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
            {Math.floor(low) + " - " + Math.floor(high)}
          </Text>
          <Slider
            style={styles.slider}
            min={min}
            max={max}
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
        <TouchableOpacity style={styles.button} onPress={() => onNextPress()}>
          <Text style={styles.buttonTitle}>Next</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
