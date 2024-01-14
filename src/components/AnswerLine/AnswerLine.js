import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import { idGenerator } from "../../service/idGenerator";
import { RadioButton, Text } from 'react-native-paper';

export default function AnswerLine(props) {
  const { answer } = props;
  const [value, setValue] = useState(null);

  const handlePressCheckbox = (newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    setValue(answer.value);
  }, [answer]);

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 18,
          marginRight: 14,
        }}
      >
        {answer.key}.
      </Text>
      <RadioButton.Group onValueChange={handlePressCheckbox} value={value} >
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 26 }}>
          <View style={styles.answerItem}>
            <Text>A.</Text>
            <RadioButton value="A" />
          </View>
          <View style={styles.answerItem}>
            <Text>B.</Text>
            <RadioButton value="B" />
          </View>
          <View style={styles.answerItem}>
            <Text>C.</Text>
            <RadioButton value="C" />
          </View>
          <View style={styles.answerItem}>
            <Text>D.</Text>
            <RadioButton value="D" />
          </View>
        </View>
      </RadioButton.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answerItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
});
