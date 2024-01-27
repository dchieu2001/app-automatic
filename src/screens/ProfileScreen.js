import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase-service";
import { theme } from "../core/theme";
import TextInput from "../components/TextInput";
import { passwordValidator } from "../helpers/passwordValidator";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [imageFromGellary, setImageFromGellary] = useState(null);
  const currentUser = supabase.auth.user();
  const [password, setPassword] = useState({ value: "", error: "" });
  const [passwordConfirm, setPasswordConfirm] = useState({
    value: "",
    error: "",
  });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [visible1, setVisible1] = useState(true);

  const [chane, setChange] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageFromGellary(result.uri);
      const { err } = await supabase
        .from("profile")
        .update({ image_url: imageFromGellary })
        .eq("uid", currentUser.id);

      if (err) {
        console.log("updload image failed", err);
      }
    }
  };
  const Save = async () => {
    setLoading(true);
    console.log(password.value, passwordConfirm.value);
    const passwordError = passwordValidator(password.value);
    const passwordConfirmError = passwordValidator(passwordConfirm.value);

    if (passwordError || passwordConfirmError) {
      setPassword({ value: password.value, error: passwordError });
      setPasswordConfirm({
        value: passwordConfirm.value,
        error: passwordConfirmError,
      });
      setLoading(false);
      return;
    }
    if (password.value !== passwordConfirm.value) {
      setPassword({ value: password.value, error: "Password incorrect." });
      setPasswordConfirm({
        value: passwordConfirm.value,
        error: "Password incorrect.",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.api.updateUserById(currentUser.id, {
      email: currentUser.email,
      password: password.value,
    });

    if (error) {
      Alert.alert("Failed!", "Change your password failed!", [
        {
          text: "Back",
          onPress: () => {
            setLoading(false);
            return;
          },
        },
      ]);
    } else {
      console.log("success");
      Alert.alert("Success!", "Change your password successful!", [
        {
          text: "Ok",
          onPress: () => {
            setPassword({ value: "", error: "" });
            setPasswordConfirm({ value: "", error: "" });
            setLoading(false);
            setChange(!chane);
            return;
          },
        },
      ]);
    }
  };
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      alert("Signed out success!");
    }
    if (error) {
      alert(error.message);
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "StartScreen" }],
    });
    // Alert.alert("Sign out!", "Are you sure sign out ?", [
    //   {
    //     text: "OK",
    //     onPress: async () => {

    //     },
    //   },
    // ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const getImageFromDB = async () => {
        const { data: profile, error } = await supabase
          .from("profile")
          .select("*")
          .eq("uid", currentUser.id);
          
        if (profile && profile.length > 0 && profile[0].image_url) {
          setImageFromGellary(profile[0].image_url);
        }
      };
  
      getImageFromDB();
  
      return () => {
        isActive = false;
      };
    }, [currentUser])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView> */}
      <View>
        {/* information account */}
        <View style={styles.inforUser}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                display: "flex",
                top: 5,
                left: "100%",
                marginBottom: 20,
                borderRadius: 50,
                borderColor: "#5F6FC5",
                // padding: 10,
                // borderWidth: 0.5,
              }}
              onLongPress={pickImage}
            >
              {imageFromGellary ? (
                <Image
                  style={styles.avt_image}
                  source={{ uri: imageFromGellary }}
                />
              ) : (
                <Image
                  source={require("../assets/person.png")}
                  style={styles.avt_image}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Text style={{ width: "30%" }}>Email: </Text>
            <Text>{currentUser.email}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Text style={{ width: "30%" }}>Password: </Text>
            <Text>******</Text>
          </View>

          {chane ? (
            <>
              {/* password */}
              <View
                style={{ flexDirection: "row", width: "100%", maxHeight: 10 }}
              >
                <View style={{ flexDirection: "column", width: "10%" }}></View>
                <View style={{ flexDirection: "column", width: "60%" }}>
                  <TextInput
                    label="Password"
                    returnKeyType="done"
                    value={password.value}
                    onChangeText={(text) =>
                      setPassword({ value: text, error: "" })
                    }
                    error={!!password.error}
                    errorText={password.error}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    secureTextEntry={visible}
                    style={{ padding: 0, height: 30 }}
                  />
                  <TouchableOpacity
                    style={{ position: "absolute", right: -20, top: 15 }}
                    onPress={() => setVisible(!visible)}
                  >
                    {visible ? (
                      <Image
                        source={require("../assets/visible.png")}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        source={require("../assets/invisible.png")}
                        style={styles.image}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* password confirm */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  marginTop: password.error ? 70 : 30,
                  marginBottom: 40,
                }}
              >
                <View style={{ flexDirection: "column", width: "10%" }}></View>
                <View style={{ flexDirection: "column", width: "60%" }}>
                  <TextInput
                    label="Password confirm"
                    returnKeyType="done"
                    value={passwordConfirm.value}
                    onChangeText={(text) =>
                      setPasswordConfirm({ value: text, error: "" })
                    }
                    error={!!passwordConfirm.error}
                    errorText={passwordConfirm.error}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    secureTextEntry={visible1}
                    style={{ padding: 0, height: 30 }}
                  />
                  <TouchableOpacity
                    style={{ position: "absolute", right: -20, top: 15 }}
                    onPress={() => setVisible1(!visible1)}
                  >
                    {visible1 ? (
                      <Image
                        source={require("../assets/visible.png")}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        source={require("../assets/invisible.png")}
                        style={styles.image}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              display: "flex",
              right: "38%",
              bottom: 0,
              position: "absolute",
            }}
          >
            {chane ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setChange(!chane);
                      setPasswordConfirm({ value: "", error: "" });
                      setPassword({ value: "", error: "" });
                    }}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "column", marginLeft: 20 }}>
                  <TouchableOpacity onPress={Save}>
                    <Text>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  padding: 5,
                  borderRadius: 10,
                  alignContent: "center",
                  justifyContent: "center",
                  backgroundColor: "#5F6FC5",
                }}
                onPress={() => setChange(!chane)}
              >
                {/* <Image
                  source={require("../assets/pencil.png")}
                  style={styles.image}
                /> */}
                <Text style={{ color: "white" }}>Change Password</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/*  */}
        <View style={styles.content}>
          <View style={styles.shadow}>
            <TouchableOpacity style={styles.box}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#34C759",
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("../assets/termOfService.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    top: 5,
                    left: 5,
                  }}
                />
              </View>
              <Text style={styles.text}>Terms of service</Text>
              <View style={styles.ico_arrow}>
                <Image
                  source={require("../assets/Arrow.png")}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.shadow}>
            <TouchableOpacity style={styles.box}>
              <View
                style={{
                  width: 30,
                  height: 30,

                  backgroundColor: "#5856D6",
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("../assets/question.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    top: 5,
                    left: 5,
                  }}
                />
              </View>
              <Text style={styles.text}>FAQ</Text>
              <View style={styles.ico_arrow}>
                <Image
                  source={require("../assets/Arrow.png")}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.shadow}>
            <TouchableOpacity style={styles.box}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: theme.colors.placeholder,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("../assets/Lock.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    top: 5,
                    left: 5,
                  }}
                />
              </View>
              <Text style={styles.text}>Privacy policy</Text>
              <View style={styles.ico_arrow}>
                <Image
                  source={require("../assets/Arrow.png")}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* log out */}
          <View style={styles.shadow}>
            <TouchableOpacity style={styles.box} onPress={logout}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: theme.colors.error,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("../assets/logout.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    top: 5,
                    left: 5,
                  }}
                />
              </View>
              <Text style={styles.text}>Logout</Text>
              <View style={styles.ico_arrow}>
                <Image
                  source={require("../assets/Arrow.png")}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* version and information teamdev */}
          <View style={styles.footer}>
            
          </View>
        </View>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  content: {
    marginHorizontal: 40,
    height: "60%",
  },
  inforUser: {
    borderBottomEndRadius: 140,
    borderBottomStartRadius: 140,
    width: "100%",
    backgroundColor: theme.colors.background,
    minHeight: "40%",
    height: "auto",
    marginBottom: 10,
    paddingLeft: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  shadow: {
    backgroundColor: theme.colors.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 10,
    borderRadius: 10,
  },

  box: {
    flexDirection: "row",
    alignContent: "center",
    marginVertical: 5,
    height: 30,
  },

  text: {
    alignContent: "center",
    paddingLeft: 30,
    top: 5,
  },
  image: {
    width: 14,
    height: 14,
    tintColor: "#ffffff",
    tintColor: theme.colors.label,
    borderRadius: 10,
  },
  ico_arrow: {
    display: "flex",
    top: 7,
    right: 25,
    position: "absolute",
  },
  footer: {
    color: "#516F7F",
    display: "flex",
    bottom: 35,
    right: 0,
    position: "absolute",
  },
  avt_image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
