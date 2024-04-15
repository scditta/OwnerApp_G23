import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, Button, Image } from "react-native";

//navigator imports
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//firebase imports
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Listings from "./Listings";
import Manager from "./Manager";


const Tab = createBottomTabNavigator();
export default function Dashboard() {

  const [userData, setUserData] = useState("");

  useEffect(() => {
    //console.log("Dashboard");
    //console.log(auth);
    getUserData();
  }, []);

  const getUserData = async () => {
    try{
      const userSnap = await getDoc(doc(db, "userdata", auth.currentUser.uid));
      //console.log(userSnap.data());
      setUserData(userSnap.data());
    }catch(err){
      console.log(err);
    }
  }

  const logoutClicked = async (navigation) => {
    try{
      if(auth.currentUser === null){
        console.log("There is no user to logout");
      }else{
        await signOut(auth);
        navigation.navigate('Login Screen');
        console.log("Signed Out");
        console.log(auth);
      }
    }catch(err){
      console.log("Logout Error")
      console.log(err)
    }
  }

    return (
    <Tab.Navigator initialRouteName="Listings">
        <Tab.Screen name="Listings" component={Listings}
        options={({navigation}) => ({
          headerLeft: () => <View style={{flexDirection:'row', alignItems:'center', marginHorizontal: 30}}><Image source={{uri: userData.img}} style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}} /><Text style={{alignItems:'center'}}>{userData.username}</Text></View>,
          headerRight: () => <Button title='Logout' onPress={() => logoutClicked(navigation)}/>
        })}/>
        <Tab.Screen name="Manager" component={Manager}
        options={({navigation}) => ({
          headerLeft: () => <View style={{flexDirection:'row', alignItems:'center', marginHorizontal: 30}}><Image source={{uri: userData.img}} style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}} /><Text style={{alignItems:'center'}}>{userData.username}</Text></View>,
          headerRight: () => <Button title='Logout' onPress={() => logoutClicked(navigation)}/>
        })}/>
    </Tab.Navigator>
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