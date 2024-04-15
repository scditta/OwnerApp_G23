import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, Button } from "react-native";

//navigator imports
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//firebase imports
import { auth } from "../firebaseConfig";

import Listings from "./Listings";
import Manager from "./Manager";

const Tab = createBottomTabNavigator();
export default function Dashboard() {

  useEffect(() => {
    //console.log("Dashboard");
    //console.log(auth);
    if(auth.currentUser === null){
      console.log("There is no login");
    }else{
      //console.log(auth.currentUser);
    }
  }, []);

    return (
    <Tab.Navigator initialRouteName="Listings">
        <Tab.Screen name="Listings" component={Listings} 
        options={({navigation}) => ({
          headerLeft: null, 
          headerRight: () => (
            <Button title='Logout' onPress={() => logoutClicked(navigation)}/>
          )
        })}/>
        <Tab.Screen name="Manager" component={Manager} 
        options={({navigation}) => ({
          headerLeft: null, 
          headerRight: () => (
            <Button title='Logout' onPress={() => logoutClicked(navigation)}/>
          )
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