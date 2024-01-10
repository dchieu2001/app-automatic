import React, { useState } from "react";
import BackButton from "../../components/BackButton";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { emailValidator } from "../../helpers/emailValidator";
import { supabase } from "../../utils/supabase-service";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet
} from "react-native";
import { Layout, useTheme } from "react-native-rapi-ui";
import { AuthStackParamList } from "../../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {theme} from "../../core/theme";

export default function ResetPasswordScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, "ResetPassword">) {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const sendResetPasswordEmail = async () => {
    console.log("reset password");

    setLoading(true);
    const emailError = emailValidator(email);
    if (emailError) {
      setError(emailError );
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(
      email
    );
    if (!error) {
      setLoading(false);
      alert("Check your email to reset your password!");
      navigation.navigate("LoginScreen");
    }
    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <BackButton goBack={navigation.goBack} />
      <Layout style={{ flex: 1, maxWidth: "100%" }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo />
            <Header>Restore Password</Header>
          </View>
          <View style={{ flex: 1, marginHorizontal: 40 }}>
            <TextInput
              label="E-mail address"
              returnKeyType="done"
              value={email}
              onChangeText={(text) => setEmail(text )}
              error={!!error}
              errorText={error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              description="You will receive email with password reset link."
            />
            <Button
              mode="contained"
              onPress={sendResetPasswordEmail}
              style={{ marginTop: 16, marginLeft: "24 %", maxWidth: " 50%" }}
              disabled={loading}
            >
              {loading ? "Loading" : "Send email"}
            </Button>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text >Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("LoginScreen");
                }}
              >
                <Text
                  style={{
                    marginLeft: 5,
                    fontWeight:"bold",
                    color: theme.colors.primary
                  }}
                >
                  Login here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator
                animating={loading}
                color = '#bc2b78'
                size = "large"
                style = {styles.activityIndicator}/>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C0C0C0'
  },

  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
 }
});