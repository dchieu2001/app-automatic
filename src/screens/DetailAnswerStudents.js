// DetailAnswerStudents.js
import React from 'react';
import { View, Text } from 'react-native';

const DetailAnswerStudents = ({ route }) => {
  const { studentCode, fullName, point } = route.params;

  return (
    <View>
      <Text>Student Code: {studentCode}</Text>
      <Text>Name: {fullName}</Text>
      <Text>Point: {point}</Text>
      {/* Thêm code khác nếu cần */}
    </View>
  );
};

export default DetailAnswerStudents;
