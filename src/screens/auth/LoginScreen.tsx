import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import BackButton from "../../components/BackButton";
import { theme } from "../../core/theme";
import { emailValidator } from "../../helpers/emailValidator";
import { passwordValidator } from "../../helpers/passwordValidator";
import { supabase } from "../../utils/supabase-service";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Layout, useTheme } from "react-native-rapi-ui";
// import { useAuth } from "../utils/AuthContext";
import { AuthStackParamList } from "../../types/navigation";
import { StatusBar } from "expo-status-bar";

export default function ({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, "Login">) {

  const [email, setEmail] = useState < string > ();
  const [password, setPassword] = useState < string > ();
  const [errorE, setErrorE] = useState < string >();
  const [errorP, setErrorP] = useState < string >();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  // const { signIn } = useAuth();
  const themeContainerStyle =
  loading ? styles.background : theme.colors.background;

  const onLoginPressed = async () => {
    setLoading(true);
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);

    console.log("clicked login", email, password);
    // validate username & password
    if (emailError || passwordError) {
      setLoading(false);
      setErrorE(emailError);
      setErrorP(passwordError);
      return;
    }else {
      setErrorE("");
      setErrorP("");
      const {user, error } = await supabase.auth.signIn({ email: email, password: password });

    if (!error && !user) {
      setLoading(false);
      alert("Check your email for the login link!");
    }
    if (error) {
      setLoading(false);
      Alert.alert("Login failed!", "Username or password incorrect.", [
        {
          text: "Back",
          onPress: () => {},
        },
      ]);
    }
    setLoading(false)

    if (user) {
      // navigation.reset({
      //   index: 0,
      //   routes: [{name: "TabBottom",],

      // });
      navigation.navigate( "TabBottom" );
    }
  }
  };

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <StatusBar style="light"/>
    {/* <KeyboardAvoidingView behavior="height" enabled > */}
      {/* <Layout> */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <BackButton goBack={navigation.goBack} />
          <View
            style={{
              // flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: '30%'
            }}
          >

               <Logo />
            <Header
              style={{
                fontSize: 40,
                justifyContent: "center",
                color: theme.colors.primary,
                letterSpacing: 1,
                fontWeight: "bold",
              }}
            >
              InstaGrade5
            </Header>
            <View
              style={{
                marginHorizontal: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ marginTop: 20, flexDirection: 'row',}}>
                <TextInput
                  label="Email"
                  returnKeyType="next"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  error={!!errorE}
                  errorText={errorE}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  description=""
                  style={themeContainerStyle}
                  />
              </View>
              <View style={{ marginTop: 20, flexDirection: 'row'}}>
                <TextInput
                  label="Password"
                  returnKeyType="done"
                  value={password}
                  onChangeText={(text: React.SetStateAction<string | undefined>) => setPassword(text)}
                  error={!!errorP}
                  errorText={errorP}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  secureTextEntry={visible}
                  description=""
                  style={themeContainerStyle}
                />
                <TouchableOpacity style={{position: 'absolute',  right: -35, top: 0}} onPress={()=> setVisible(!visible)}>
                  {visible?<Image source={require("../../assets/visible.png")} style={styles.image} />:
                  <Image source={require("../../assets/invisible.png")} style={styles.image} />}
                </TouchableOpacity>
              </View>

              <View style={styles.forgotPassword}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ResetPasswordScreen")}
                >
                  <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
              </View>

              <Button
                  mode="contained"
                  onPress={onLoginPressed}
                  disabled={loading}
                   style={{ width: 200}}>
                {loading ? "Loading" : "Log in"}
              </Button>
              <ActivityIndicator
                animating={loading}
                color = '#bc2b78'
                size = "large"
                style = {styles.activityIndicator}/>

              <View style={styles.row}>
                <Text>Don’t have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.replace("RegisterScreen")}
                >
                  <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      {/* </Layout> */}
    {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
    paddingLeft: "50%",
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  image: {
    width: 20,
    height: 20,
    display: "flex",
    top: 26,
    right: 10,
    // positions: 'absolute'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    position: 'absolute',
    top: "45%",
    left: "45%",
 },
 background: {
  backgroundColor: '#C0C0C0'
},
});
