import React, { useState, useEffect } from 'react';
import { ViewBase, Text, View } from 'react-native';

import firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducers from './redux/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducers, applyMiddleware(thunk));

import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/main/Add';
import Save from './components/main/Save';

const firebaseConfig = {
  apiKey: 'AIzaSyDKUv8kACNm7-XcGC17ziFPWRg-VEC_QOI',
  authDomain: 'imagigram-8f72a.firebaseapp.com',
  projectId: 'imagigram-8f72a',
  storageBucket: 'imagigram-8f72a.appspot.com',
  messagingSenderId: '674783320140',
  appId: '1:674783320140:web:be8d31f44735e8df7e3ce9',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      setIsLoading(false);
    });
  }, []);

  const Loading = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Carregando...</Text>
    </View>
  );

  const LoggedOut = () => (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={Register} />

        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  const LoggedIn = () => (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Add"
            component={Add}
          />
          <Stack.Screen name="Save" component={Save} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );

  if (isLoading) {
    return <Loading />;
  }
  if (isLoggedIn) {
    return <LoggedIn />;
  }
  return <LoggedOut />;
};

export default App;
