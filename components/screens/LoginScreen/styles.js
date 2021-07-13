import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
export default StyleSheet.create({
  container: {
    marginTop: height / 3.25,
    flex: 1,
    justifyContent: "center",
    maxHeight: height / 1.9,
  },
  innerContainer: { borderStyle: "solid", borderWidth: 0 },
  title: { justifyContent: "center" },
  logo: {
    flex: 1,
    height: 100,
    width: 350,

    alignSelf: "center",
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    justifyContent: "center",

    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#E64398",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#E64398",
    fontWeight: "bold",
    fontSize: 16,
  },
});
