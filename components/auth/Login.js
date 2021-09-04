import React, { useState } from 'react';
import firebase from 'firebase';
import { View, TextInput, Button } from 'react-native';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async () => {
    const res = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      console.log(res)
  };

  return (
    <View>
     
      <TextInput placeholder="E-mail" onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleSubmit} />
    </View>
  );
};

export default Login;
