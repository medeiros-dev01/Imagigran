import React, { useState } from 'react';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore'
import { View, TextInput, Button } from 'react-native';

const Register = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async () => {
    const res = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

      try {
          await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({name, email});
      } catch (error) { 
          console.log(error);
      }
  };

  return (
    <View>
      <TextInput placeholder="Nome" onChangeText={setName} />
      <TextInput placeholder="E-mail" onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default Register;
