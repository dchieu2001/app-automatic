import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { supabase } from "../../utils/supabase-service";
import { theme } from "../../core/theme";
import { studentCodeValidator } from "../../helpers/studentCodeValidator";
import { studentNameValidator } from "../../helpers/studentNameValidator";
// import Modal from "react-native-modalbox";

const StudentDetail = ({ route, navigation }) => {
  // const refs = useRef();
  const classId = route.params.idClass;
  const studentId = route.params.id;
  const currentUser = supabase.auth.user();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setVisiBle] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentCodeCur, setStudentCodeCur] = useState();
  const [nameEdit, setNameEdit] = useState({ value: "", error: "" });
  const [studentCodeEdit, setStudentCodeEdit] = useState({
    value: "",
    error: "",
  });

  const themeContainerStyle = loading
    ? styles.background
    : theme.colors.background;

  const loadData = async () => {
    let { data: student, error } = await supabase
      .from("students")
      .select(
        `*, classes (
        id, name, uid
      )`
      )
      .eq("id", studentId)
      .eq("classes.uid", currentUser.id)
      .eq("is_delete", false)
      .eq("classes.is_delete", false)
      .order("full_name", { ascending: true });

    if (student.length === 0) {
      setStudents(null);
    } else {
      setStudents(student);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser, loadData]);

  const edit = () => {
    console.log("click edit");
    setVisiBle(true);
    setNameEdit({ value: students[0].full_name, error: "" });
    setStudentCodeEdit({ value: students[0].student_code, error: "" });
    setStudentCodeCur(students[0].student_code);
  };

  const update = async () => {
    setVisiBle(true);
    setLoading(true);
    var check = true;
    const checkStudentCode = studentCodeValidator(studentCodeEdit.value);
    const checkName = studentNameValidator(nameEdit.value);
    if (checkStudentCode || checkName) {
      var check = false;
      setLoading(false);
      setNameEdit({ value: nameEdit.value, error: checkName });
      setStudentCodeEdit({
        value: studentCodeEdit.value,
        error: checkStudentCode,
      });
      return;
    }
    let { data: stu, error } = await supabase.from("students").select(`*`);

    for (let i = 0; i < stu.length; i++) {
      if (studentCodeEdit.value === studentCodeCur) break;
      if (stu[i].student_code === studentCodeEdit.value) {
        check = false;
        setLoading(false);
        Alert.alert("Edit Student failed!", "Student code already exists. ", [
          {
            text: "Back",
            onPress: () => {},
          },
        ]);
        break;
      }
    }
    if (check) {
      setLoading(false);
      const { err } = await supabase
        .from("students")
        .update([
          {
            full_name: nameEdit.value,
            student_code: studentCodeEdit.value,
            class_id: classId,
          },
        ])
        .eq("id", studentId);
      if (err) {
        Alert.alert("Failed!", "Edit Student failed.", [
          {
            text: "Back",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
        return;
      } else {
        setLoading(false);
        Alert.alert("Success!", "Edit Student successful!", [
          {
            text: "Back list students",
            onPress: () => {
              navigation.pop();
            },
          },
          {
            text: "OK",
            onPress: () => {
              setLoading(false);
              return;
            },
          },
        ]);
        return;
      }
    } else {
      setLoading(false);
      return;
    }
  };

  const remove = () => {
    Alert.alert(
      "Delete!",
      "Are you sure delete student " + students[0].full_name + "?",
      [
        {
          text: "Yes",
          onPress: async () => {
            const { error } = await supabase
              .from("students")
              .update([{ is_delete: true }])
              .eq("id", studentId);
            if (error) {
              Alert.alert(
                "Error!",
                "Delete Student " + students[0].full_name + " failed.",
                [
                  {
                    text: "OK",
                    onPress: () => {},
                  },
                ]
              ); //
            } else {
              Alert.alert(
                "Success!",
                "Delete Student " + students[0].full_name + " successfull.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.pop();
                    },
                  },
                ]
              ); //
            }
            return;
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          paddingLeft: 20,
          paddingTop: 30,
          // minWidth: "80%",
          backgroundColor: theme.colors.background,
        }}
      >
        <TouchableOpacity
          onPress={navigation.goBack}
          style={{
            flexDirection: "column",
            alignContent: "center",
            minWidth: "25%",
          }}
        >
          <Image
            source={require("../../assets/arrow_back.png")}
            style={{
              width: 28,
              height: 28,
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            minWidth: "60%",
            paddingBottom: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: theme.colors.primary,
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            Student Detail
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <FlatList
          keyExtractor={(item) => item.id.toFixed()}
          data={students}
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator
          renderItem={({ item, index }) => {
            return (
              <View style={styles.row}>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Image
                    source={require("../../assets/person.png")}
                    resizeMode="contain"
                    style={{
                      width: 70,
                      height: 70,
                    }}
                  />
                  <StatusBar style="auto" />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.row_title}>{item.full_name}</Text>
                  </View>
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <Text style={{ fontWeight: "200" }}>
                      {item.student_code}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    right: 0,
                    bottom: 0,
                    positions: "absolute",
                  }}
                >
                  <TouchableOpacity
                    onPress={edit}
                    style={{
                      width: 28,
                      height: 28,
                      paddingLeft: 10,
                      marginLeft: 10,
                      backgroundColor: "#446FD7",
                    }}
                  >
                    <Image
                      source={require("../../assets/pencil.png")}
                      style={{
                        width: 18,
                        height: 18,
                        right: 5,
                        top: 5,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={remove}
                    style={{
                      width: 28,
                      height: 28,
                      paddingLeft: 10,
                      marginLeft: 10,
                      backgroundColor: theme.colors.error,
                    }}
                  >
                    <Image
                      source={require("../../assets/trash.png")}
                      style={{
                        width: 18,
                        height: 18,
                        right: 5,
                        top: 5,
                      }}
                    />
                  </TouchableOpacity>
                  {/* modal edit student */}
                  <Modal
                    animationType="slide"
                    visible={modalVisible}
                    style={[styles.modal, styles.modal2]}
                    position={"center"}
                    entry={"top"}
                    onRequestClose={() => setVisiBle(false)}
                  >
                    <SafeAreaView
                      style={[styles.container, themeContainerStyle]}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={{ justifyContent: "center" }}>
                          <Text style={styles.title}>Edit Student</Text>
                        </View>
                        <View style={styles.box}>
                          <TextInput
                            required
                            keyboardType="default"
                            label="Student Code"
                            returnKeyType="next"
                            value={studentCodeEdit.value}
                            onChangeText={(text) =>
                              setStudentCodeEdit({ value: text, error: "" })
                            }
                            error={!!studentCodeEdit.error}
                            errorText={studentCodeEdit.error}
                          ></TextInput>
                        </View>
                        {/* input name class  */}
                        <View style={styles.box}>
                          <TextInput
                            keyboardType="default"
                            label="Student Name"
                            returnKeyType="done"
                            value={nameEdit.value}
                            onChangeText={(text) =>
                              setNameEdit({ value: text, error: "" })
                            }
                            error={!!nameEdit.error}
                            errorText={nameEdit.error}
                          ></TextInput>
                        </View>
                        <View style={{ marginHorizontal: 40, marginTop: 40 }}>
                          <Button
                            mode="outlined"
                            onPress={() => setVisiBle(false)}
                          >
                            Back
                          </Button>
                          <Button
                            disabled={loading}
                            mode="contained"
                            onPress={update}
                          >
                            {loading ? "Loading" : "Update Student"}
                          </Button>
                        </View>
                      </View>
                      <ActivityIndicator
                        animating={loading}
                        color="#bc2b78"
                        size="large"
                        style={styles.activityIndicator}
                      />
                    </SafeAreaView>
                  </Modal>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "center",
    borderColor: 1,
    marginBottom: 10,
    backgroundColor: "#ffffff",

    height: 180,
    borderRadius: 10,
    width: "80%",
    // marginTop: 10,
    marginHorizontal: "10%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  row_title: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    paddingTop: 10,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    height: 230,
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998",
  },
  title: {
    left: "8%",
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
