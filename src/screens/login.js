import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as Styles from "../components/styles";
import * as Regex from "../components/regex";
import ApiRoutes from "../routes/api";
import { StatusBar } from "expo-status-bar";
import Input from "../components/input";
import Button from "../components/button";
import Line from "../components/line";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../components/credentialsContext";
import Error from "../components/error";

export default function Login({ navigation }) {
  const [form, setForm] = useState({
    email: {
      value: "",
      isError: false,
    },
    password: {
      value: "",
      isError: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setStoredCredentials } = useContext(CredentialsContext);

  const onValueChange = (type) => (value) => {
    return setForm((state) => ({
      ...state,
      [type]: { value, isError: false },
    }));
  };

  const onBlur = (type) => {
    switch (type) {
      case "email":
        if (Regex.checkValidEmail(form.email.value) === false) {
          return setForm((state) => ({
            ...state,
            email: { ...state.email, isError: true },
          }));
        }
        break;
      default:
        return setForm((state) => ({
          ...state,
          password: {
            ...state.password,
            isError: state.password.value.trim().length === 0,
          },
        }));
    }
  };

  const onPress = () => {
    setError(false);
    setIsLoading(true);
    if (Regex.checkValidEmail(form.email.value) === false) {
      return setForm((state) => ({
        ...state,
        email: { ...state.email, isError: true },
      }));
    }
    if (form.password.value.trim().length === 0) {
      return setForm((state) => ({
        ...state,
        password: {
          ...state.password,
          isError: true,
        },
      }));
    }
    return axios
      .post(ApiRoutes.login, {
        email: form.email.value.trim().toLowerCase(),
        password: form.password.value.trim(),
      })
      .then((response) => {
        const result = response.data.data;
        return AsyncStorage.setItem("goalSetting", JSON.stringify(result))
          .then(() => {
            setStoredCredentials(result);
          })
          .catch((error) => {
            setError("Permission issue with local storage.");
            console.log(error);
          });
      })
      .catch((err) => {
        return setError(err.response.data.message);
      })
      .finally(() => setIsLoading(false));
  };

  const isButtonDisabled = () => {
    return Object.keys(form).every(
      (key) => form[key].value.trim().length > 0 && form[key].isError === false
    );
  };

  return (
    <View style={style.container}>
      <StatusBar style="dark" />
      <View style={style.contentContainer}>
        {/* Update the logo source here */}
        <Image
          style={style.logo}
          resizeMode="cover"
          source={require("../assets/icon.png")}
        />
        <Text style={style.title}>Login</Text>
        <View style={style.form}>
          <Input
            label="Email"
            inputValue={form.email.value}
            inputOnChange={onValueChange("email")}
            keyboardType="email-address"
            leftIconName="mail"
            onBlur={() => onBlur("email")}
            isError={form.email.isError}
            errorLabel="Email is invalid."
          />
          <Input
            label="Password"
            inputValue={form.password.value}
            inputOnChange={onValueChange("password")}
            secureTextEntry={true}
            leftIconName="lock"
            onBlur={() => onBlur("password")}
            isError={form.password.isError}
            errorLabel="Password cannot be empty."
          />
          <Error message={error} />
          <View style={style.buttonContainer}>
            <Button
              label="Login"
              onPress={onPress}
              disabled={!isButtonDisabled() || isLoading}
              isLoading={isLoading}
            />
          </View>
          <Line />
          <View style={style.registerContainer}>
            <Text>Don't have an account already? </Text>
            <TouchableOpacity
              style={style.linkContainer}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={style.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: Styles.containerStyle,
  contentContainer: Styles.contentContainer,
  logo: {
    width: 200,
    height: 150,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    padding: 10,
    marginTop: 10,
  },
  form: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  buttonContainer: {
    margin: (0, 5),
  },
  registerContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  linkText: {
    justifyContent: "center",
    alignContent: "center",
    color: "#6D28D9",
    fontSize: 15,
  },
  linkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
