import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import { supabase } from "../../utils/supabase-service";
import { theme } from "../../core/theme";

const ListStudentByClass = ({ route, navigation }) => {
  const { classId, examId, examScale, examName, examOptions } = route.params;
  const currentUser = supabase.auth.user();
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const loadStudent = async () => {
    let { data: student, error } = await supabase
      .from("students")
      .select(
        `*, classes (
        id,uid
      )`
      )
      .eq("class_id", classId)
      .eq("classes.uid", currentUser.id)
      .eq("is_delete", false)
      .eq("classes.is_delete", false)
      .order("full_name", { ascending: true });

    console.log('student2', student);

    if (student.length === 0) {
      setStudents(null);
    } else {
      setStudents(student);
    }
  };

  useEffect(() => {
    loadStudent();
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
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
            minWidth: "35%",
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
            Student
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {students === null ? (
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              width: "100%",
              height: "100%",
              paddingLeft: "10%",
            }}
          >
            <Text style={{ fontSize: 24 }}>No student for this class yet!</Text>
          </View>
        ) : (
          <FlatList
            keyExtractor={(item) => item.id.toFixed()}
            data={students}
            nestedScrollEnabled
            scrollEnabled
            showsVerticalScrollIndicator
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AnswerStudent", {
                      id: examId,
                      scale: examScale,
                      class_id: classId,
                      name: examName,
                      options: examOptions,
                      studentId: item.id
                    })
                  }
                >
                  <View>
                    <View style={styles.row}>
                      <View style={{ flexDirection: "column" }}>
                        <View style={{ flexDirection: "row" }}>
                          <Image
                            source={require("../../assets/person.png")}
                            resizeMode="contain"
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                        </View>
                        <StatusBar style="auto" />
                      </View>
                      <View style={{ flexDirection: "row", paddingLeft: 20 }}>
                        <View style={{ flexDirection: "column", width: "85%" }}>
                          <Text style={styles.row_title}>{item.full_name}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                            width: "5%",
                            display: "flex",
                            top: "30%",
                            right: 10,
                            position: "absolute",
                          }}
                        >
                          <Image
                            source={require("../../assets/Arrow.png")}
                            resizeMode="contain"
                            style={{
                              width: 16,
                              height: 16,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      {/* button add new student */}
      {/* <TouchableOpacity
        style={styles.btn_new}
        onPress={() => navigation.navigate("CreateStudent", { id: classId })}
      >
        <Image
          source={require("../../assets/Vector.png")}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            display: "flex",
            right: -14,
            bottom: 1,
          }}
        />
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default ListStudentByClass;

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     background: "#F7F7F7",
//   },
//   row_title: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     fontSize: 24,
//     paddingTop: 10,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignContent: "center",
//     borderColor: "#753E33",
//     borderBottomWidth: 0.8,
//     marginBottom: 10,
//     backgroundColor: "#ffffff",
//     shadowColor: "#7F5DF0",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.5,
//     height: "auto",
//     borderRadius: 10,
//     width: "100%",
//     marginTop: 3,
//   },
//   btn_new: {
//     backgroundColor: theme.colors.primary,
//     borderRadius: 100,
//     display: "flex",
//     width: 50,
//     height: 50,
//     bottom: 10,
//     right: 20,
//     justifyContent: "center",
//     alignContent: "center",
//     position: "absolute",

//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 7,
//     },
//     shadowOpacity: 0.41,
//     shadowRadius: 9.11,

//     elevation: 14,
//   },
// });
const styles = StyleSheet.create({
  studentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#753E33",
    borderBottomWidth: 0.8,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    borderRadius: 10,
    width: "100%",
    marginTop: 3,
    padding: 10,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  detailsContainer: {
    flexDirection: "row",
    width: "75%",
    marginLeft: 10,
    alignItems: "center",
  },
  fullName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Thay đổi màu sắc nếu cần
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
});
