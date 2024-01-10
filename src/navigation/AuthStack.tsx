import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen, RegisterScreen, ResetPasswordScreen, StartScreen } from "../screens";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="StartScreen" component ={StartScreen} />
      <AuthStack.Screen name="LoginScreen" component ={LoginScreen} />
      <AuthStack.Screen name="RegisterScreen" component ={RegisterScreen} />
      <AuthStack.Screen name="ResetPasswordScreen" component ={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
};

export default Auth;
