import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { supabase } from "../utils/supabase-service";

const DetailAnswerStudents = ({ route, navigation }) => {
  const [dataAns, setDataAns] = useState([]);
  const [dataAnsST, setDataAnsST] = useState([]);
  const [resultData, setResultData] = useState([]);

  const { studentCode, fullName, point, examId, studentid } = route.params;

  const getAnswered = async () => {
    try {
      const { data: answers, error } = await supabase
        .from("answer_exams")
        .select("answers")
        .eq("exam_id", examId);

      if (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }

      const slicedAnswers = answers[0]?.answers.slice(0, 20) || [];
      setDataAns(slicedAnswers);
    } catch (error) {
      console.error(error);
    }
  };

  const getAnswerKeyOfStudent = async () => {
    try {
      console.log('studentid', studentid);
      const { data: answerStudents, error } = await supabase
        .from("answer_students")
        .select(`answers`)
        .eq("student_id", studentid)
        .eq("exam_id", examId);

      if (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }

      const slicedAnswerStudents = answerStudents[0]?.answers.slice(0, 20) || [];
      setDataAnsST(slicedAnswerStudents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAnswered();
      await getAnswerKeyOfStudent();
    };

    fetchData();
  }, [studentid, examId]);

  useEffect(() => {
    if (dataAns.length > 0 && dataAnsST.length > 0) {
      const comparisonResults = dataAns.map((ans, index) => ({
        key: ans.key,
        isCorrect: ans.value === dataAnsST[index]?.value,
        correctValue: ans.value,
        studentValue: dataAnsST[index]?.value,
      }));

      setResultData(comparisonResults);
    }
  }, [dataAns, dataAnsST]);

  const styles = {
    container: {
      padding: 10,
      paddingTop: 20,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      alignContent: 'center',
      paddingLeft: 20,
      paddingTop: 30,
      minWidth: '100%',
      backgroundColor: '#ffffff',
    },
    backButton: {
      flexDirection: 'column',
      alignContent: 'center',
      minWidth: '30%',
    },
    backIcon: {
      width: 24,
      height: 24,
    },
    titleContainer: {
      flexDirection: 'column',
      alignContent: 'center',
      minWidth: '60%',
    },
    container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: '#ffffff',
      marginTop: 20,
    },
    title: {
      fontWeight: 'bold',
      color: '#92050B',
      justifyContent: 'center',
      fontSize: 22,
    },
    emptySpace: {
      flexDirection: 'column',
      alignContent: 'center',
      minWidth: '10%',
    },
    row: {
      flexDirection: 'row',
      backgroundColor: '#FFF1C1',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 4,
      marginVertical: 2,
      borderRadius: 4,
    },
    tableText: {
      fontSize: 12,
      textAlign: 'center',
      color: '#333',
    },
    tableText1: {
      width: '20%',
      fontSize: 12,
    },
    tableText2: {
      width: '20%',
      fontSize: 12,
    },
    tableText3: {
      width: '30%',
      fontSize: 12,
      textAlign : "center"
    },
    tableText4: {
      width: '30%',
      fontSize: 12,
      textAlign: 'center',
    },
    tableHeader: {
      justifyContent: 'center',
      flexDirection: 'row',
    },
    headerText1: {
      fontWeight: '800',
      width: '20%',
    },
    headerText2: {
      fontWeight: '800',
      width: '20%',
    },
    headerText3: {
      fontWeight: '800',
      width: '30%',
      textAlign : "center"
    },
    headerText4: {
      fontWeight: '800',
      width: '30%',
      textAlign : "center"
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={require('../assets/arrow_back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Detail Answer</Text>
        </View>

        <View style={styles.emptySpace}></View>
      </View>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: "#92050B" }}>Student Information</Text>

      <View style={styles.row}>
        <Text style={styles.tableText}>Student Code </Text>
        <Text style={styles.tableText}>{studentCode}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.tableText}>Student Name</Text>
        <Text style={styles.tableText}>{fullName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.tableText}>Point</Text>
        <Text style={styles.tableText}>{point}</Text>
      </View>

      <Text style={{ fontSize: 16, marginTop: 12, color: "#92050B" }}>Total results</Text>
      <View style={styles.row}>
        <Text style={styles.tableText}>Correct Answer</Text>
        <Text style={styles.tableText}>
          {resultData.filter((item) => item.isCorrect).length}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.tableText}>Wrong Answer</Text>
        <Text style={styles.tableText}>
          {resultData.filter((item) => !item.isCorrect).length}
        </Text>
      </View>

      <Text style={{ fontSize: 16, marginTop: 12, color: "#92050B" }}>Detail</Text>
      <View style={styles.tableHeader}>
          <Text style={styles.headerText1}>#</Text>
          <Text style={styles.headerText2}>Result</Text>
          <Text style={styles.headerText3}>Selected Answer</Text>
          <Text style={styles.headerText4}>Correct Answer</Text>
        </View>
      {resultData.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.tableText1}>{item.key}</Text>
          <Text style={styles.tableText2}>
            {item.isCorrect ? 'Correct' : 'Wrong'}
          </Text>
          <Text style={styles.tableText3}>{item.studentValue}</Text>
          <Text style={styles.tableText4}>{item.correctValue}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default DetailAnswerStudents;
