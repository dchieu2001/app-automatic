import { Provider } from "react-native-paper";
import { theme } from "./src/core/theme";

import { AuthProvider } from "./src/utils/AuthProvider";
import Navigation from "./src/navigation";

export default function App() {
  // console.log("user: ", users);
  // console.log("user 2: ", currentUser);

  return (
    // <AuthContextProvider>
    <AuthProvider>
      <Provider theme={theme}>
        <Navigation />
        {/* <NavigationContainer>
          <Stack.Navigator
            // initialRouteName="StartScreen"
            screenOptions={{
              headerShown: false,
            }}
          >

            <Stack.Screen name="StartScreen" component={StartScreen} />

            <Stack.Screen name="TabBottom" component={TabBottom} />

            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="Result" component={Result} />
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
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          </Stack.Navigator>
        </NavigationContainer> */}
      </Provider>
    </AuthProvider>
  );
}
