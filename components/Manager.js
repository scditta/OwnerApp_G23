import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, FlatList, Image } from "react-native";

//firebase imports
import { auth, db, storage } from "../firebaseConfig";
import { collection, where, getDocs, query, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { getDownloadURL, ref } from "firebase/storage";

export default function Manager() {

  const [userVehicles, setUserVehicles] = useState([]);

  // const getUserVehicles = async () => {
  //   const vehicles =[];
  //   try{
  //     const q = query(collection(db, "vehicle"), where("userid", "==", auth.currentUser.uid));
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((currDoc) => {
  //       //console.log(currDoc.data())
  //       const vehicle = {
  //         id: currDoc.id,
  //         ...currDoc.data()
  //       };
  //       vehicles.push(vehicle);
  //     });
  //     //setUserVehicles(vehicles);
  //   }catch(err){
  //     console.log(err);
  //   }
  // }

  useEffect(() => {
    //getUserVehicles();
    //re-renders the data when changes are made to the collection
    onSnapshot(collection(db, "vehicle"), (snapshot) => {
      setUserVehicles(snapshot.docs.map(doc => ({...doc.data(), id:doc.id})));
    });
  }, []);

// ------------------

  const List = (props) => {
    const [user, setUser] = useState("");
    const [vehicleImage, setVehicleImage] = useState("");

    const getUserProfile = async () => {

      try{
        const docRef = doc(db, "userdata", props.vehicle.reservationID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          //console.log("Document data:", docSnap.data());
          const user = docSnap.data();
          setUser(user);
        } else {
          console.log("No Document data found");
        }
      }catch(err){
        console.log(err);
      }
    }

    useEffect(() => {
      if(props.vehicle.reservationID !== ""){
        getUserProfile();
      }
      const pathRef = ref(storage, `gs://finalprojectbtp610.appspot.com/${props.vehicle.img}`);
      //console.log("Img: ", pathRef);
      getDownloadURL(pathRef)
      .then((url) => {
        console.log(url);
        setVehicleImage(url);
      }
      ).catch((err) => {
        console.log(err);
      });
    }, []);

    const cancelClick = async () => {
      console.log(props.vehicle.id);
      const docToUpdate = doc(db, "vehicle", props.vehicle.id);
      const updatedValues = {
        reservationID: "",
        confirmationCode: "",
        status: "CANCELED"
      };
      await updateDoc(docToUpdate, updatedValues);
      alert(
        "The vehicle booking was canceled"
      );
    }

    return (
      <View>
        <View style={{justifyContent:"space-evenly", flexDirection:"row"}}>
          <View style={{width: 100}}>
            <Text>{props.vehicle.make}</Text>
            <Text>{props.vehicle.model}</Text>
            <Text>{props.vehicle.year}</Text>
            <Text>{props.vehicle.description}</Text>
            <Text>${props.vehicle.price} / per day</Text>
            <Text>{props.vehicle.city}</Text>
            <Text>{props.vehicle.address}</Text>
          </View>
          {/* Profile goes here */}
          <View>{
            props.vehicle.reservationID === "" ? 
            <></> 
            : 
            <>
            <Text>{user.username}</Text>
            <Image source={{uri: user.img}} style={styles.image} />
            </>
            }
            
          </View>
          {/* image goes here for far right */}
          <View>
            <Image source={{uri: vehicleImage}} style={styles.image} />
          </View>
        </View>
        <View style={{alignItems:"center"}}>
        <Pressable onPress={cancelClick}>
          <Text>Cancel</Text>
        </Pressable>
      </View>
    </View>
    );
  }

    return (
      <View style={styles.container}>
        <FlatList 
        data={userVehicles}
        renderItem={({item}) => <List vehicle={item} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => {
          return <View style={styles.listItemBorder}></View>
        }}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    listItemBorder: {
      borderWidth: 1,
      borderColor: "#ccc",
      marginVertical:10
    },
    image : {
      height:50,
      width:50,
      borderWidth:1
    }
  });