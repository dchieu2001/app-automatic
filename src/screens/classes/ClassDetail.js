import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Button from "../../components/Button";
import { theme } from "../../core/theme";
import TextInput from "../../components/TextInput";
import { supabase } from "../../utils/supabase-service";
import { Dropdown } from "react-native-element-dropdown";
import { classCodeValidator } from "../../helpers/classCodeValidator";
import { classNameValidator } from "../../helpers/classNameValidator";

const ClassDetail = ({ route, navigation }) => {
  const ref = useRef(null);
  const classId = route.params.id;
  const [classe, setClasses] = useState([]);
  const currentUser = supabase.auth.user();
  const [numberStudent, setNumberStudent] = useState(0);
  const [numberExam, setNumberExam] = useState(0);
  const [modalVisible, setVisiBle] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState({ value: "", error: "" });
  const [classCode, setClassCode] = useState({ value: "", error: "" });
  const [semetes, setSemetes] = useState();
  const [schoolYear, setSchoolYear] = useState();
  const [description, setDescription] = useState({ value: "", error: "" });
  const [classCur, setClassCur] = useState({
    classCode: "",
    year: "",
    semeter: "",
  });

  const themeContainerStyle = loading
    ? styles.background
    : theme.colors.background;

  // number exams of a class
  const updateNumberExamOfClass = async () => {
    try {
      let { data: exams, error } = await supabase
        .from("exams")
        .select()
        .eq("is_delete", false)
        .eq("class_id", classId);
  
      if (exams && Array.isArray(exams)) {
        setNumberExam(exams.length);
      } else {
        console.error("Invalid data returned:", exams);
        setNumberExam(0); // Đặt giá trị mặc định là 0 nếu có lỗi hoặc dữ liệu không hợp lệ
      }
    } catch (error) {
      console.error("Error updating number of exams:", error);
      setNumberExam(0); // Xử lý lỗi và đặt giá trị mặc định là 0
    }
  };
  // number students of a class
  const updateNumberStudentOfClass = async () => {
    try {
      let { data: students, error } = await supabase
        .from("students")
        .select()
        .eq("is_delete", false)
        .eq("class_id", classId);
  
      if (students && Array.isArray(students)) {
        setNumberStudent(students.length);
      } else {
        console.error("Invalid data returned:", students);
        setNumberStudent(0); // Đặt giá trị mặc định là 0 nếu có lỗi hoặc dữ liệu không hợp lệ
      }
    } catch (error) {
      console.error("Error updating number of students:", error);
      setNumberStudent(0); // Xử lý lỗi và đặt giá trị mặc định là 0
    }
  };
  

  const loadClassDetail = async () => {
    let { data: classes, error } = await supabase
      .from("classes")
      .select("*")
      .eq("uid", currentUser.id)
      .eq("is_delete", false)
      .eq("id", classId);

    setClasses(classes);
  };
  const Edit = () => {
    setVisiBle(true);
    let sy = 0;
    let sm = 0;
    setName({ value: classe[0].name, error: "" });
    setClassCode({ value: classe[0].class_code, error: "" });
    school_year.map((e) => {
      if (e.label == classe[0].school_year) {
        sy = e.value;
      }
    });
    semeters.map((e) => {
      if (e.label.includes(classe[0].semester)) {
        sm = e.value;
      }
    });
    setSemetes(sm);
    setSchoolYear(sy);
    setClassCur({
      classCode: classe[0].class_code,
      year: sy,
      semeter: sm,
    });
    setDescription({ value: classe[0].description, error: "" });
  };
  const Done = async () => {
    const date = new Date();
    console.log("updated day: " + date);
    setLoading(true);
    var check = true;
    const checkClassCode = classCodeValidator(classCode.value);
    const checkClassName = classNameValidator(name.value);
    if (checkClassCode || checkClassName) {
      setLoading(false);
      setClassCode({ value: classCode.value, error: checkClassCode });
      setName({ value: name.value, error: checkClassName });
      return;
    }
    let { data: classes, err } = await supabase
      .from("classes")
      .select("*")
      .eq("uid", currentUser.id);

    for (let i = 0; i < classes.length; i++) {
      // check class code current
      if (
        classCur.classCode === classCode.value &&
        classCur.year === schoolYear &&
        classCur.semeter === semetes
      ) {
        break;
      }
      // check class code is already exists
      if (
        classes[i].class_code === classCode.value &&
        classes[i].school_year === school_year[schoolYear - 1].label &&
        classes[i].semester === semeters[semetes - 1].label
      ) {
        check = false;
        Alert.alert(
          "Update class failed!",
          "Class code " + classe[0].class_code + " already exists. ",
          [
            {
              text: "Back",
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
        break;
      }
    }
    if (check) {
      const { error } = await supabase
        .from("classes")
        .update([
          {
            name: name.value,
            class_code: classCode.value,
            school_year: school_year[schoolYear - 1].label,
            semester: semeters[semetes - 1].label,
            description: description.value,
            update_at: date,
            uid: currentUser.id,
          },
        ])
        .eq("id", classe[0].id);
      if (error !== null) {
        Alert.alert(
          "Failed!",
          "Update class " + classe[0].class_code + " failed.",
          [
            {
              text: "Back",
              onPress: () => {
                setLoading(false);
              },
            },
          ]
        );
        return;
      } else {
        Alert.alert(
          "Success!",
          "Update class " + classe[0].class_code + " successful!",
          [
            {
              text: "Back list class",
              onPress: () => {
                setVisiBle(true);
                setLoading(false);
                setTimeout(async () => {
                  loadClassDetail();
                }, 1000);
                navigation.goBack();
              },
            },
            {
              text: "OK",
              onPress: () => {
                setLoading(false);
                loadClassDetail();
              },
            },
          ]
        );
      }
    }
  };

  const school_year = [
    { value: 1, label: "2019-2020" },
    { value: 2, label: "2020-2021" },
    { value: 3, label: "2021-2022" },
    { value: 4, label: "2022-2023" },
  ];

  const semeters = [
    { value: 1, label: "I" },
    { value: 2, label: "II" },
    { value: 3, label: "Vacation" },
  ];

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  useEffect(() => {
    loadClassDetail();
    updateNumberExamOfClass();
    updateNumberStudentOfClass();
  }, [
    navigation,
    loadClassDetail,
    updateNumberExamOfClass,
    updateNumberStudentOfClass,
  ]);

  const listExamOfClass = () => {
    // navigation.
    navigation.navigate("ListExamByClass", {
      id: classId,
    });
  };
  const Delete = () => {
    setLoading(true);
    Alert.alert(
      "Are you sure?",
      "Deleting this class will also delete all associated exams and students! ",
      [
        {
          text: "Yes",
          onPress: async () => {
            const { error } = await supabase
              .from("classes")
              .update([{ is_delete: true }])
              .eq("id", classId);
            if (error) {
              Alert.alert(
                "Error!",
                "Deleted class " + classe[0].name + " failed?",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setLoading(false);
                    },
                  },
                ]
              ); //
            } else {
              Alert.alert(
                "Success!",
                "Delete Class " + classe[0].name + " successfull.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setLoading(false);
                      navigation.goBack();
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
    // <></>
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          paddingLeft: 20,
          paddingTop: 30,
          minWidth: "100%",
          backgroundColor: theme.colors.background,
        }}
      >
        <TouchableOpacity
          onPress={navigation.goBack}
          style={{
            flexDirection: "column",
            alignContent: "center",
            minWidth: "30%",
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
            Class Detail
          </Text>
        </View>
      </View>
      <View style={styles.controller}>
        <FlatList
          keyExtractor={(item) => item.id.toFixed()}
          data={classe}
          renderItem={({ item }) => {
            return (
              <View>
                <View style={styles.content}>
                  <Text style={styles.name_class}>{item.name}</Text>
                  <Text style={{}}> {item.class_code}</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: theme.colors.background,
                    marginTop: 5,
                  }}
                >
                  <View style={styles.note}>
                    <Text style={{ flexDirection: "column" }}>
                      Semestes: {item.semester}
                    </Text>
                  </View>
                  <View style={styles.note}>
                    <Text style={{ fontWeight: "normal" }}>
                      {item.school_year}
                    </Text>
                  </View>
                </View>
                <View style={styles.note}>
                  <Text style={{ fontWeight: "normal" }}>
                    {item.description}
                  </Text>
                </View>

                {/* number student of a class */}
                <View style={styles.note}>
                  <Text>{numberStudent} student(s)</Text>
                </View>
                {/* number exam of a class */}
                <View style={styles.note}>
                  <Text>{numberExam} exam(s)</Text>
                </View>

                <View style={styles.manage}>
                  <Text style={{ fontSize: 12, color: theme.colors.label }}>
                    Manage
                  </Text>
                </View>
                <TouchableOpacity style={styles.btn} onPress={listExamOfClass}>
                  <View style={{ flexDirection: "column" }}>
                    <Image
                      source={require("../../assets/scan.png")}
                      resizeMode="contain"
                      style={{
                        width: 28,
                        height: 28,
                        backgroundColor: theme.colors.primary,
                        tintColor: theme.colors.white,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      paddingLeft: 20,
                      paddingTop: 3,
                    }}
                  >
                    <Text>Exams</Text>
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Image
                      source={require("../../assets/Arrow.png")}
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                        paddingLeft: "112%",
                        tintColor: theme.colors.label,
                      }}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() =>
                    navigation.navigate("StudentScreen", {
                      id: classId,
                    })
                  }
                >
                  <View style={{ flexDirection: "column" }}>
                    <Image
                      source={require("../../assets/person.png")}
                      resizeMode="contain"
                      style={{
                        width: 28,
                        height: 28,
                        backgroundColor: theme.colors.primary,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      paddingLeft: 20,
                      paddingTop: 3,
                    }}
                  >
                    <Text>Students</Text>
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Image
                      source={require("../../assets/Arrow.png")}
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                        paddingLeft: "109%",
                        tintColor: theme.colors.label,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        {/* modal edit class */}
        <Modal
          animationType="slide"
          visible={modalVisible}
          style={[styles.modal, styles.modal2]}
          position={"center"}
          entry={"top"}
          onRequestClose={() => setVisiBle(false)}
        >
          <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <View style={{ flex: 1 }}>
              <ScrollView>
                <Text style={styles.title}>Update Class</Text>
                <View style={styles.container}>
                  {/* input name class code */}
                  <View style={styles.box}>
                    <TextInput
                      keyboardType="default"
                      label="Class Code"
                      returnKeyType="next"
                      value={classCode.value}
                      onChangeText={(text) =>
                        setClassCode({ value: text, error: "" })
                      }
                      error={!!classCode.error}
                      errorText={classCode.error}
                    ></TextInput>
                  </View>
                  {/* input name class  */}
                  <View style={styles.box}>
                    <TextInput
                      keyboardType="default"
                      label="Name Class"
                      returnKeyType="next"
                      value={name.value}
                      onChangeText={(text) =>
                        setName({ value: text, error: "" })
                      }
                      error={!!name.error}
                      errorText={name.error}
                    ></TextInput>
                  </View>
                  <View>
                    <View style={styles.box}>
                      <View
                        style={{
                          width: "63%",
                          flexDirection: "column",
                          marginTop: 8,
                        }}
                      >
                        <Dropdown
                          // disable={true}
                          ref={ref}
                          statusBarIsTranslucent={true}
                          style={styles.dropdown}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={school_year}
                          search
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Select school year..."
                          searchPlaceholder="Search..."
                          value={schoolYear}
                          onChange={(item) => {
                            setSchoolYear(item.value);
                          }}
                          renderItem={renderItem}
                        />
                      </View>

                      <View
                        style={{
                          width: "37%",
                          flexDirection: "column",
                          marginTop: 8,
                        }}
                      >
                        <Dropdown
                          ref={ref}
                          statusBarIsTranslucent={true}
                          style={styles.dropdown}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={semeters}
                          search
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Semeters"
                          searchPlaceholder="Search..."
                          value={semetes}
                          onChange={(item) => {
                            setSemetes(item.value);
                          }}
                          renderItem={renderItem}
                        />
                      </View>
                    </View>
                  </View>

                  {/* input description */}
                  <View style={styles.box}>
                    <TextInput
                      label="Description"
                      returnKeyType="done"
                      value={description.value}
                      onChangeText={(text) =>
                        setDescription({ value: text, error: "" })
                      }
                      //   error={!!description.error}
                      //   errorText={description.error}
                      keyboardType="default"
                    ></TextInput>
                  </View>
                </View>

                {/* button handle */}
                <View style={{ marginHorizontal: 40 }}>
                  <Button
                    mode="outlined"
                    style={styles.btn_cancel}
                    onPress={() => setVisiBle(false)}
                  >
                    Back
                  </Button>
                  <Button
                    disabled={loading}
                    mode="contained"
                    style={styles.btn_done}
                    onPress={Done}
                  >
                    {loading ? "Loading" : "Update Class"}
                  </Button>
                  <ActivityIndicator
                    animating={loading}
                    color="#bc2b78"
                    size="large"
                    style={styles.activityIndicator}
                  />
                </View>
                {/* </Background> */}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </View>

      <View>
        <Button
          mode="outlined"
          style={styles.btn_edit}
          onPress={Edit}
          color={theme.colors.text}
        >
          Edit class
        </Button>
      </View>
      <View>
        <Button
          disabled={loading}
          mode="outlined"
          style={styles.btn_delete}
          onPress={Delete}
          color={theme.colors.error}
        >
          {loading ? "Loading" : "Delete class"}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ClassDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexDirection: "column",
    marginTop: 20,
    paddingLeft: 30,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: theme.colors.background,
  },
  name_class: {
    color: theme.colors.primary,
    flexDirection: "row",
    textTransform: "uppercase",
    fontWeight: "normal",
    letterSpacing: 1,
    paddingRight: 10,
    paddingBottom: 6,
    fontSize: 20,
  },
  name_exam: {
    color: theme.colors.text,
    // lexDirection: "row",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  note: {
    backgroundColor: theme.colors.background,
    paddingLeft: 30,
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    height: "auto",
  },
  manage: {
    paddingLeft: 30,
    marginTop: 20,
  },
  btn: {
    paddingLeft: 30,
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: theme.colors.background,
    flexDirection: "row",
  },
  btn_delete: {
    fontWeight: "normal",
    elevation: 0,
  },
  btn_edit: {
    elevation: 0,
    fontWeight: "normal",
  },
  title: {
    marginTop: 40,
    top: "2%",
    left: "21%",
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 30,
    color: theme.colors.primary,
  },
  box: {
    maxWidth: "80%",
    marginTop: 10,
    marginLeft: "10%",
    marginRight: "10%",
    flexDirection: "row",
  },
  box_child: {
    maxWidth: "44%",
    flexDirection: "column",
  },
  btn_cancel: {
    marginTop: 40,
  },
  btn_done: {},
  dropdown: {
    // margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
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
