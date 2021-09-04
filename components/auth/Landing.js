import React from 'react';
import { Button, Text, View } from 'react-native';

const Landing = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Welcome </Text>
    <Button title="Register" onPress={() => navigation.navigate('Register')} />
    <Button title="Login" onPress={() => navigation.navigate('Login')} />
  </View>
);

export default Landing;
