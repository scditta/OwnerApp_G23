import { useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet } from "react-native";

//firebase imports
import { auth } from "../firebaseConfig";

export default function Manager() {

    return (
      <View style={styles.container}>
        <Text>Manager</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });