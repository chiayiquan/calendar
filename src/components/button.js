import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
export default function Button({
  label = "",
  buttonStyle = {},
  onPress,
  disabled = false,
  color = colorScheme.blue,
  isLoading = false,
  textStyle = {},
}) {
  return (
    <TouchableOpacity
      style={{
        ...style.container,
        ...buttonStyle,
        backgroundColor: disabled ? color.disabled : color.enabled,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <Text style={{ ...style.buttonText, ...textStyle }}>
          {label.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 50,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: { color: "white", fontSize: 16 },
});

export const colorScheme = {
  blue: {
    enabled: "#2196f3",
    disabled: "#6ab8f7",
  },
  transparent: {
    enabled: "transparent",
    disabled: "transparent",
  },
};
