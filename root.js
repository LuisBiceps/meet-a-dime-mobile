import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  icon: {},
  container: {
    marginLeft: width / 20,
  },
});