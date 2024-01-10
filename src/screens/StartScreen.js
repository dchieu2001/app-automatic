import React, { useCallback } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { Alert, Linking } from "react-native";
export default function StartScreen({ navigation }) {
  const supportedURL = "http://localhost:8889/register";

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <Button mode="outlined" onPress={handlePress}>
        {children}
      </Button>
    );
  };
  return (
    <Background>
      <Logo />
      <Header>InstaGrade5</Header>
      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>
      {/* <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Sign Up
      </Button> */}
      <OpenURLButton url={supportedURL}>Sign Up</OpenURLButton>
    </Background>
  );
}
