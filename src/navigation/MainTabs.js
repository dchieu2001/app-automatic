import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  ExamScreen,
  ClassScreen,
  CreateClass,
  ProfileScreen,
  CreateExam,
  CreateStudent,
  ClassDetail,
  ExamDetail,
  StudentScreen,
  AnswerStudent,
  AnswerKey,
  Result,
  AnalystExam,
  ListExamByClass,
  StudentDetail,
  CreateExamByClass,
} from "../screens";
import TabBottom from "../components/TabBottom";

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TabBottom" component={TabBottom} />

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="CreateExamByClass" component={CreateExamByClass} />

      <Stack.Screen name="AnalystExam" component={AnalystExam} />
      <Stack.Screen name="AnswerKey" component={AnswerKey} />
      <Stack.Screen name="AnswerStudent" component={AnswerStudent} />
      <Stack.Screen name="CreateStudent" component={CreateStudent} />
      <Stack.Screen name="StudentScreen" component={StudentScreen} />
      <Stack.Screen name="ExamDetail" component={ExamDetail} />
      <Stack.Screen name="ClassDetail" component={ClassDetail} />
      <Stack.Screen name="ClassScreen" component={ClassScreen} />
      <Stack.Screen name="CreateExam" component={CreateExam} />
      <Stack.Screen name="ExamScreen" component={ExamScreen} />
      <Stack.Screen name="CreateClass" component={CreateClass} />
      <Stack.Screen name="StudentDetail" component={StudentDetail} />
      <Stack.Screen name="ListExamByClass" component={ListExamByClass} />
      <Stack.Screen name="Result" component={Result} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
}
