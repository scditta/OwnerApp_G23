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
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginScreen'>
        <Stack.Screen name='LoginScreen' component={Login}/>
        <Stack.Screen name='Dashboard' component={Dashboard} 
          options={({navigation}) => ({
            headerShown: false,
            headerLeft: null
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
