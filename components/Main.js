import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions';

import Feed from './main/Feed';
import Profile from './main/Profile';

const Tab = createMaterialBottomTabNavigator();

const Null = () => null;

const Main = (props) => {
  const { currentUser } = props;

  useEffect(() => {
    props.fetchUser();
  }, []);

  return (
    <Tab.Navigator initialRouteName="Feed" backBehavior="initialRoute" labeled={false}>
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
  bindActionCreators({ fetchUser }, dispatch);

export default connect(MapStateToProps, MapDispatchProps)(Main);
