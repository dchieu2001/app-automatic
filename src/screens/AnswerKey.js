import { axiosInstance } from "../service/axios";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
// import Button from "../components/Button";
import { theme } from "../core/theme";
import { CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/supabase-service";
import AnswerLine from '../components/AnswerLine/AnswerLine';
import { idGenerator } from "../service/idGenerator";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";

function createArrayWithNumbers(length) {
  return Array.from({ length }, (_, i) => i);
}

const AnswerKey = ({ route, navigation }) => {
  // let colection = ["A", "B", "C", "D "];

  let arr = new Map();
  const examId = route.params.id;
  const examName = route.params.name;
  const examOptions = route.params.options;
  const currentUser = supabase.auth.user();
  const [imageFromGellary, setImageFromGellary] = useState(null);
  const [imageFromCamera, setImageFromCamera] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [isScaningImage, setIsScaningImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const URLpath =
  //   "http://127.0.0.1:8000/file/upload-answer-key/";
    const serverIp = '192.168.1.216'; // Thay YOUR_SERVER_IP bằng địa chỉ IPv4 của máy tính của bạn
    const serverUrl = `http://${serverIp}:8000/file/upload-answer-key/`;
  const [answered1, setAnswered1] = useState([]);
  const answered = [];
  let ans = [];

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


  // const loadAnswerd = async () => {
  //   answered.push(
  //     { index: 1, answer: "A" },
  //     { index: 2, answer: "B" },
  //     { index: 3, answer: "C" },
  //     { index: 4, answer: "D" },
  //     { index: 5, answer: "A" },
  //     { index: 6, answer: "A" },
  //     { index: 7, answer: "B" },
  //     { index: 8, answer: "C" },
  //     { index: 9, answer: "D" },
  //     { index: 10, answer: "A" },
  //     { index: 11, answer: "A" },
  //     { index: 12, answer: "B" },
  //     { index: 13, answer: "C" },
  //     { index: 14, answer: "D" },
  //     { index: 15, answer: "A" },
  //     { index: 16, answer: "A" },
  //     { index: 17, answer: "B" },
  //     { index: 18, answer: "C" },
  //     { index: 19, answer: "D" },
  //     { index: 20, answer: "A" }
  //   );
  //   setAnswered1(answered);
  // };

  const getAnswered = async () => {
    setIsLoading(true);
    const { data: answers } = await supabase
      .from("answer_exams")
      .select("answers")
      .eq("exam_id", examId);
      console.log('answers[0].answer', answers[0].answers);
    if (answers) {
      reset({
        answer: answers[0].answers
      })
      setIsLoading(false);
    }
    // answers.forEach(function (value, key) {
    //   ans.push({ key, value });
    // });
    // ans.map((e) => {
    //   console.log(e.value);
    // });
  };

  useEffect(() => {
    // loadAnswerd();
    getAnswered();
  }, []);
  // select image from gallery
  const pickImage = async () => {
    // try {
    // const granted = await PermissionsAndroid.request(
    // PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    //   {
    //     title: "InstaGrade App Gellary Permission",
    //     message:
    //       "InstaGrade App needs access to your gellary " +
    //       "so you can take awesome pictures.",
    //     buttonNeutral: "Ask Me Later",
    //     buttonNegative: "Cancel",
    //     buttonPositive: "OK",
    //   }
    // );

    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setImageFromCamera(null);
        setImageFromGellary(selectedImage.uri);
      }
    // }
    // } catch (err) {
    //   console.warn(err);
    // }
  };

  // take image from camera
  const takeFromCamera = async () => {
    // try {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.CAMERA,
    //     {
    //       title: "InstaGrade App Camera Permission",
    //       message:
    //         "InstaGrade App needs access to your camera " +
    //         "so you can take awesome pictures.",
    //       buttonNeutral: "Ask Me Later",
    //       buttonNegative: "Cancel",
    //       buttonPositive: "OK",
    //     }
    //   );
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFromGellary(null);
      setImageFromCamera(result.newProperty);
    }

    // } catch (err) {
    //   console.warn(err);
    // }
  };
 
  const Save = async (data) => {
    console.log("click save");

    let check = false;
    let urlImage = "";
    arr.forEach(function (value, key) {
      ans.push({ key, value });
    });

    // if (imageFromCamera !== null) {
    //   check = true;
    //   setDisabled(true);
    //   urlImage = imageFromCamera;
    // }
    // if (imageFromGellary !== null) {
    //   check = true;
    //   setDisabled(true);
    //   urlImage = imageFromGellary;
    // }
    // let match = /\.(\w+)$/.exec(urlImage);
    // let type = match ? `image/${match[1]}` : `image`;
    // if (check) {
    //   const formData = new FormData();
    //   formData.append("file", {
    //     uri: urlImage,
    //     name: urlImage.split("/").pop(),
    //     type: type,
    //   });
    //   try {
    //     const response = await axiosInstance.post(serverUrl, formData, {
    //       headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     });
    //     console.log('Dữ liệu từ API:', response.data);
    //     setAnswerData(response.data)
    //   } catch (error) {
    //     console.error('Lỗi trong yêu cầu axios:', error);
    //   }
    // }



    
    // answered.map((e) => {
    //   console.log(e.index + " , " + e.answer);
    // });

    if (!data) {
      return;
    }

    let { data: answer_exams, err } = await supabase
      .from("answer_exams")
      .select("*")
      .eq("exam_id", examId);
    console.log(answer_exams[0]);
    if (answer_exams[0]) {
      const { error1 } = await supabase
        .from("answer_exams")
        .update([
          {
            answers: data.answer.sort(),
          },
        ])
        .eq("exam_id", examId);
      if (!error1) {
        Alert.alert("Success!", "Update answer of exam successful!", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      }
    } else {
      const { error1 } = await supabase.from("answer_exams").insert([
        {
          exam_id: examId,
          answers: data.answer.sort(),
        },
      ]);
      if (!error1) {
        Alert.alert("Success!", "Add answer of exam successful!", [
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
          timeout: 10000,
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
          {/* {!disabled &&
            createArrayWithNumbers(examOptions).map((index) => {
              return (
                <View style={{ flexDirection: "row" }} key={index + 1}>
                  <View
                    style={{
                      flexDirection: "column",
                      alignContent: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      width: "9%",
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
                  <View style={{ flexDirection: "column", marginLeft: -10 }}>
                    <AnswerLine index={index + 1} />
                  </View>
                </View>
              );
            })} */}
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

export default AnswerKey;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 50,
    width: "100%",
  }
});
