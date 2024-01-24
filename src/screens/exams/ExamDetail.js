import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { theme } from "../../core/theme";
import { dropdownValidator } from "../../helpers/dropdownValidator";
import { examNameValidator } from "../../helpers/examNameValidator";
import { supabase } from "../../utils/supabase-service";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";

const ExamDetail = ({ route, navigation }) => {
  const examId = route.params.id;
  const [exam, setExam] = useState([]);
  const [disable, setDisable] = useState(true);
  const currentUser = supabase.auth.user();
  const ref = useRef(null);
  const [name, setName] = useState({ value: "", error: "" });
  const [date, setDate] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });

  const [choiceQuestion, setChoiceQuestion] = useState({
    value: "",
    error: "",
  });
  const [scaleQuestion, setScaleQuestion] = useState({ value: "", error: "" });
  const [modalVisible, setVisiBle] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const themeContainerStyle = loading
    ? styles.background
    : theme.colors.background;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (datee) => {
    var datestring =
      datee.getFullYear() +
      "-" +
      (datee.getMonth() + 1) +
      "-" +
      datee.getDate();
    setDate({ value: datestring, error: "" });
    hideDatePicker();
  };
  const options = [
    { value: 1, label: "10" },
    { value: 2, label: "20" },
  ];

  const scale = [
    { value: 1, label: "0.4" },
    { value: 2, label: "0.2" },
  ];

  const Done = async () => {
    setLoading(true);
    console.log("click done");
    const nameError = examNameValidator(name.value);
    const scaleError = dropdownValidator(scaleQuestion.value);
    const optionError = dropdownValidator(choiceQuestion.value);
    const dateError = dropdownValidator(date.value);
    if (nameError || scaleError || optionError || dateError) {
      setLoading(false);
      setName({ value: name.value, error: nameError });
      setScaleQuestion({ value: scaleQuestion.value, error: scaleError });
      setChoiceQuestion({ value: choiceQuestion.value, error: optionError });
      setDate({ value: date.value, error: dateError });
      return;
    }
    let question = "";
    options.map((e) => {
      if (e.value === choiceQuestion.value) {
        question = e.label;
      }
    });
    let scal = "";
    scale.map((e) => {
      if (e.value === scaleQuestion.value) {
        scal = e.label;
      }
    });

    const { error } = await supabase
      .from("exams")
      .update([
        {
          name: name.value,
          option: question,
          scale: scal,
          date_exam: date.value,
          description: description.value,
        },
      ])
      .eq("id", examId);
    if (error) {
      Alert.alert("Failed!", "Updated exam " + name.value + "failed!", [
        {
          text: "Back",
          onPress: () => {
            setLoading(false);
          },
        },
      ]);
    } else {
      Alert.alert("Success!", "Updated exam " + name.value + " successful!", [
        {
          text: "OK",
          onPress: () => {
            setLoading(false);
            navigation.goBack();
          },
        },
      ]);
    }
  };

  const loadExamDetails = async () => {
    let { data: exams, error } = await supabase
      .from("exams")
      .select(
        `*,
            class_id,
            classes (
            id, name, class_code
          )
        `
      )
      .eq("id", examId)
      .eq("is_delete", false)
      .eq("classes.uid", currentUser.id);

    setExam(exams);
  };

  const isAnswerStudent = async () => {
    let { data: answer_students, error } = await supabase
      .from("answer_students")
      .select("*")
      .eq("exam_id", examId);
    answer_students[0] ? setDisable(false) : setDisable(true);
  };

  useEffect(() => {
    loadExamDetails();
    isAnswerStudent();
  }, [navigation]);

  const Edit = () => {
    setVisiBle(true);
    console.log("click edit");
    setName({ value: exam[0].name, error: "" });
    // setChoiceQuestion
    setDate({ value: exam[0].date_exam, error: "" });
    setDescription({ value: exam[0].description, error: "" });
    let question = 0;
    options.map((e) => {
      if (e.label == exam[0].option) {
        question = e.value;
      }
    });
    let scal = 0;
    scale.map((e) => {
      if (e.label == exam[0].scale) {
        scal = e.value;
      }
    });
    setScaleQuestion({ value: scal, error: "" });
    setChoiceQuestion({ value: question, error: "" });
  };
  const Delete = () => {
    Alert.alert(
      "Are you sure delete?",
      "Deleting this exam will also delete all associated. This cannot be undone!",
      [
        {
          text: "Yes",
          onPress: async () => {
            const { error } = await supabase
              .from("exams")
              .update({ is_delete: true })
              .eq("id", examId);
            if (error) {
              Alert.alert("Failed", "Delete " + exam[0].name + " failed", [
                {
                  text: "Back",
                },
              ]);
            } else {
              Alert.alert(
                "Success!",
                "Deleted exam " + exam[0].name + " success.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]
              );
            }
          },
        },
        {
          text: "No",
        },
      ]
    );
  };
  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* header title */}
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
            Exam Detail
          </Text>
        </View>
      </View>
      {/* end header title */}

      <View style={styles.controller}>
        <FlatList
          keyExtractor={(item) => item.id.toFixed()}
          data={exam}
          renderItem={({ item }) => {
            return (
              <View>
                <View style={styles.content}>
                  <Text style={styles.name_exam}>
                    {item.classes.name} ({item.classes.class_code})
                  </Text>
                  <Text style={styles.name_exam}>{item.name}</Text>
                </View>
                <View style={styles.date}>
                  <Text>{item.date_exam}</Text>
                </View>
                <View style={styles.note}>
                  <Text style={{ fontWeight: "normal" }}>
                    {item.description}
                  </Text>
                </View>
                <View style={styles.note}>
                  <Text style={{ flexDirection: "column" }}>
                    question: {item.option}
                  </Text>

                  <Text style={{ flexDirection: "column", marginLeft: "40%" }}>
                    Scale: {item.scale}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        {/* manage */}
        <View style={styles.manage}>
          <Text style={{ fontSize: 12, color: theme.colors.label }}>
            Manage
          </Text>
        </View>
        {exam !== null ? (
          <>
            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                navigation.navigate("AnswerKey", {
                  id: examId,
                  name: exam[0].name,
                  options: exam[0].option,
                  scale: exam[0].scale,
                  class_id: exam[0].class_id,
                  // scale: exam[0].scale,
                })
              }
            >
              <View style={{ flexDirection: "column" }}>
                <Image
                  source={require("../../assets/Jackdaw.png")}
                  resizeMode="contain"
                  style={{
                    width: 28,
                    height: 28,                   
                    borderRadius: 7,
                    // tintColor : theme.colors.label,
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
                <Text>Enter answer of exams</Text>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Image
                  source={require("../../assets/Arrow.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    paddingLeft: "90%",
                    // tintColor : theme.colors.label,
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              // onPress={() =>
              //   navigation.navigate("AnswerStudent", {
              //     id: examId,
              //     scale: exam[0].scale,
              //     class_id: exam[0].class_id,
              //     name: exam[0].name,
              //     options: exam[0].option,
              //   })
              // }
              onPress={() =>
                navigation.navigate("ListStudentByClass", {
                  classId: exam[0].class_id,
                  examId: examId,
                  examScale: exam[0].scale,
                  examName: exam[0].name,
                  examOptions: exam[0].option,
                })
              }
            >
              <View style={{ flexDirection: "column" }}>
                <Image
                  source={require("../../assets/Instagram.png")}
                  resizeMode="contain"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: theme.colors.primary,
                    
                    borderRadius: 7,
                    // tintColor: theme.colors.label,
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
                <Text>Enter answer of students</Text>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Image
                  source={require("../../assets/Arrow.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    paddingLeft: "87%",
                    // tintColor: theme.colors.label,
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disable}
              style={styles.btn}
              onPress={() =>
                navigation.navigate("Result", { id: exam[0].class_id, examId: examId,  })
              }
            >
              <View style={{ flexDirection: "column" }}>
                {!disable ? (
                  <Image
                    source={require("../../assets/Textbook.png")}
                    resizeMode="contain"
                    style={{
                      width: 28,
                      height: 28,
                      
                      borderRadius: 7,
                      backgroundColor: theme.colors.primary,
                      // backgroundColor : theme.colors.label,
                    }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/Textbook.png")}
                    resizeMode="contain"
                    style={{
                      width: 28,
                      height: 28,
                      
                      borderRadius: 7,
                      //  backgroundColor : theme.colors.primary,
                      // backgroundColor: theme.colors.label,
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  flexDirection: "column",
                  paddingLeft: 20,
                  paddingTop: 3,
                }}
              >
                <Text>Results</Text>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Image
                  source={require("../../assets/Arrow.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    paddingLeft: "115%",
                    
                    // tintColor: theme.colors.label,
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disable}
              style={styles.btn}
              onPress={() => navigation.navigate("AnalystExam")}
            >
              <View style={{ flexDirection: "column" }}>
                {!disable ? (
                  <Image
                    source={require("../../assets/Group.png")}
                    resizeMode="contain"
                    style={{
                      width: 28,
                      height: 28,
                      
                      borderRadius: 7,
                      // backgroundColor: theme.colors.primary,
                    }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/Group.png")}
                    resizeMode="contain"
                    style={{
                      width: 28,
                      height: 28,
                      
                      borderRadius: 7,
                      // backgroundColor: theme.colors.label,
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  flexDirection: "column",
                  paddingLeft: 20,
                  paddingTop: 3,
                }}
              >
                <Text>Exam analysis</Text>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Image
                  source={require("../../assets/Arrow.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    paddingLeft: "105%",
                    
                    // tintColor: theme.colors.label,
                  }}
                />
              </View>
            </TouchableOpacity>
          </>
        ) : null}
        {/* button edit */}
        <View>
          <Button
            mode="outlined"
            style={styles.btn_edit}
            onPress={Edit}
            color={theme.colors.text}
          >
            Edit exam
          </Button>
        </View>
        {/* button delete */}
        <View>
          <Button
            mode="outlined"
            style={styles.btn_delete}
            onPress={Delete}
            color={theme.colors.error}
          >
            Delete exam
          </Button>
        </View>
      </View>

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
            <View style={{ justifyContent: "center" }}>
              <ScrollView style={{}}>
                <Text style={styles.title}>Update Exam</Text>
                <View style={styles.container}>
                  {/* enter name exam */}
                  <View style={styles.box}>
                    <TextInput
                      keyboardType="default"
                      label="Name Exam *"
                      returnKeyType="next"
                      value={name.value}
                      onChangeText={(text) =>
                        setName({ value: text, error: "" })
                      }
                      error={!!name.error}
                      errorText={name.error}
                    ></TextInput>
                  </View>

                  {/* select number question */}
                  <View style={styles.box}>
                    <View
                      style={{
                        width: "58%",
                        flexDirection: "column",
                        marginTop: 10,
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
                        data={options}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Choice questions *"
                        searchPlaceholder="Search..."
                        value={choiceQuestion.value}
                        onChange={(item) => {
                          setChoiceQuestion({ value: item.value, error: "" });
                        }}
                        renderItem={renderItem}
                      />
                      {choiceQuestion.error ? (
                        <Text style={styles.error}>{choiceQuestion.error}</Text>
                      ) : null}
                    </View>
                    {/* selecr scale */}
                    <View
                      style={{
                        width: "42%",
                        flexDirection: "column",
                        marginTop: 10,
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
                        data={scale}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Scale *"
                        searchPlaceholder="Search..."
                        value={scaleQuestion.value}
                        onChange={(item) => {
                          setScaleQuestion({ value: item.value, error: "" });
                        }}
                        renderItem={renderItem}
                      />
                      {scaleQuestion.error ? (
                        <Text style={styles.error}>{scaleQuestion.error}</Text>
                      ) : null}
                    </View>
                  </View>

                  {/* select date */}
                  <View
                    style={{
                      maxWidth: "70%",
                      marginLeft: "10%",
                      flexDirection: "row",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    {/* <Text>{date}</Text> */}
                    <View style={{ flexDirection: "column" }}>
                      <TextInput
                        label="Date *"
                        returnKeyType="next"
                        value={date.value}
                        onChangeText={(date) =>
                          setDate({ value: date, error: "" })
                        }
                        error={!!date.error}
                        errorText={date.error}
                        keyboardType="default"
                      ></TextInput>
                    </View>

                    <View style={{ flexDirection: "column" }}>
                      <TouchableOpacity onPress={showDatePicker}>
                        <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          // mode="datetime"
                          mode="date"
                          value={date}
                          onChange={(date) =>
                            setDate({ value: date, error: "" })
                          }
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                        />
                        <View
                          style={{
                            paddingTop: 28,
                            paddingLeft: 3,
                          }}
                        >
                          <Image
                            source={require("../../assets/schedule.png")}
                            resizeMode="contain"
                            style={{
                              width: 30,
                              height: 30,
                            }}
                          />
                        </View>
                      </TouchableOpacity>
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
                      keyboardType="default"
                    ></TextInput>
                  </View>
                  {/* button handle */}
                  <View style={{ marginHorizontal: 40 }}>
                    <Button
                      mode="outlined"
                      style={styles.btn_cancel}
                      onPress={() => setVisiBle(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={loading}
                      mode="contained"
                      style={styles.btn_done}
                      onPress={Done}
                    >
                      {loading ? "Loading" : "Update Exam"}
                    </Button>
                  </View>
                </View>
              </ScrollView>
            </View>
            <ActivityIndicator
              animating={loading}
              color="#bc2b78"
              size="large"
              style={styles.activityIndicator}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ExamDetail;

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
    paddingBottom: 6,
  },
  name_exam: {
    color: theme.colors.text,
    // lexDirection: "row",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  date: {
    backgroundColor: theme.colors.background,
    color: theme.colors.label,
    fontWeight: "normal",
    letterSpacing: 3,
    fontSize: 12,
    paddingLeft: 30,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
  },
  note: {
    backgroundColor: theme.colors.background,
    paddingLeft: 30,
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
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
    
  },
  btn_edit: {
    
    fontWeight: "normal",
  },
  title: {
    marginTop: "10%",
    top: "2%",
    left: "17%",
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 30,
    color: theme.colors.primary,
    marginBottom: 50,
  },
  box: {
    maxWidth: "80%",
    marginLeft: "10%",
    marginRight: "10%",
    flexDirection: "row",
  },

  btn_cancel: {
    marginTop: 20,
  },
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
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 2,
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
