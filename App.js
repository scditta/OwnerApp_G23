import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function App() {

  const buttonPressed = async () => {
    // insert into database
    try {
      // this code inserts into the "students" collecction
      // addDoc() will return you a copy of the document that was inserted
      const docRef = await addDoc(collection(db, "test"), {
        firstname: "Mark",
        lastname: "Grinch",
        num: 2.5
      })
      alert("Data inserted, check console for output")
      console.log(`Id of inserted document is: ${docRef.id}`)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={styles.container}>
      <Button onPress={buttonPressed} title='Insert to database'></Button>
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
