// Result.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase-service';

const Result = ({ route }) => {
  const navigation = useNavigation();
  const class_id = route.params.id;
  const examId = route.params.examId;
  console.log(examId)
  const [results, setResults] = useState([]);

  const loadResults = async () => {
    const { data: result, error } = await supabase
      .from('answer_students')
      .select('*, students(full_name, student_code)')
      .eq('students.is_delete', false)
      .eq('students.class_id', class_id)
      .eq('exam_id', examId);
      // console.log("student",result)
    setResults(result);
  };

  useEffect(() => {
    loadResults();
  }, []);

  const navigateToDetail = (studentCode, fullName, point,examId,studentid) => {
    navigation.navigate('DetailAnswerStudents', {
      studentCode,
      fullName,
      point,
      examId,
      studentid
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <Text style={styles.title}>Results</Text>
        </View>

        <View style={styles.emptySpace}></View>
      </View>

      <View style={styles.container}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText1}>#</Text>
          <Text style={styles.headerText2}>StudentCode</Text>
          <Text style={styles.headerText3}>Name</Text>
          <Text style={styles.headerText4}>Point</Text>
        </View>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toFixed()}
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                navigateToDetail(
                  item.students.student_code,
                  item.students.full_name,
                  item.point,
                  examId,
                  item.student_id
                )
              }
            >
              <View style={styles.tableRow}>
                <Text style={styles.rowText1}>{index + 1}</Text>
                <Text style={styles.rowText2}>{item.students.student_code}</Text>
                <Text style={styles.rowText3}>{item.students.full_name}</Text>
                <Text style={styles.rowText4}>{item.point}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    marginTop: 20,
  },
  tableHeader: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerText1: {
    fontWeight: '800',
    width: '10%',
  },
  headerText2: {
    fontWeight: '800',
    width: '30%',
  },
  headerText3: {
    fontWeight: '800',
    width: '45%',
  },
  headerText4: {
    fontWeight: '800',
    width: '15%',
    textAlign : "center"
  },
  tableRow: {
    justifyContent: 'center',
    borderBottomColor: '#2196F3',
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  rowText1: {
    width: '10%',
  },

  rowText2: {
    width: '30%',
  },

  rowText3: {
    width: '45%',
  },

  rowText4: {
    width: '15%',
    textAlign : "center"
  },
});

export default Result;
