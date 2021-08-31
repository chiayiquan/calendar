import Constants from "expo-constants";

export const StatusBarHeight = Constants.statusBarHeight;

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
