import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
var scale = 1.19;
export default StyleSheet.create({
  container: {
    marginTop: height / 3.25,
    flex: 1,
    justifyContent: "center",
    height: height / 1.9,
  },
  innerContainer: { borderStyle: "solid", borderWidth: 0 },
  title: { justifyContent: "center" },
  logo: {
    height: 62.5 * scale,
    width: 250 * scale,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 0,
  },
  button: {
    backgroundColor: "#da3636",

    fontWeight: "bold",

    color: "white",

    height: 48,
    width: 120,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#E64398",
    marginTop: 10,
    marginBottom: 10,
    height: 40,
    width: 100,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  dimeImages: {
    height: 120,
    width: 120,
    marginHorizontal: 10,
  },
});
