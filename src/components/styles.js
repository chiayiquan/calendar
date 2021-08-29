import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

export const containerStyle = {
  flex: 1,
  padding: 25,
  paddingTop: StatusBarHeight + 50,
};

export const contentContainer = {
  width: "100%",
  flex: 1,
  alignItems: "center",
};

const input = {
  padding: (15, 55),
  borderRadius: 5,
  fontSize: 16,
  height: 60,
};
