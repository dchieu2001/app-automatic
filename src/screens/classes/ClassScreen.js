import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../utils/supabase-service";
import { theme } from "../../core/theme";
import { TextInput } from "react-native-paper";
import { themeColor } from "react-native-rapi-ui";

const ClassScreen = ({ navigation }) => {
  const [classList, setClassList] = useState([]);
  const currentUser = supabase.auth.user();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadClasses = async () => {
    let { data: classes, error } = await supabase
      .from("classes")
      .select("*")
      .eq("uid", currentUser.id)
      .eq("is_delete", false)
      // .order("class_code", { ascending: false })
      .order("school_year", { ascending: false });
    setClassList(classes);
  };

  useEffect(() => {
    setTimeout(async () => {
      classList ? setLoading(false) : setLoading(true);
      loadClasses();
    }, 1000);
  }, [currentUser, loadClasses]);

  const filterClasses = () => {
    if (classList) {
      return classList.filter((e) =>
        e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    }
    return "";
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ minHeight: "80%" }}>
        {/* search */}
        <View style={styles.search}>
          <TextInput
            style={styles.input_search}
            selectionColor={theme.colors.primary}
            underlineColor="transparent"
            mode="outlined"
            keyboardType="default"
            placeholder="Search class by name ..."
            returnKeyType="next"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
            }}
          ></TextInput>
          <TouchableOpacity style={styles.icon_search}>
            <Image
              source={require("../../assets/search.png")}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
              }}
            />
          </TouchableOpacity>
        </View>

        {filterClasses().length > 0 ? (
          <FlatList
            data={filterClasses()}
            nestedScrollEnabled
            scrollEnabled
            // scrollToOverflowEnabled
            style={{ maxHeight: "90%" }}
            keyExtractor={(item) => item.id.toFixed()}
            showsVerticalScrollIndicator
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ClassDetail", {
                        id: item.id,
                      })
                    }
                  >
                    <View style={styles.row}>
                      {/* column image */}
                      <View style={{ flexDirection: "column" }}>
                        <View style={{ flexDirection: "row" }}>
                          <Image
                            source={require("../../assets/img_class.png")}
                            resizeMode="contain"
                            style={{
                              width: 70,
                              height: 70,
                            }}
                          />
                        </View>
                        <StatusBar style="auto" />
                      </View>
                      {/* column text */}
                      <View
                        style={{
                          flexDirection: "column",
                          paddingLeft: 20,
                          width: "99%",
                        }}
                      >
                        {/* row name class */}
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          <View
                            style={{ flexDirection: "column", display: "flex" }}
                          >
                            <Text style={styles.row_title}>{item.name}</Text>
                          </View>
                        </View>
                        {/* row class code */}
                        <View
                          style={{ flexDirection: "row", marginVertical: 3 }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "500",
                              }}
                            >
                              {item.class_code}
                            </Text>
                          </View>
                        </View>

                        {/* row semester and school year */}
                        <View style={{ flexDirection: "row" }}>
                          <View
                            style={{ flexDirection: "column", width: "40%" }}
                          >
                            <Text>Semester: {item.semester} </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "column",
                            }}
                          >
                            <Text>{item.school_year}</Text>
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
            }}
          >
            <Text style={{ color: theme.colors.label, fontWeight: "900" }}>
              Not found class yet.
            </Text>
          </View>
        )}
      </View>
      <ActivityIndicator
        animating={loading}
        color="#bc2b78"
        size="large"
        style={styles.activityIndicator}
      />

      {/* button create class */}
      <TouchableOpacity
        style={styles.btn_new}
        onPress={() => navigation.navigate("CreateClass")}
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

export default ClassScreen;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    background: "#F7F7F7",
  },
  search: {
    flexDirection: "row",
    // marginRight: 45,
    marginLeft: 3,
    marginVertical: 4,
  },
  input_search: {
    maxHeight: 60,
    flexDirection: "column",
    borderColor: 100,
    borderRadius: 40,
    minWidth: "90%",
    // marginHorizontal: 20,
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: theme.colors.surface,
  },
  icon_search: {
    flexDirection: "column",
    justifyContent: "center",
    top: 5,
    left: "-110%",

    positions: "absolute",
  },
  row_title: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    paddingRight: 90,
    color: theme.colors.text,
    fontWeight: "bold",
    letterSpacing: 1,
    paddingTop: 5,
    textTransform: "uppercase",
    // colors: "#000000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    borderColor: 1,
    marginBottom: 10,
    backgroundColor: theme.colors.background,
    borderColor: "#753E33",
    borderBottomWidth: 0.8,
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    height: "auto",
    borderRadius: 10,
    width: "100%",
    marginTop: 5,
    alignContent: "center",
    paddingVertical: 5,
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

  btn_refesh: {
    backgroundColor: theme.colors.backdrop,
    borderRadius: 100,
    display: "flex",
    width: 30,
    height: 30,
    bottom: 70,
    right: 30,
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.41,
    shadowRadius: 7.11,
    elevation: 16,
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
