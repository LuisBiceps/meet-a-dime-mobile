import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  icon: {},
  drawerIcon: {
    marginLeft: 0,
    alignSelf: 'center',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width / 20,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  menuItemsCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  circleContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 10,
  },
  drawer: {},
  toggle: {
    backgroundColor: '#e64398',
    marginLeft: 3,
    marginRight: 3,
    marginTop: 5,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
