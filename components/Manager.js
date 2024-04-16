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
          reservationID: "",
          confirmationCode: "",
          status: "CANCELED"
        };
        await updateDoc(docToUpdate, updatedValues);
        alert(
          "The vehicle booking was canceled"
        );
      }catch(err){
        console.log(err);
      }
    }

    return (
      <View>
        <View style={{justifyContent:"space-evenly"}}>
          <View style={{alignItems: "center"}}>
            <Image source={{uri: vehicleImage}} style={styles.vehicleimage}/>
            {/* <View style={{justifyContent: "space-between"}}> */}
              <View style={{flexDirection: "row"}}>
                <Text style={{fontWeight: "bold"}}>{props.vehicle.make} {props.vehicle.model}</Text>
                <Text> {props.vehicle.year}</Text>
                <Text>${props.vehicle.price} / per day</Text>
              </View>
            {/* </View> */}
          </View>
            
            
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
              <View>
                <Text>Description:</Text>
                <Text>{props.vehicle.description}</Text>
              </View>
              <View style={{}}>
                <Text>Location:</Text>
                <Text>{props.vehicle.city}</Text>
                <Text>{props.vehicle.address}</Text>
              </View>
            </View>
          
          
          {/* Profile goes here */}
          <View style={{backgroundColor: "#ECECEC", padding: 15}}>
            {
            props.vehicle.reservationID === "" ? 
            <View style={{alignItems: "center"}}>
              <Text style={{textAlign: "center"}}>Status: {props.vehicle.status}</Text>
            </View>
            : 
            <View style={{flexDirection: "row", justifyContent:"space-evenly"}}>
              <View>
                <Image source={{uri: user.img}} style={styles.renterimage} />
                <Text>{user.username}</Text>
              </View>
              <View>
                <Text>Code: {props.vehicle.confirmationCode}</Text>
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
        <FlatList 
        data={userVehicles}
        renderItem={({item}) => <ListItem vehicle={item} />}
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
      borderRadius: 20
    },
    renterimage : {
      width: 40, 
      height: 40, 
      borderRadius: 20,
      objectFit: "cover",
      borderRadius: 10
    }
  });