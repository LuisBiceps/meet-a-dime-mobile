import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: height / 2,
  },
  formContainer: {
    flexDirection: 'column',
    height: 20,
    marginTop: 10,
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 15,
    flex: 1,

    paddingTop: 1,
    paddingBottom: 0,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    flex: 1,
    width: 350,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 5,
    top: -100,
    marginLeft: 15,
    marginRight: 15,
    position: 'absolute',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    backgroundColor: '#e64398',
    top: 225,
    marginBottom: 5,
    height: 48,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 2,
    position: 'absolute',
  },
  matches: {
    top: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: 'black',
    fontSize: 16,
    position: 'absolute',
    top: 200,
  },
  bottomText: {
    color: 'black',
    fontSize: 16,
    paddingBottom: height / 4,
  },
  modal: {
    position: 'absolute',
    top: 290,
  },
  matchFound: { color: 'black', fontSize: 16, position: 'absolute', top: 490 },
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: '#333333',
  },
  searchImage: {
    height: 200,
    width: 200,
  },
});
