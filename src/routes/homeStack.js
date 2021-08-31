import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { CredentialsContext } from "../components/credentialsContext";
import Login from "../screens/login";
import Register from "../screens/register";
import Goal from "../screens/goal/goal";

const Stack = createStackNavigator();

export default function RootStack() {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "transparent",
              },
              headerTransparent: true,
              headerTitle: "",
            }}
          >
            {storedCredentials != null ? (
              <Stack.Screen name="Home" component={Goal} />
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
  );
}
