import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import { theme } from "../../core/theme";
import { supabase } from "../../utils/supabase-service";
import { useFocusEffect } from '@react-navigation/native';

let colection = {
  id: "",
  name: "",
  date_exam: "",
  class_id: "",
  description: "",
};
const ListExamByClass = ({ route, navigation }) => {
  const classId = route.params.id;
  const [exam, setExam] = useState(colection);
  const [loading, setLoading] = useState(false);
  const currentUser = supabase.auth.user();

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const loadExams = async () => {
        let { data: exams, error } = await supabase
          .from("exams")
          .select(
            `*,
          classes (
            id, name,uid
          )
        `
          )
          .eq("class_id", classId)
          .eq("is_delete", false)
          .eq("classes.uid", `${currentUser.id}`)
          .eq("classes.is_delete", false)
          .order("date_exam", { ascending: false });
    
        if (exams.length === 0) {
          setExam(null);
        } else {
          setExam(exams.filter((e) => e.classes !== null));
        }
      };
  
      loadExams();
  
      return () => {
        isActive = false;
      };
    }, [currentUser])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          paddingLeft: 20,
          paddingTop: 30,
          minWidth: "10%",
          backgroundColor: theme.colors.background,
        }}
      >
        <TouchableOpacity
          onPress={navigation.goBack}
          style={{
            flexDirection: "column",
            alignContent: "center",
            minWidth: "39%",
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
            Exam(s)
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            minWidth: "10%",
          }}
        ></View>
      </View>

      <View style={{ minHeight: "90%" }}>
        {exam !== null ? (
          <FlatList
            keyExtractor={(item) => item.id.toFixed()}
            data={exam}
            nestedScrollEnabled
            scrollEnabled
            showsVerticalScrollIndicator
            renderItem={({ item, index }) => {
              return (
                <View>
                  <View style={styles.box_title}>
                    <Text style={styles.date}>{item.date_exam}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ExamDetail", {
                        id: item.id,
                      })
                    }
                  >
                    <View style={styles.container}>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          backgroundColor: theme.colors.background,
                        }}
                      >
                        <View style={styles.box}>
                          <View>
                            <Image
                              source={require("../../assets/ico_exam.png")}
                              resizeMode="contain"
                              style={{
                                width: 75,
                                height: 75,
                              }}
                            />
                          </View>
                        </View>
                        <View style={styles.box}>
                          <View style={{ flexDirection: "column" }}>
                            <View style={{ flexDirection: "row" }}>
                              <Text style={styles.name_class}>
                                {item.classes.name}
                              </Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                              <Text style={styles.name_exam}>{item.name}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                              <Text style={styles.note}>
                                {item.description}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        ) : (
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              height: "90%",
              paddingLeft: "15%",
            }}
          >
            {/* image for 404 */}
            <Text style={{ fontSize: 24 }}>No exams for this class yet!</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.btn_new}
        onPress={() =>
          navigation.navigate("CreateExamByClass", { id: classId })
        }
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
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ListExamByClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "#753E33",
    borderBottomWidth: 0.8,
  },
  box: {
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    // borderColor: "#753E33",
    // borderBottomWidth: 0.8,
  },
  box_title: {
    marginTop: 5,
    marginLeft: 10,
    flexDirection: "row",
  },
  name_class: {
    color: theme.colors.primary,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingRight: 100,
  },
  name_exam: {
    color: theme.colors.text,
    fontWeight: "bold",
    letterSpacing: 1,
    paddingTop: 5,
    textTransform: "uppercase",
  },
  note: {
    color: theme.colors.label,
    fontWeight: "normal",
    letterSpacing: 2,
    paddingTop: 5,
    fontSize: 12,
  },
  date: {
    color: theme.colors.label,
    fontWeight: "normal",
    letterSpacing: 3,
  },
  btn_new: {
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    display: "flex",
    width: 50,
    height: 50,
    bottom: 10,
    right: 20,
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14,
  },
});
