import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ExamScreen, ProfileScreen, ClassScreen } from "../screens";

import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { theme } from "../core/theme";

const Tab = createBottomTabNavigator();

const TabBottom = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        showLabel: true,
        style: {
          position: "absolute",
          bottom: 25,
          left: "40%",
          right: 20,
          elevation: 0,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 90,
          ...styles.shadow,
        },
      }}
    >
      {/* style={{
          justifyContent: "center",
          alignItems: "center",
          color: theme.colors.primary,
        }} */}
      <Tab.Screen
        name="Exam"
        component={ExamScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarIcon: ({ focused }) => (
            <View style={styles.view}>
              <Image
                source={require("../assets/ico_exam.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#e32f45" : "#748c94",
                }}
              />
              {/* <Text>Exam</Text> */}
            </View>
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Class"
        component={ClassScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarIcon: ({ focused }) => (
            <View style={styles.view}>
              <Image
                source={require("../assets/ico_class.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#e32f45" : "#748c94",
                }}
              />
              {/* <Text>Class</Text> */}
            </View>
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          justifyContent: "center",
          alignItems: "center",
          tabBarIcon: ({ focused }) => (
            <View style={styles.view}>
              <Image
                source={require("../assets/person.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#e32f45" : "#748c94",
                }}
              />
              {/* <Text>Profile</Text> */}
            </View>
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabBottom;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  view: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    top: 10,
  },
});
