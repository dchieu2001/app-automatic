import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { DataTable } from "react-native-paper";
import Button from "../components/Button";
import { theme } from "../core/theme";
import { supabase } from "../utils/supabase-service";

const Result = ({ route, navigation }) => {
  const class_id = route.params.id;
  const [results, setResults] = useState([]);

  const loadResults = async () => {
    const { data: result, error } = await supabase
      .from("answer_students")
      .select("*, students(full_name, student_code)")
      .eq("students.is_delete", false)
      .eq("students.class_id", class_id);
    setResults(result);
  };

  useEffect(() => {
    loadResults();
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
            minWidth: "30%",
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
            Results
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

      <View style={styles.container}>
        <View style={{ justifyContent: "center", paddingTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column", width: "10%" }}>
              <Text style={{ fontWeight: "800" }}>#</Text>
            </View>
            <View style={{ flexDirection: "column", width: "30%" }}>
              <Text style={{ fontWeight: "800" }}>Student Code</Text>
            </View>
            <View style={{ flexDirection: "column", width: "50%" }}>
              <Text style={{ fontWeight: "800" }}>Name</Text>
            </View>
            <View style={{ flexDirection: "column", width: "10%" }}>
              <Text style={{ fontWeight: "800" }}>Point</Text>
            </View>
          </View>
        </View>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toFixed()}
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator
          renderItem={({ item, index }) => {
            return (
              <>
                <View
                  style={{
                    justifyContent: "center",
                    borderBottomColor: theme.colors.label,
                    borderBottomWidth: 0.5,
                    paddingVertical: 10,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "column", width: "10%" }}>
                      <Text>{index + 1}</Text>
                    </View>
                    <View style={{ flexDirection: "column", width: "30%" }}>
                      <Text>{item.students.student_code}</Text>
                    </View>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                      <Text>{item.students.full_name}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        // width: "10%",
                        // paddingLeft: "5%",
                      }}
                    >
                      <Text>{item.point}</Text>
                    </View>
                  </View>
                </View>
              </>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default Result;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    marginTop: 20,
  },
});
