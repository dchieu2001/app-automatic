import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
// import Button from "../components/Button";
import { theme } from "../core/theme";
import { CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/supabase-service";
import TextInput from "../components/TextInput";

function createArrayWithNumbers(length) {
  return Array.from({ length }, (_, i) => i);
}

const AnswerStudent = ({ route, navigation }) => {
  const examId = route.params.id;
  const examName = route.params.name;
  const examOptions = route.params.options;
  const scale = route.params.scale;
  const classId = route.params.class_id;
  const currentUser = supabase.auth.user();
  // const [studentId, setStudentId] = useState({ value: "", error: "" });
  const [disabled, setDisabled] = useState(false);
  const [answerKey, setAnswerKey] = useState([]);
  let arr = new Map();
  const [imageFromGellary, setImageFromGellary] = useState(null);
  const [imageFromCamera, setImageFromCamera] = useState(null);
  const [answered1, setAnswered1] = useState([]);
  const answered = [];

  const loadAnswerd = async () => {
    answered.push(
      { index: 1, answer: "A" },
      { index: 2, answer: "B" },
      { index: 3, answer: "C" },
      { index: 4, answer: "D" },
      { index: 5, answer: "A" },
      { index: 6, answer: "A" },
      { index: 7, answer: "B" },
      { index: 8, answer: "C" },
      { index: 9, answer: "D" },
      { index: 10, answer: "A" },
      { index: 11, answer: "A" },
      { index: 12, answer: "B" },
      { index: 13, answer: "C" },
      { index: 14, answer: "D" },
      { index: 15, answer: "A" },
      { index: 16, answer: "A" },
      { index: 17, answer: "B" },
      { index: 18, answer: "C" },
      { index: 19, answer: "D" },
      { index: 20, answer: "A" }
    );
    setAnswered1(answered);
  };
  // remember url after change domain
  // const URLpath =
  //   "https://84de-2401-d800-9d51-f301-7185-811a-1244-bb2a.ap.ngrok.io/file/upload-answer-student/";
  // const URLpath =
  //   "http://127.0.0.1:8000/file/upload-answer-key/";
  const serverIp = '192.168.1.246'; // Thay YOUR_SERVER_IP bằng địa chỉ IPv4 của máy tính của bạn
  const serverUrl = `http://${serverIp}:8000/file/upload-answer-student/`;
  const getAnswerKeyAndScale = async () => {
    let { data: answer_exams, error } = await supabase
      .from("answer_exams")
      .select(`answers, exams(id, is_delete)`)
      .eq("exam_id", examId)
      .eq("exams.is_delete", false);
    setAnswerKey(answer_exams[0].answers);
  };

  useEffect(() => {
    getAnswerKeyAndScale();
    setTimeout(async () => {
      loadAnswerd();
    }, 1000);
  }, [imageFromCamera, imageFromGellary]);
  // select image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      // Access the selected assets from the assets array
      const selectedAssets = result.assets;
  
      // Assuming you want the URI of the first selected asset
      const firstAssetUri = selectedAssets.length > 0 ? selectedAssets[0].uri : null;
  
      setImageFromGellary(firstAssetUri);
    }
  };

  // take image from camera
  const takeFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFromCamera(result.uri);
    }
  };

  const Save = async () => {
    console.log("click save");
    let check = false;
    let ans = [];
    let count = 0;
    var urlImage = "";
    arr.forEach(function (value, key) {
      ans.push({ key, value });
    });

    if (imageFromCamera !== null) {
      check = true;
      setDisabled(true);
      urlImage = imageFromCamera;
    }
    if (imageFromGellary !== null) {
      check = true;
      setDisabled(true);
      urlImage = imageFromGellary;
    }

    let match = /\.(\w+)$/.exec(urlImage);
    let type = match ? `image/${match[1]}` : `image`;
    if (check) {
      const formData = new FormData();
      formData.append("file", {
        uri: urlImage,
        name: urlImage.split("/").pop(),
        type: type,
      });
      try {
        const response = await axios.post(serverUrl, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Dữ liệu từ API:', response.data);
      } catch (error) {
        console.error('Lỗi trong yêu cầu axios:', error);
      }
    }

    answered.map((e) => {
      console.log(e.index + " , " + e.answer);
    });

    // check answer is correct!
    arr.forEach(function (value, key) {
      ans.push({ key, value });
      if (value === answerKey[key]) {
        count++;
      }
    });

    let { data: students, error } = await supabase
      .from("students")
      .select("id, student_code")
      .eq("class_id", classId);
    // students.filter(e=> {
    //   if()
    // })
    console.log(students);
    // check student_code
    if (students[0]) {
      const { error1 } = await supabase
        .from("answer_students")
        .update([
          {
            exam_id: examId,
            answers: ans.sort(),
            point: (count * scale).toFixed(1),
          },
        ])
        .eq("student_id", students[0].id);

      if (error1) {
        Alert.alert("Failed!", "Update answer of student failed!", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
        Alert.alert("Success!", "Update answer of student successful!", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      }
    } else {
      const { error1 } = await supabase.from("answer_students").insert([
        {
          exam_id: examId,
          student_id: students[0].id,
          answers: ans.sort(),
          point: (count * scale).toFixed(1),
        },
      ]);

      if (error1) {
        Alert.alert("Failed!", "Upload answer of student failed!", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
        Alert.alert("Success!", "Upload answer of student successful!", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      }
    }
  };

  const RenderItem = (props) => {
    const [A, setA] = useState(props.answer === "A" ? true : false);
    const [B, setB] = useState(props.answer === "B" ? true : false);
    const [C, setC] = useState(props.answer === "C" ? true : false);
    const [D, setD] = useState(props.answer === "D" ? true : false);
    const checkedA = () => {
      setA(true);
      setB(false);
      setC(false);
      setD(false);
      arr.set(props.index, "A");
    };
    const checkedB = () => {
      setA(false);
      setB(true);
      setC(false);
      setD(false);
      arr.set(props.index, "B");
    };

    const checkedC = () => {
      setA(false);
      setB(false);
      setC(true);
      setD(false);
      arr.set(props.index, "C");
    };
    const checkedD = () => {
      setA(false);
      setB(false);
      setC(false);
      setD(true);
      arr.set(props.index, "D");
    };
    return (
      <View style={{ flexDirection: "row" }}>
        <CheckBox
          title="A"
          center
          checked={A}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={checkedA}
        />
        <CheckBox
          title="B"
          center
          checked={B}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={checkedB}
        />
        <CheckBox
          title="C"
          center
          checked={C}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={checkedC}
        />
        <CheckBox
          title="D"
          center
          checked={D}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={checkedD}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* header */}

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
            minWidth: "20%",
          }}
        >
          <Image
            source={require("../assets/arrow_back.png")}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            minWidth: "60%",
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
            {examName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            minWidth: "10%",
          }}
        >
          <TouchableOpacity onPress={Save}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Select from gallery */}
      <TouchableOpacity
        // disabled={disabled}
        onPress={pickImage}
        style={{
          marginTop: 20,
          flexDirection: "row",
          backgroundColor: theme.colors.background,
          minWidth: "100%",
          minHeight: 50,
          // justifyContent: "center",
          paddingLeft: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Image
            source={require("../assets/Photo.png")}
            resizeMode="contain"
            style={{
              width: 28,
              height: 28,
              tintColor: "#ffffff",
              backgroundColor: theme.colors.yelow,
              tintColor: theme.colors.label,
            }}
          />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text>Select from gallery</Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            display: "flex",
            top: 0,
            right: 80,
            position: "absolute",
          }}
        >
          {imageFromGellary && (
            <Image
              source={{ uri: imageFromGellary }}
              style={{ width: 50, height: 50 }}
            />
          )}
        </View>
        <View
          style={{
            display: "flex",
            right: 30,
            top: 15,
            position: "absolute",
          }}
        >
          <Image
            source={require("../assets/Arrow.png")}
            resizeMode="contain"
            style={{
              width: 14,
              height: 14,
              tintColor: "#ffffff",
              tintColor: theme.colors.label,
            }}
          />
        </View>
      </TouchableOpacity>

      {/* Take from camera */}
      <TouchableOpacity
        // disabled={disabled}
        onPress={takeFromCamera}
        style={{
          marginTop: 5,
          flexDirection: "row",
          backgroundColor: theme.colors.background,
          minWidth: "100%",
          minHeight: 50,
          // justifyContent: "center",
          paddingLeft: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Image
            source={require("../assets/Instagram.png")}
            resizeMode="contain"
            style={{
              width: 28,
              height: 28,
              tintColor: "#ffffff",
              backgroundColor: theme.colors.primary,
              tintColor: theme.colors.label,
            }}
          />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text>Take from camera</Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            display: "flex",
            top: 0,
            right: 80,
            position: "absolute",
          }}
        >
          {imageFromCamera && (
            <Image
              source={{ uri: imageFromCamera }}
              style={{ width: 50, height: 50 }}
            />
          )}
        </View>
        <View
          style={{
            display: "flex",
            right: 30,
            top: 15,
            position: "absolute",
          }}
        >
          <Image
            source={require("../assets/Arrow.png")}
            resizeMode="contain"
            style={{
              width: 14,
              height: 14,
              tintColor: "#ffffff",
              tintColor: theme.colors.label,
            }}
          />
        </View>
      </TouchableOpacity>

      <ScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          {/* <View style={{ marginHorizontal: 50, marginBottom: 20 }}>
            <TextInput
              label="Student Code"
              returnKeyType="done"
              value={studentId.value}
              onChangeText={(text) => setStudentId({ value: text, error: "" })}
              error={!!studentId.error}
              errorText={studentId.error}
              autoCapitalize="none"
              autoCompleteType="off"
              style={{ padding: 0, height: 30 }}
            />
          </View> */}
          <View style={styles.box}>
            {/* {createArrayWithNumbers(examOptions).map((index) => {
              return (
                <View style={{ flexDirection: "row" }} key={index + 1}>
                  <View
                    style={{
                      flexDirection: "column",
                      alignContent: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      width: "7%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {index + 1}.
                    </Text>
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <RenderItem index={index + 1} />
                  </View>
                </View>
              );
            })} */}

            {/* answer when instructor input manual */}
            {!disabled &&
              createArrayWithNumbers(examOptions).map((index) => {
                return (
                  <View style={{ flexDirection: "row" }} key={index + 1}>
                    <View
                      style={{
                        flexDirection: "column",
                        alignContent: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        width: "7%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                        }}
                      >
                        {index + 1}.
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      <RenderItem index={index + 1} />
                    </View>
                  </View>
                );
              })}

            {/* answer when instructor input from file */}
            {disabled &&
              answered1.map((e) => {
                return (
                  <View style={{ flexDirection: "row" }} key={e.index}>
                    <View
                      style={{
                        flexDirection: "column",
                        alignContent: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        width: "7%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                        }}
                      >
                        {e.index}.
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      <RenderItem index={e.index} answer={e.answer} />
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnswerStudent;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  box: {
    // marginLeft: "10%",
    paddingLeft: 5,
    width: "100%",
    // marginRight: "10%",
    flexDirection: "column",
  },
});
