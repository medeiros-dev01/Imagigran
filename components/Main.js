import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchUser,
  fetchUserPosts,
  fetchUserFollowing,
} from '../redux/actions';

import firebase from 'firebase';
import 'firebase/auth';

import Feed from './main/Feed';
import Profile from './main/Profile';
import Search from './main/Search';

const Tab = createMaterialBottomTabNavigator();

const Null = () => null;

const Main = ({
  currentUser,
  fetchUser,
  fetchUserPosts,
  fetchUserFollowing,
}) => {
  useEffect(() => {
    fetchUser();
    fetchUserPosts();
    fetchUserFollowing();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      backBehavior="initialRoute"
      labeled={false}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="newspaper-variant" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="magnify" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddContainer"
        component={Null}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('Add');
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-box" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('Profile', {
              uid: firebase.auth().currentUser.uid,
            });
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-circle" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const MapDispatchProps = (dispatch) =>
  bindActionCreators(
    { fetchUser, fetchUserPosts, fetchUserFollowing },
    dispatch,
  );

export default connect(MapStateToProps, MapDispatchProps)(Main);
