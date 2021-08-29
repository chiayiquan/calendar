import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";

export default function Line() {
  return <View style={style.container} />;
}

const style = StyleSheet.create({
  container: {
    height: 1,
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#9CA3AF",
  },
});
