/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Platform, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import User from "./src/Screens/User";
import PushInbox from "./src/Screens/PushInbox";
import Category from './src/Screens/Category';
import Event from './src/Screens/Event';
import Settings from './src/Screens/Settings';

const Tab = createBottomTabNavigator();

const App = () => {
  const tabBarOptions: BottomTabNavigationOptions = {
    tabBarLabelPosition: "beside-icon",
    tabBarIconStyle: {
      display: "none",
    },
    tabBarLabelStyle: {
      position: "absolute",
      fontWeight: "700",
      fontSize: 12,
    },
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}/>
      <Tab.Navigator>
        <Tab.Screen name={"Event"} component={Event} options={tabBarOptions}/>
        <Tab.Screen name={"User"} component={User} options={tabBarOptions}/>
        <Tab.Screen name={"PushInbox"} component={PushInbox} options={tabBarOptions}/>
        <Tab.Screen name={"Settings"} component={Settings} options={tabBarOptions}/>
        <Tab.Screen name={"Category"} component={Category} options={tabBarOptions}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
};

export default App;
