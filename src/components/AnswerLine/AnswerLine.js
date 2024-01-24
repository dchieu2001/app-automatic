// import React, { useEffect, useState } from "react";
// import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
// import { idGenerator } from "../../service/idGenerator";
// import { RadioButton, Text } from 'react-native-paper';

// export default function AnswerLine(props) {
//   const { answer, onChange } = props;

//   const handlePressCheckbox = (newValue) => {
//     if (typeof onChange === "function") {
//       onChange({
//         key: answer.key,
//         value: newValue
//       });
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <Text
//         style={{
//           fontSize: 18,
//           marginRight: 14,
//           minWidth : 30,
//         }}
//       >
//         {answer.key}.
//       </Text>
//       <RadioButton.Group onValueChange={handlePressCheckbox} value={answer.value} >
//         <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 26 }}>
//           <View style={styles.answerItem}>
//             <Text>A.</Text>
//             <RadioButton value="A" />
//           </View>
//           <View style={styles.answerItem}>
//             <Text>B.</Text>
//             <RadioButton value="B" />
//           </View>
//           <View style={styles.answerItem}>
//             <Text>C.</Text>
//             <RadioButton value="C" />
//           </View>
//           <View style={styles.answerItem}>
//             <Text>D.</Text>
//             <RadioButton value="D" />
//           </View>
//         </View>
//       </RadioButton.Group>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     width: "100%",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   answerItem: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center"
//   },
// });


// Import useState hook from 'react'
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import { idGenerator } from "../../service/idGenerator";
import { RadioButton, Text } from 'react-native-paper';

export default function AnswerLine(props) {
  const { answer, onChange } = props;

  const handlePressCheckbox = (newValue) => {
    if (typeof onChange === "function") {
      onChange({
        key: answer.key,
        value: newValue
      });
    }
  }

  // Kiểm tra nếu answer.key lớn hơn 20, không hiển thị câu trả lời
  if (answer.key > 20) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 18,
          marginRight: 14,
          minWidth: 30,
        }}
      >
        {answer.key}.
      </Text>
      <RadioButton.Group onValueChange={handlePressCheckbox} value={answer.value}>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 26 }}>
          {/* Không hiển thị nếu answer.key lớn hơn 20 */}
          {answer.key <= 20 && (
            <>
              <View style={styles.answerItem}>
                <Text>A.</Text>
                <RadioButton value="A" color="#b9060f"/>
              </View>
              <View style={styles.answerItem}>
                <Text>B.</Text>
                <RadioButton value="B" color="#b9060f"/>
              </View>
              <View style={styles.answerItem}>
                <Text>C.</Text>
                <RadioButton value="C" color="#b9060f"/>
              </View>
              <View style={styles.answerItem}>
                <Text>D.</Text>
                <RadioButton value="D" color="#b9060f"/>
              </View>
            </>
          )}
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
