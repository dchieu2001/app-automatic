import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import BackButton from "../../components/BackButton";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import Paragraph from "../../components/Paragraph";
import { theme } from "../../core/theme";
import { supabase } from "../../utils/supabase-service";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";
import { dropdownValidator } from "../../helpers/dropdownValidator";
import { examNameValidator } from "../../helpers/examNameValidator";
const CreateExam = ({ navigation }) => {
  const [name, setName] = useState({ value: "", error: "" });
  const [date, setDate] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });

  const [listDataClassesResponse, setListDataClassesResponse] = useState([]);

  const [ClassCode, setClassCode] = useState("");
  const [ClassCodeError, setClassCodeError] = useState("");
  const [SchoolYear, setSchoolYear] = useState("");
  const [schoolYearError, setSchoolYearError] = useState("");

  const [SemesterError, setSemesterError] = useState("");
  const [Semester, setSemester] = useState("");

  const [choiceQuestion, setChoiceQuestion] = useState({
    value: "",
    error: "",
  });
  const [scaleQuestion, setScaleQuestion] = useState({ value: "", error: "" });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const currentUser = supabase.auth.user();
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const themeContainerStyle = loading
    ? styles.background
    : theme.colors.background;

  const loadClassOfUser = async () => {
    let { data: classes, error } = await supabase
      .from("classes")
      .select("*")
      .eq("uid", currentUser.id)
      .eq("is_delete", false);
    setListDataClassesResponse(classes);
  };

  const menuSchoolYear = () => {
    const schoolYear = new Set(
      listDataClassesResponse.map((e) => e.school_year)
    );

    const schoolYearList = [...schoolYear];

    const schoolYearListRender = schoolYearList.map((e) => ({
      value: e,
      label: e,
    }));
    return schoolYearListRender;
  };

  const menuSemester = () => {
    const semesterList = listDataClassesResponse.filter(
      (c) => c.school_year === SchoolYear
    );
    const semesterLists = new Set(semesterList.map((e) => e.semester).sort());
    const semesterListData = [...semesterLists];
    const semesterListRender = semesterListData.map((c) => ({
      value: c,
      label: c,
    }));
    return semesterListRender;
  };

  const menuClassCode = () => {
    const classCodeList = listDataClassesResponse.filter(
      (c) => c.school_year === SchoolYear && c.semester === Semester
    );

    const classCodeListTmp = new Set(
      classCodeList.map((e) => e.class_code).sort()
    );

    const classCodeListRender = [...classCodeListTmp].map((c) => ({
      value: c,
      label: c,
    }));

    return classCodeListRender;
  };

  useEffect(() => {
    setLoading(false);
    loadClassOfUser();
  }, []);

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
    { value: 1, label: "1" },
    { value: 2, label: "0.5" },
  ];

  const Done = async () => {
    setLoading(true);
    console.log("click done");
    const nameError = examNameValidator(name.value);
    const schoolYearError = dropdownValidator(SchoolYear);
    const semesterError = dropdownValidator(Semester);
    const scaleError = dropdownValidator(scaleQuestion.value);
    const optionError = dropdownValidator(choiceQuestion.value);
    const classError = dropdownValidator(ClassCode);
    const dateError = dropdownValidator(date.value);
    if (
      nameError ||
      schoolYearError ||
      semesterError ||
      scaleError ||
      optionError ||
      classError ||
      dateError
    ) {
      setLoading(false);
      setName({ value: name.value, error: nameError });
      setChoiceQuestion({
        value: choiceQuestion.value,
        error: optionError + " question number.",
      });
      setDate({ value: date.value, error: dateError + " date of exam." });
      setScaleQuestion({
        value: scaleQuestion.value,
        error: scaleError + " scale.",
      });
      setClassCodeError(classError + " class code.");
      setSemesterError(semesterError + " semester.");
      setSchoolYearError(schoolYearError + " school year.");
      return;
    }
    setClassCodeError("");
    setSemesterError("");
    setSchoolYearError("");
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
    if (SchoolYear && Semester && ClassCode) {
      const Class = listDataClassesResponse.filter(
        (c) =>
          c.school_year === SchoolYear &&
          c.semester === Semester &&
          c.class_code === ClassCode
      );
      const idClass = Class[0].id;

      const { error } = await supabase.from("exams").insert([
        {
          name: name.value,
          option: question,
          scale: scal,
          date_exam: date.value,
          is_delete: false,
          description: description.value,
          class_id: idClass,
        },
      ]);

      if (error) {
        Alert.alert("Failed!", "Create exam " + name.value + " failed.", [
          {
            text: "Back",
            onPress: () => {
              setLoading(false);
            },
          },
        ]);
      } else {
        Alert.alert("Success!", "Create exam " + name.value + " successful!", [
          {
            text: "Back exam list",
            onPress: () => {
              setLoading(false);
              navigation.goBack();
            },
          },
          {
            text: "OK",
            onPress: () => {
              setLoading(false);
            },
          },
        ]);
      }
    }
  };

  const Cancel = () => {
    Alert.alert("Cancel?", "Are you sure you want to reset this text box!", [
      {
        text: "Yes",
        onPress: () => {
          setLoading(false);
          setChoiceQuestion({ value: "", error: "" });
          setScaleQuestion({ value: "", error: "" });
          setSchoolYear("");
          setSemester("");
          setName({ value: "", error: "" });
          setClassCode("");
          setDate({ value: "", error: "" });
          setDescription({ value: "", error: "" });
          setClassCodeError("");
          setSemesterError("");
          setSchoolYearError("");
          return;
        },
      },
      {
        text: "No",
      },
    ]);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <ScrollView>
        <Paragraph style={{ paddingTop: 40, paddingLeft: 20 }}>
          <BackButton goBack={navigation.goBack} />
        </Paragraph>
        <Text style={styles.title}>Create Exam</Text>
        <View style={styles.container}>
          {/* enter name exam */}
          <View style={styles.box}>
            <TextInput
              keyboardType="default"
              label="Name Exam *"
              returnKeyType="next"
              value={name.value}
              onChangeText={(text) => setName({ value: text, error: "" })}
              error={!!name.error}
              errorText={name.error}
            ></TextInput>
          </View>

          {/* choose school year and Semester */}
          <View style={styles.box}>
            <View
              style={{
                width: "63%",
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
                data={menuSchoolYear()}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select school year"
                searchPlaceholder="Search..."
                value={SchoolYear}
                onChange={(item) => {
                  setSchoolYear(item.value);
                }}
                renderItem={renderItem}
              />
              {schoolYearError ? (
                <Text style={styles.error}>{schoolYearError}</Text>
              ) : null}
            </View>

            <View
              style={{ width: "37%", flexDirection: "column", marginTop: 8 }}
            >
              <Dropdown
                ref={ref}
                statusBarIsTranslucent={true}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={menuSemester()}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Semeters"
                searchPlaceholder="Search..."
                value={Semester}
                onChange={(item) => {
                  setSemester(item.value);
                }}
                renderItem={renderItem}
              />
              {SemesterError ? (
                <Text style={styles.error}>{SemesterError}</Text>
              ) : null}
            </View>
          </View>

          {/*  choose class*/}
          <View style={styles.box}>
            <View style={{ width: "100%", marginTop: 10 }}>
              {/* {Semester ? ( */}
              <Dropdown
                ref={ref}
                statusBarIsTranslucent={true}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={menuClassCode()}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select class *"
                searchPlaceholder="Search..."
                value={ClassCode}
                onChange={(item) => {
                  setClassCode(item.value);
                }}
                renderItem={renderItem}
              />
              {/* ) : null} */}
              {ClassCodeError ? (
                <Text style={styles.error}>{ClassCodeError}</Text>
              ) : null}
            </View>
          </View>

          {/* select number question */}
          <View style={styles.box}>
            <View
              style={{
                width: "63%",
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
              style={{ width: "37%", flexDirection: "column", marginTop: 10 }}
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
            <View style={{ flexDirection: "column" }}>
              <TextInput
                label="Date *"
                returnKeyType="next"
                value={date.value}
                onChangeText={(date) => setDate({ value: date, error: "" })}
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
                  value={date.value}
                  onChange={(text) => setDate({ value: text, error: "" })}
                  onBlur={(text) => setDate({ value: text, error: "" })}
                  // Hour="24Hours"
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
            <Button mode="outlined" style={styles.btn_cancel} onPress={Cancel}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              mode="contained"
              style={styles.btn_done}
              onPress={Done}
            >
              {loading ? "Loading" : "Create Exam"}
            </Button>
          </View>
          <ActivityIndicator
            animating={loading}
            color="#bc2b78"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateExam;

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    left: "17%",
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 30,
    color: theme.colors.primary,
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
