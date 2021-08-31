import React, { useState } from "react";
import RootStack from "./src/routes/homeStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "./src/components/credentialsContext";
import AppLoading from "expo-app-loading";
import FlashMessage from "react-native-flash-message";

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState(null);

  const checkLoginCredentials = () => {
    AsyncStorage.getItem("goalSetting")
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };
  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    );
  }
  return (
    <CredentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials }}
    >
      <RootStack />
      <FlashMessage position="top" style={{ alignItems: "center" }} />
    </CredentialsContext.Provider>
  );
}
