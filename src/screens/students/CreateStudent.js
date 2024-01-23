import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
  ActivityIndicator,
  // Button,
} from "react-native";
import React, { useCallback, useState } from "react";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import { theme } from "../../core/theme";
import BackButton from "../../components/BackButton";
import TextInput from "../../components/TextInput";
import { supabase } from "../../utils/supabase-service";
import { studentNameValidator } from "../../helpers/studentNameValidator";
import { studentCodeValidator } from "../../helpers/studentCodeValidator";

const CreateStudent = ({ route, navigation }) => {
  const classId = route.params.id;
  const [name, setName] = useState({ value: "", error: "" });
  const [studentCode, setStudentCode] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  const supportedURL = "http://localhost:8889/";

  const themeContainerStyle = loading
    ? styles.background
    : theme.colors.background;

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

  const Done = async () => {
    setLoading(true);
    var check = true;
    const checkStudentCode = studentCodeValidator(studentCode.value);
    const checkName = studentNameValidator(name.value);

    if (checkStudentCode || checkName) {
      var check = false;
      setLoading(false);
      setName({ value: name.value, error: checkName });
      setStudentCode({ value: studentCode.value, error: checkStudentCode });
      return;
    }
    let { data: students, error } = await supabase
      .from("students")
      .select(`*`)
      .eq("class_id", classId)
      .eq("is_delete", false);

    for (let i = 0; i < students.length; i++) {
      if (students[i].student_code === studentCode.value) {
        check = false;
        Alert.alert("Failed!", "Student code already exists. ", [
          {
            text: "Back",
            onPress: () => {},
          },
        ]);
        setLoading(false);
        break;
      }
    }
    if (check) {
      setLoading(false);
      const { err } = await supabase.from("students").insert([
        {
          full_name: name.value,
          student_code: studentCode.value,
          class_id: classId,
        },
      ]);
      if (err) {
        Alert.alert("Failed!", "Create student failed.", [
          {
            text: "Back",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
        setLoading(false);
        return;
      } else {
        setLoading(false);
        Alert.alert(
          "Success!",
          "Create student " + name.value + " successful!",
          [
            {
              text: "Back students list ",
              onPress: () => {
                navigation.pop();
              },
            },
            {
              text: "OK",
              onPress: () => {
                setName({ value: "", error: "" });
                setStudentCode({ value: "", error: "" });
                setLoading(false);
                return;
              },
            },
          ]
        );
        return;
      }
    } else {
      setLoading(false);
      return;
    }
  };

  const Cancel = () => {
    Alert.alert("Cancel!", "Are you sure you want to reset this text box?", [
      {
        text: "Yes",
        onPress: () => {
          setName({ value: "", error: "" });
          setStudentCode({ value: "", error: "" });
          setLoading(false);
          return;
        },
      },
      {
        text: "No",
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <Paragraph style={{ paddingTop: 30, paddingLeft: 20 }}>
        <BackButton goBack={navigation.goBack} />
        {/* <Header>Class</Header> */}
      </Paragraph>
      <ScrollView>
        <Text style={styles.title}>Create Student</Text>
        <View style={styles.container}>
          {/* input name class code */}
          <View style={styles.box}>
            <TextInput
              keyboardType="default"
              label="Student Code"
              returnKeyType="next"
              value={studentCode.value}
              onChangeText={(text) =>
                setStudentCode({ value: text, error: "" })
              }
              error={!!studentCode.error}
              errorText={studentCode.error}
            ></TextInput>
          </View>
          {/* input name class  */}
          <View style={styles.box}>
            <TextInput
              keyboardType="default"
              label="Student Name"
              returnKeyType="done"
              value={name.value}
              onChangeText={(text) => setName({ value: text, error: "" })}
              error={!!name.error}
              errorText={name.error}
            ></TextInput>
          </View>
        </View>

        {/* button handle */}
        <View style={{ marginHorizontal: "10%", marginTop: 50 }}>
          {/* <Button
            mode="outlined"
            style={{ marginTop: 50 }}
            color={theme.colors.yelow}
            onPress={chooseFile}
          > */}
          {/*  */}
          <OpenURLButton url={supportedURL}>
            Import file student(s)
          </OpenURLButton>
          {/* </Button> */}
          <Button mode="outlined" onPress={Cancel}>
            Cancel
          </Button>
          <Button disabled={loading} mode="contained" onPress={Done}>
            {loading ? "Loading" : "Create Student"}
          </Button>
        </View>
        <ActivityIndicator
          animating={loading}
          color="#bc2b78"
          size="large"
          style={styles.activityIndicator}
        />
        {/* </Background> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateStudent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    left: "3%",
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 30,
    // margin: "20%",
    marginHorizontal: "12%",
    marginVertical: "15%",
    color: theme.colors.primary,
  },
  box: {
    maxWidth: "80%",
    marginTop: 20,
    marginLeft: "10%",
    marginRight: "10%",
    flexDirection: "row",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    position: "absolute",
    top: "45%",
    left: "45%",
  },
  background: {
    backgroundColor: "#C0C0C0",
  },
});
