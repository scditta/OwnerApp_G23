import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, Button, Image } from "react-native";

//navigator imports
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//firebase imports
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

//Icons
import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

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
    <Tab.Navigator 
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        if (route.name == "Listing") {
          return (
            <FontAwesome6 name="car-on" size={21} color="black" />
          );
        }
        if (route.name === "Manager") {
          return (
            // <FontAwesome name="car" size={21} color="black" />
            <MaterialCommunityIcons name="car-multiple" size={24} color="black" />
          );
        }
      },
      tabBarActiveTintColor: 'black'
    })
  }
    initialRouteName="Listing"
    >
        <Tab.Screen name="Listing" component={Listings}
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