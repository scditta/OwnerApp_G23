import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, Image } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';

//firebase imports
import { auth, db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";


export default function Listings() {

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [image, setImage] = useState("");


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
    <View style={styles.container}>
      <TextInput onChangeText={setMake} value={make} style={styles.input} keyboardType='default' placeholder="Make"/>
      <TextInput onChangeText={setModel} value={model} style={styles.input} keyboardType='default' placeholder="Model"/>
      <TextInput onChangeText={setYear} value={year} style={styles.input} keyboardType='numeric' placeholder="Year"/>
      <View style={{flexDirection:"row"}}>
        <Text>$</Text>
        <TextInput onChangeText={setPrice} value={price} style={styles.input} keyboardType='numeric' placeholder="Price"/>
        <Text> / per day</Text>
      </View>
      <TextInput onChangeText={setDescription} value={description} style={styles.input} keyboardType='default' placeholder="Description"/>
      <Pressable onPress={selectImage}>
        <Text>Select Image</Text>
      </Pressable>
      {/* <Image source={{uri: image}} style={styles.image}/> */}

      <TextInput onChangeText={setCity} value={city} style={styles.input} keyboardType='default' placeholder="City"/>
      <TextInput onChangeText={setAddress} value={address} style={styles.input} keyboardType='default' placeholder="Address"/>
      <Pressable onPress={submitClicked}>
        <Text>Submit</Text>
      </Pressable>
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
    input: {

    },
    image : {
      height:300,
      width:300,
      borderWidth:1
    }
  });