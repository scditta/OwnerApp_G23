import { useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet } from "react-native";

//navigator imports
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//firebase imports
import { auth } from "../firebaseConfig";

import Listings from "./Listings";
import Manager from "./Manager";

const Tab = createBottomTabNavigator();
export default function Dashboard() {

    return (
    <Tab.Navigator initialRouteName="Listings">
        <Tab.Screen name="Listings" component={Listings} />
        <Tab.Screen name="Manager" component={Manager} />
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