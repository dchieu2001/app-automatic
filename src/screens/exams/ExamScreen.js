import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import { theme } from "../../core/theme";
import { supabase } from "../../utils/supabase-service";

const ExamScreen = ({ navigation }) => {
  const [exam, setExam] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = supabase.auth.user();
  const loadExams = async () => {
    let { data: exams, error } = await supabase
      .from("exams")
      .select(
        `*,
    classes (id, name, uid)`
      )
      .eq("is_delete", false)
      .eq("classes.is_delete", false)
      .eq("classes.uid", currentUser.id)
      .order("date_exam", { ascending: false });

    exams ? setExam(exams.filter((e) => e.classes !== null)) : setExam(null);
  };

  useEffect(() => {
    setLoading(false);
    loadExams();
  }, [navigation, loadExams]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ minHeight: "90%" }}>
        {exam ? (
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
              flex: 1,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: theme.colors.label, fontWeight: "900" }}>
              Not found exam(s) yet.
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.btn_new}
        onPress={() => navigation.navigate("CreateExam")}
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
    // <></>
  );
};

export default ExamScreen;

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
    maxWidth: "100%",
    flexWrap: "wrap",
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
