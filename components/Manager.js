import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, FlatList } from "react-native";

//firebase imports
import { auth, db } from "../firebaseConfig";
import { collection, where, getDocs, query } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";

export default function Manager() {

  const [userVehicles, setUserVehicles] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused){
      getUserVehicles();
    }
  }, [isFocused]);

  const getUserVehicles = async () => {
    const vehicles =[];
    try{
      const q = query(collection(db, "vehicle"), where("userid", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((currDoc) => {
        //console.log(currDoc.data())
        const vehicle = {
          id: currDoc.id,
          ...currDoc.data()
        };
        vehicles.push(vehicle);
      });
      setUserVehicles(vehicles);
    }catch(err){
      console.log(err);
    }
    //console.log(vehicles);
  }

    return (
      <View style={styles.container}>
        <FlatList 
        data={userVehicles}
        renderItem={({item}) => <View><Text>{item.make}</Text></View>}
        keyExtractor={item => item.id}
        />
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