import React from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
export default function IconButton({
  iconName = "",
  style = {},
  onPress,
  disabled = false,
  isLoading = false,
  size = 24,
  iconStyle = {},
}) {
  return (
    <TouchableOpacity
      style={{
        ...style,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator size={size} color="black" />
      ) : (
        <AntDesign
          name={iconName}
          size={size}
          color={disabled ? "grey" : "black"}
          style={iconStyle}
        />
      )}
    </TouchableOpacity>
  );
}
