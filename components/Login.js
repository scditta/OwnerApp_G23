import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet } from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Login({navigation}) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const getUserData = async (user) => {
    try{
      const userSnap = await getDoc(doc(db, "userdata", user.uid));
      console.log("User: ", userSnap.data());
      if(userSnap.data().isOwner){
        navigation.navigate('Dashboard');
      }else{
        alert("You cannot access the owner app, please open the renter app and login with this account.");
      }
    }catch(err){
      console.log(err);
    }
  }

  const loginClicked = async () => {
    await signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      //console.log(user.uid);
      getUserData(user);
      //removes the username and password input so when logged out user has to retype for security
      setUserName("");
      setPassword("");
    })
    .catch((err) => {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log(`Error code: ${errorCode}`);
      console.log(`Error message: ${errorMessage}`);
      console.log(err);
    });
  }

    return (
      <View style={styles.container}>
        <TextInput style={styles.input} onChangeText={setUserName} value={username} placeholder="username" keyboardType="email-address"/>
        <TextInput style={styles.input} secureTextEntry={true} onChangeText={setPassword} value={password} placeholder="password" keyboardType="default"/>
        <Pressable onPress={loginClicked} style={styles.pressable} >
          <Text>Login</Text>
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
      width: 250,
      padding: 10,
      borderRadius: 10,
      backgroundColor:'#e4e6e4',
      marginBottom: 5
    },
    pressable: {
      paddingHorizontal: 20, 
      paddingVertical: 10, 
      borderWidth:1, 
      borderRadius:10, 
      alignItems:'center', 
      marginVertical: 10
    }
  });