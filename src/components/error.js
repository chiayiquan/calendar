import React from "react";
import { Text, StyleSheet, View } from "react-native";

export default function Error({ message }) {
  return (
    <View style={style.container}>
      <Text style={style.errorMessage}>{message}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  errorMessage: {
    color: "red",
    fontSize: 13,
  },
});
