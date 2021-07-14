import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    marginTop: height / 3,
    flex: 1,
    justifyContent: "center",
    margin: 30,
  },
  innerContainer: { flexDirection: "row" },
  logo: {
    flex: 1,
    height: 150,
    width: "45%",
    alignSelf: "center",
    margin: 10,
    marginTop: 35,
  },
  rangeContainer: {
    flex: 1,
    alignItems: "center",
    padding: 25,
    marginBottom: 25,
  },
  verifyContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
  },

  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },

  button: {
    backgroundColor: "#e64398",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    paddingRight: 15,
    paddingLeft: 15,
  },
  toggle: {
    backgroundColor: "#e64398",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
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
    marginTop: 20,
  },
  Confirm: {
    flex: 1,
    alignItems: "center",
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
