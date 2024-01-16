import { axiosInstance } from "../service/axios";
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
import AnswerLine from '../components/AnswerLine/AnswerLine';
import { idGenerator } from "../service/idGenerator";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";

function createArrayWithNumbers(length) {
  return Array.from({ length }, (_, i) => i);
}

const AnswerStudent = ({ route, navigation }) => {
  const examId = route.params.id;
  const examName = route.params.name;
  const examOptions = route.params.options;
  const scale = route.params.scale;
  const classId = route.params.class_id;
  const studentId = route.params.studentId;
  const currentUser = supabase.auth.user();
  // const [studentId, setStudentId] = useState({ value: "", error: "" });
  const [disabled, setDisabled] = useState(false);
  const [answerKey, setAnswerKey] = useState([]);
  let arr = new Map();
  const [imageFromGellary, setImageFromGellary] = useState(null);
  const [imageFromCamera, setImageFromCamera] = useState(null);
  const [isScaningImage, setIsScaningImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const serverIp = '192.168.1.10'; // Thay YOUR_SERVER_IP bằng địa chỉ IPv4 của máy tính của bạn
  const serverUrl = `/file/upload-answer-student/`;

  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    defaultValues: {
      answer: []
    }
  });
  const onSubmit = data => Save(data);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "answer", // unique name for your Field Array
  });

  const watchAnswer = useWatch({
    control,
    name: "answer",
  })





  const getAnswerKeyOfStudent = async () => {
    setIsLoading(true);
    let { data: answers, error } = await supabase
      .from("answer_students")
      .select(`answers`)
      .eq("student_id", studentId)
    console.log('answer', answers);
    
    if (Array.isArray(answers) && answers?.[0]) {
      reset({
        answer: answers[0].answers
      })
      setIsLoading(false);
    }
    // setAnswerKey(answer_exams[0].answers);
  };

  useEffect(() => {
    getAnswerKeyOfStudent();
  }, []);
  // select image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      // // Access the selected assets from the assets array
      // const selectedAssets = result.assets;
  
      // // Assuming you want the URI of the first selected asset
      // const firstAssetUri = selectedAssets.length > 0 ? selectedAssets[0].uri : null;
  
      // setImageFromGellary(firstAssetUri);
      const selectedImage = result.assets[0];
      setImageFromCamera(null);
      setImageFromGellary(selectedImage.uri);
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

  const Save = async (data) => {
    console.log("click save");
    let check = false;
    let ans = [];
    let count = 0;
    var urlImage = "";
    arr.forEach(function (value, key) {
      ans.push({ key, value });
    });

    if (!data) {
      return;
    }


    // check answer is correct!
    // arr.forEach(function (value, key) {
    //   ans.push({ key, value });
    //   if (value === answerKey[key]) {
    //     count++;
    //   }
    // });

    let { data: students, error } = await supabase
      .from("answer_students")
      .select("*")
      .eq("exam_id", examId)
      .eq("student_id", studentId);
    console.log('studentas', students);
    // students.filter(e=> {
    //   if()
    // })
    // console.log(students);
    // check student_code
    if (students[0]) {
      const { error1 } = await supabase
        .from("answer_students")
        .update([
          {
            exam_id: examId,
            answers: data.answer.sort(),
            point: (count * scale).toFixed(1),
          },
        ])
        .eq("student_id", studentId);

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
          student_id: studentId,
          answers: data.answer.sort(),
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

  const scanImage = async (imageData) => {
    if (imageData === null) {
      return;
    }
    setIsScaningImage(true);
    let urlImage = imageData;
    let match = /\.(\w+)$/.exec(urlImage);
    let type = match ? `image/${match[1]}` : `image`;
    if (urlImage && type) {
      const formData = new FormData();
      formData.append("file", {
        uri: urlImage,
        name: urlImage.split("/").pop(),
        type: type,
      });
      try {
        const response = await axiosInstance.post(serverUrl, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Dữ liệu từ API:', response.data);
        reset({
          answer: response.data
        });
      } catch (error) {
        console.error('Lỗi trong yêu cầu axios:', error);
      } finally {
        setIsScaningImage(false);
      }
    }
  }

  useEffect(() => {
    if (imageFromGellary) {
      setImageFromCamera(null);
      scanImage(imageFromGellary);
    }
  }, [imageFromGellary]);

  useEffect(() => {
    if (imageFromCamera) {
      setImageFromGellary(null);
      scanImage(imageFromCamera);
    }
  }, [imageFromCamera]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* header */}

      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          paddingLeft: 20,
          paddingTop: 100,
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
          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={!watchAnswer || watchAnswer?.length < 1}>
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
          {Array.isArray(fields) && fields.length > 0 && fields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`answer.${index}`}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <AnswerLine
                  answer={value}
                  key={idGenerator()}
                  onChange={onChange}
                />
              )}
            />
            ))}
          {isScaningImage && <Text>Scaning...</Text>}
          {isLoading && <Text>Loading...</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnswerStudent;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 50,
    width: "100%",
  }
});
