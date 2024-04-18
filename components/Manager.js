import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, FlatList, Image } from "react-native";

//firebase imports
import { auth, db, storage } from "../firebaseConfig";
import { collection, where, getDocs, query, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { getDownloadURL, ref } from "firebase/storage";

export default function Manager() {

  const [userVehicles, setUserVehicles] = useState([]);

  useEffect(() => {
    //re-renders the data when changes are made to the collection
    onSnapshot(query(collection(db, "vehicle"), where("ownerID", "==", auth.currentUser.uid)), (snapshot) => {
      setUserVehicles(snapshot.docs.map(doc => ({...doc.data(), id:doc.id})));
    });
  }, []);

// ------------------

  const ListItem = (props) => {
    const [user, setUser] = useState("");
    const [vehicleImage, setVehicleImage] = useState(null);

    const getUserProfile = async () => {
      try{
        const docRef = doc(db, "userdata", props.vehicle.reservationID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const user = docSnap.data();
          setUser(user);
        } else {
          console.log("No Document data found");
        }
      }catch(err){
        console.log(err);
      }
    }

    const getVehicleImage = async () => {
      const pathRef = ref(storage, `gs://finalprojectbtp610.appspot.com/${props.vehicle.img}`);
      await getDownloadURL(pathRef)
      .then((url) => {
        //console.log(url);
        setVehicleImage(url);
      }
      ).catch((err) => {
        console.log(err);
      });
    }

    useEffect(() => {
      if(props.vehicle.reservationID !== ""){
        getUserProfile();
     }
      getVehicleImage();
    }, []);

    const cancelClick = async () => {
      try{
        const docToUpdate = doc(db, "vehicle", props.vehicle.id);
        const updatedValues = {
          // reservationID: "",
          confirmationCode: "",
          status: "CANCELED"
        };
        await updateDoc(docToUpdate, updatedValues);
        alert("The vehicle booking was canceled");
      }catch(err){
        console.log(err);
      }
    }

    return (
      <View>
        <View style={{justifyContent:"space-evenly"}}>
          <View style={{alignItems: "center", marginBottom: 20}}>
            <Image source={{uri: vehicleImage}} style={styles.vehicleimage}/>
              <View style={{flexDirection: "row"}}>
                <Text style={{fontWeight: "bold", fontSize: 20}}>{props.vehicle.make} {props.vehicle.model}</Text>
                <Text style={{fontSize: 20}}> {props.vehicle.year}</Text>
              </View>
              <Text style={{fontSize: 15, marginBottom: 15}}>${props.vehicle.price} / per day</Text>

              <View style={{alignItems: "center", marginBottom: 15}}>
                <Text style={{fontSize: 15, textDecorationLine:"underline"}}>Pick up Location:</Text>
                <Text>{props.vehicle.address}, {props.vehicle.city}</Text>
              </View>

              <View style={{alignItems: "center"}}>
                <Text style={{textDecorationLine:"underline"}}>Description:</Text>
                <Text>{props.vehicle.description}</Text>
              </View>
              
          </View>
          <View style={{backgroundColor: "#ECECEC", padding: 15}}>
            {
            props.vehicle.reservationID === "" ? 
            <View style={{alignItems: "center"}}>
              <Text style={{textAlign: "center"}}>Status: {props.vehicle.status}</Text>
            </View>
            : 
            <View style={{flexDirection: "row", justifyContent:"space-evenly"}}>
              <Text style={{alignSelf:"center", fontWeight: "bold"}}>Booked By:</Text>
              <View style={{alignItems:"center"}}>
                <Image source={{uri: user.img}} style={styles.renterimage} />
                <Text style={{fontSize: 15}}>{user.username}</Text>
              </View>
              <View style={{alignSelf: "center"}}>
                <Text>Code: {props.vehicle.confirmationCode === "" ? "N/A" : props.vehicle.confirmationCode}</Text>
                <Text>Status: {props.vehicle.status}</Text>
              </View>
            </View>
            }
          </View>
        </View>

        <View style={{alignItems:"center", backgroundColor: "#dc3545", paddingVertical: 10}}>
          <Pressable style={{}} onPress={cancelClick}>
            <Text style={{color: "#fff"}}>Cancel Booking {props.vehicle.status !== "CONFIRMED" ? <></> : `for ${user.username}`}</Text>
          </Pressable>
        </View>

    </View>
    );
  }

    return (
      <View style={styles.container}>
        {userVehicles.length === 0?
          <Text style={{textAlign: "center", fontSize: 25, fontWeight: "bold"}}>You have no rentals</Text>
      :
        <FlatList 
        data={userVehicles}
        renderItem={({item}) => <ListItem vehicle={item} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => {
          return <View style={styles.listItemBorder}></View>
        }}
        />
      }
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    listItemBorder: {
      borderWidth: 1,
      borderColor: "#ccc",
      // marginVertical:10
      marginBottom: 30
    },
    vehicleimage : {
      height:100,
      width:200,
      objectFit: "cover",
      borderRadius: 20,
      marginBottom: 5
    },
    renterimage : {
      width: 40, 
      height: 40, 
      borderRadius: 20,
      objectFit: "cover",
      borderRadius: 10
    }
  });