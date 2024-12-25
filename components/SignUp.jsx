import React, { useState } from "react";
import { Text, View, TouchableOpacity ,StyleSheet, Alert, TextInput, ImageBackground} from "react-native";
import { Ionicons } from '@expo/vector-icons';


export default function SignUp({ navigation }){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
    
  return (
    <View style={styles.container}>
      <ImageBackground source ={require('./../assets/images/background.jpeg')} style = {styles.backImage}></ImageBackground>
      <View style={styles.card}>
      <Ionicons name="people-circle" size={80} color="black" style={styles.icon}/>
        <Text style={styles.title} > Welcome</Text>
    <TextInput
      style={styles.input}
      placeholder="Email Address"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      autoCapitalize="none"
    />
    <TextInput
      style={styles.input}
      placeholder="Confirm Password"
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      secureTextEntry
      autoCapitalize="none"
    />
    <TouchableOpacity style={styles.btn} >
      <Text style={styles.btnText}>Sign up</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.text} onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.textebas}>Already have account? Login</Text>
    </TouchableOpacity>
  </View>
  </View>
  );
}
const styles = StyleSheet.create({
  btn : {
    backgroundColor: '#40B7B4',
    borderRadius: 99,
    padding: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#40B7B4',
    borderWidth: 2,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10
  },
  btnText: {
    color: '#000', 
    fontSize: 16,
  },
  googleLogo : {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 12,
    right: 15,
    resizeMode: 'contain' 
  },card: {
    margin: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 20,
    marginHorizontal : 40,
  },
  backImage : {
    width: '100%',     
    height: '100%', 
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover'
  }, 
  title :{
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
    paddingBottom:10
  }, 
  icon : {
    marginBottom: 20,
    alignSelf: 'center',
  },
  textebas: {
    textAlign: 'center',
    color: '#40B7B4',
    fontSize: 12,
    fontWeight: 'bold'  ,
    textDecorationLine: 'underline'  ,
    textDecorationStyle:'solid'  ,
    textDecorationColor: '#40B7B4'  ,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  text :{
    paddingTop: 10,
  }
})
