import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

//navigator imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import 'react-native-gesture-handler';

//firebase imports
import { auth, db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

//import components
import Login from './components/Login';
import Dashboard from './components/Dashboard';


const Stack = createStackNavigator();
export default function App() {

  // const buttonPressed = async () => {
  //   // insert into database
  //   try {
  //     // this code inserts into the "students" collecction
  //     // addDoc() will return you a copy of the document that was inserted
  //     const docRef = await addDoc(collection(db, "test"), {
  //       firstname: "Mark",
  //       lastname: "Grinch",
  //       num: 2.5
  //     })
  //     alert("Data inserted, check console for output")
  //     console.log(`Id of inserted document is: ${docRef.id}`)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const logoutClicked = async (navigation) => {
    try{
      if(auth.currentUser === null){
        console.log("There is no user to logout");
      }else{
        await signOut(auth);
        navigation.navigate('LoginScreen');
        console.log("Signed Out");
        console.log(auth);
      }
    }catch(err){
      console.log("Logout Error")
      console.log(err)
    }
  }

  return (
    // <View style={styles.container}>
    //   <Login />
    //   <StatusBar></StatusBar>
    // </View>
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginScreen'>
        <Stack.Screen name='LoginScreen' component={Login}/>
        <Stack.Screen name='Dashboard' component={Dashboard} 
          options={({navigation}) => ({
            headerLeft: null, 
            headerRight: () => (
              <Button title='Logout' onPress={() => logoutClicked(navigation)}/>
            )
          })}/>
      </Stack.Navigator>
    </NavigationContainer>

    
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
