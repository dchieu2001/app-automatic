import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import BackButton from "../../components/BackButton";
import TextInput from "../../components/TextInput";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import { theme } from "../../core/theme";
import { Dropdown } from "react-native-element-dropdown";
import { supabase } from "../../utils/supabase-service";
import { classCodeValidator } from "../../helpers/classCodeValidator";
import { classNameValidator } from "../../helpers/classNameValidator";
import { dropdownValidator } from "../../helpers/dropdownValidator";

const CreateClass = ({ navigation }) => {
  const ref = useRef(null);
  const [name, setName] = useState({ value: "", error: "" });
  const [classCode, setClassCode] = useState({ value: "", error: "" });
  const [semetes, setSemetes] = useState({ value: "", error: "" });
  const [schoolYear, setSchoolYear] = useState({ value: "", error: "" });

  const [description, setDescription] = useState({ value: "", error: "" });

  const [loading, setLoading] = useState(false);
  const currentUser = supabase.auth.user();

  const themeContainerStyle = loading
    ? styles.background
    : theme.colors.background;

  const Done = async () => {
    var check = true;
    setLoading(true);
    const classCodeError = classCodeValidator(classCode.value);
    const classNameError = classNameValidator(name.value);
    const schoolYearError = dropdownValidator(schoolYear.value);
    const semetesError = dropdownValidator(semetes.value);

    if (classCodeError || classNameError || schoolYearError || semetesError) {
      setLoading(false);
      setName({ value: name.value, error: classNameError });
      setClassCode({ value: classCode.value, error: classCodeError });
      setSchoolYear({
        value: schoolYear.value,
        error: schoolYearError + " school year.",
      });
      setSemetes({ value: semetes.value, error: semetesError + " semester." });
      return;
    }
    setSchoolYear({ value: schoolYear.value, error: "" });
    setSemetes({ value: semetes.value, error: "" });
    if (classCode.value === name.value) {
      setLoading(false);
      setName({
        value: name.value,
        error: "Class code and class name can't be the same.",
      });
      return;
    }
    let { data: classes, err } = await supabase
      .from("classes")
      .select("*")
      .eq("uid", currentUser.id);
    const schoolyear = school_year[schoolYear.value - 1].label;
    const semeter = semeters[semetes.value - 1].label;
    for (let i = 0; i < classes.length; i++) {
      if (
        classes[i].class_code === classCode.value &&
        classes[i].school_year === schoolyear
      ) {
        check = false;
        setLoading(false);
        Alert.alert("Create Class failed!", "Class code already exists. ", [
          {
            text: "Back",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
        break;
      } else if (
        classes[i].name === name.value &&
        classes[i].school_year === schoolyear &&
        classes[i].semester === semeter
      ) {
        setLoading(false);
        check = false;
        Alert.alert("Create Class failed!", "Class name already exists. ", [
          {
            text: "Back",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
        break;
      }
    }
    console.log("click done");
    if (check) {
      console.log(semeters[semetes.value - 1].label);
      console.log(school_year[schoolYear.value - 1].label);
      const { error } = await supabase.from("classes").insert([
        {
          name: name.value,
          class_code: classCode.value,
          school_year: school_year[schoolYear.value - 1].label,
          semester: semeters[semetes.value - 1].label,
          description: description.value,
          uid: currentUser.id,
        },
      ]);

      if (error !== null) {
        setLoading(false);
        Alert.alert("Failed!", "Create Class failed.", [
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
        Alert.alert("Success", "Create Class successful!", [
          {
            text: "Back classes list.",
            onPress: () => {
              navigation.pop();
            },
          },
          {
            text: "OK",
          },
        ]);
        return;
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

  const Cancel = () => {
    Alert.alert(
      "Are you sure cancel",
      "Are you sure you want to reset this text box?",
      [
        {
          text: "Yes",
          onPress: () => {
            setLoading(false);
            setName({ value: "", error: "" });
            setClassCode({ value: "", error: "" });
            setSchoolYear({ value: "", error: "" });
            setSemetes({ value: "", error: "" });
            setDescription({ value: "", error: "" });
            return;
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
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <Paragraph style={{ paddingTop: 30, paddingLeft: 20 }}>
        <BackButton goBack={navigation.goBack} />
        {/* <Header>Class</Header> */}
      </Paragraph>
      <ScrollView>
        <Text style={styles.title}>Create Class</Text>
        <View style={styles.container}>
          {/* input name class code */}
          <View style={styles.box}>
            <TextInput
              keyboardType="default"
              label="Class Code *"
              returnKeyType="next"
              value={classCode.value}
              onChangeText={(text) => setClassCode({ value: text, error: "" })}
              error={!!classCode.error}
              errorText={classCode.error}
            ></TextInput>
          </View>
          {/* input name class  */}
          <View style={styles.box}>
            <TextInput
              keyboardType="default"
              label="Name Class *"
              returnKeyType="next"
              value={name.value}
              onChangeText={(text) => setName({ value: text, error: "" })}
              error={!!name.error}
              errorText={name.error}
            ></TextInput>
          </View>
          <View>
            <View style={styles.box}>
              <View
                style={{
                  width: "60%",
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
                  placeholder="Select school year*"
                  searchPlaceholder="Search..."
                  value={schoolYear.value}
                  onChange={(item) => {
                    setSchoolYear({ value: item.value, error: "" });
                  }}
                  renderItem={renderItem}
                />
                {schoolYear.error ? (
                  <Text style={styles.error}>{schoolYear.error}</Text>
                ) : null}
              </View>

              <View
                style={{ width: "40%", flexDirection: "column", marginTop: 8 }}
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
                  placeholder="Semeters*"
                  searchPlaceholder="Search..."
                  value={semetes.value}
                  onChange={(item) => {
                    setSemetes({ value: item.value, error: "" });
                  }}
                  renderItem={renderItem}
                />
                {semetes.error ? (
                  <Text style={styles.error}>{semetes.error}</Text>
                ) : null}
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
        <ActivityIndicator
          animating={loading}
          color="#bc2b78"
          size="large"
          style={styles.activityIndicator}
        />

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
            {loading ? "Loading" : "Create Class"}
          </Button>
        </View>
        {/* </Background> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
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
  btn_done: {
    marginBottom: 50,
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
