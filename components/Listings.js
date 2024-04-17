import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, Image, Keyboard, TouchableWithoutFeedback, SafeAreaView, KeyboardAvoidingView } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';

//firebase imports
import { auth, db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import { ScrollView } from "react-native-gesture-handler";


export default function Listings() {

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [image, setImage] = useState(null);

  const resetData = () =>{
    setMake("");
    setModel("");
    setYear("");
    setPrice("");
    setDescription("");
    setCity("");
    setAddress("");
    setImage(null);
  }

  const submitClicked = async () =>{

    const filename = image.substring(image.lastIndexOf('/') + 1, image.length);
    const photoRef = ref(storage, filename);

    let lat = "";
    let long = "";

    try{
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytesResumable(photoRef, blob);

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status  === "granted") {
        
        const geocodedLocation = await Location.geocodeAsync(`${address}, ${city}`);
        long = geocodedLocation[0].longitude;
        lat = geocodedLocation[0].latitude;
      } else {
          console.log("Permission denied");
      }

      const vehcileInputs = {
        make: make,
        model: model,
        year: year,
        price: price,
        description: description,
        city: city,
        address: address,
        longitude: long, 
        latitude: lat,
        ownerID: auth.currentUser.uid,
        img: filename,
        status: "CANCELED",
        reservationID: ""
      };

      //insert into database
      const docRef = await addDoc(collection(db, "vehicle"), vehcileInputs)
      alert("Data inserted")
      console.log(`Id of inserted document is: ${docRef.id}`)
      resetData();
    }catch(err){
      console.log(err);
    }
  }

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (result.canceled === true) {
      console.log("No photo was selected");
      return
    }
    setImage(result.assets[0].uri);
  }

  

    return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <View style={{backgroundColor: "grey", borderRadius: 5, marginBottom: 5}}>
            <Text style={{fontWeight: "bold", textAlign: "center", padding: 5, color: "#fff"}}>Vehicle Info:</Text>
          </View>
          <View style={{flexDirection:"row"}}>
            <View style={{flexDirection:"column", marginHorizontal:5}}>
              <Text style={{fontWeight:"bold"}}>Make</Text>
              <TextInput onChangeText={setMake} value={make} style={styles.input} keyboardType='default' placeholder="ex. Ford"/>
            </View>
            <View style={{flexDirection:"column", marginHorizontal:5}}>
              <Text style={{fontWeight:"bold"}}>Model</Text>
              <TextInput onChangeText={setModel} value={model} style={styles.input} keyboardType='default' placeholder="ex. F-150"/>
            </View>
          </View>
          <View style={{flexDirection:"row"}}>
            <View style={{flexDirection:"column", marginHorizontal:5}}>
              <Text style={{fontWeight:"bold"}}>Year</Text>
              <TextInput onChangeText={setYear} value={year} style={styles.input} keyboardType='numeric' placeholder="ex. 1996"/>
            </View>
            <View style={{flexDirection:"column", marginHorizontal:5}}>
              <Text style={{fontWeight:"bold"}}>Description</Text>
              <TextInput onChangeText={setDescription} value={description} style={styles.input} keyboardType='default' placeholder="ex. Describe the car"/>
            </View>
          </View>
          <View style={{flexDirection:"row", justifyContent:'center'}}>
            <View style={{flexDirection:"column", marginHorizontal:5}}>
              <Text style={{fontWeight:"bold"}}>Price</Text>
              <View style={{flexDirection: "row"}}>
                <Text style={{padding: 10}}>$</Text>
                <TextInput onChangeText={setPrice} value={price} style={styles.input} keyboardType='numeric' placeholder="Price"/>
                <Text style={{padding: 10}}>/ per day</Text>
              </View>
            </View>
          </View>
          <View>
            <Pressable onPress={selectImage} style={styles.pressible}>
              <Text>Select Image</Text>
            </Pressable>
          </View>
          <View style={{flexDirection:"row", marginBottom: 10, justifyContent:'center'}}>
            <Image source={{uri: image}} style={styles.image}/>
          </View>
          <View style={{backgroundColor: "grey", borderRadius: 5, marginBottom: 5}}>
            <Text style={{fontWeight: "bold", textAlign: "center", padding: 5, color: "#fff"}}>Pick up Location:</Text>
          </View>
          <View style={{flexDirection:"row"}}>
            <View style={{flexDirection:"column", marginHorizontal:5}}>
              <Text style={{fontWeight:"bold"}}>City</Text>
              <TextInput onChangeText={setCity} value={city} style={styles.input} keyboardType='default' placeholder="ex. Toronto"/>
            </View>
            <View style={{flexDirection:"column", marginHorizontal:5}}>
              <Text style={{fontWeight:"bold"}}>Address</Text>
              <TextInput onChangeText={setAddress} value={address} style={styles.input} keyboardType='default' placeholder="ex. 21 Yonge St"/>
            </View>
          </View>
          <Pressable onPress={submitClicked} style={styles.pressible}>
            <Text>Submit</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center', 
      justifyContent: 'center'
    },
    input: {
      width: 150,
      padding: 10,
      borderRadius: 10,
      backgroundColor:'#e4e6e4',
      marginBottom: 35
    },
    image : {
      height:200,
      width:300,
      borderWidth:1,
      objectFit: 'contain'
    },
    pressible: {
      paddingHorizontal: 20, 
      paddingVertical: 10, 
      borderWidth:1, 
      borderRadius:10, 
      alignItems:'center', 
      // marginVertical: 10
      marginBottom: 10
    }
  });