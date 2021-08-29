import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Octicons, Ionicons } from "@expo/vector-icons";

export default function Input({
  label,
  inputValue,
  inputOnChange,
  onBlur,
  labelStyle = {},
  inputStyle = {},
  keyboardType = "default",
  secureTextEntry = false,
  leftIconName,
  isError = false,
  errorLabel = "",
}) {
  const [togglePassword, setTogglePassword] = useState(secureTextEntry);
  const textInputStyle = leftIconName
    ? { ...style.input, ...style.inputWithLeftIcon, ...inputStyle }
    : { ...style.input, ...inputStyle };
  return (
    <View style={style.container}>
      <View style={style.leftIcon}>
        <Octicons name={leftIconName} size={20} />
      </View>
      <Text style={{ ...style.text, ...labelStyle }}>{label}:</Text>
      <TextInput
        style={
          isError ? { ...textInputStyle, ...style.errorBorder } : textInputStyle
        }
        onChangeText={inputOnChange}
        value={inputValue}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry && togglePassword}
        onBlur={onBlur}
      />
      {secureTextEntry ? (
        <TouchableOpacity
          style={style.rightIcon}
          onPress={() => setTogglePassword(!togglePassword)}
        >
          <Ionicons name={togglePassword ? "md-eye-off" : "md-eye"} size={20} />
        </TouchableOpacity>
      ) : null}
      {isError ? (
        <View>
          <Text style={style.errorMessage}>{errorLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    marginVertical: 3,
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  text: {
    fontSize: 13,
    textAlign: "left",
  },
  leftIcon: {
    left: 15,
    top: 30,
    position: "absolute",
    zIndex: 1,
  },
  rightIcon: {
    right: 15,
    top: 30,
    position: "absolute",
    zIndex: 1,
  },
  errorBorder: {
    borderColor: "red",
  },
  errorMessage: {
    color: "red",
    fontSize: 13,
  },
});
