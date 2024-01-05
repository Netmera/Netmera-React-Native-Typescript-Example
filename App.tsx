/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Platform, StatusBar, Text, TouchableOpacity, View} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator, NativeStackNavigationOptions} from "@react-navigation/native-stack";
import Dashboard from "./src/Screens/Dashboard";
import Coupons from "./src/Screens/Coupons";
import CategoryInboxTest from "./src/Screens/CategoryInboxTest";
import CommerceEventTest from "./src/Screens/CommerceEventTest";
import GeneralEventTest from "./src/Screens/GeneralEventTest";
import MediaEventTest from "./src/Screens/MediaEventTest";
import PushInboxTest from "./src/Screens/PushInboxTest";
import UpdateUserTest from "./src/Screens/UpdateUserTest";
import {Colors} from "react-native/Libraries/NewAppScreen";
import Events from "./src/Screens/Events"
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

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
  const headerOptions: NativeStackNavigationOptions = {
      headerStyle: {
          backgroundColor: Colors.primary,
      },
    headerTitle: props => (
        <View style={{ flex: 1  }}>
          <Text style={{fontWeight: '500', fontSize: 18, color: Colors.white}}>
            {'ReactTSExample'}
          </Text>
        </View>
    ),
    headerRight: () => (
        <TouchableOpacity onPress={()=> console.log("setProperties")}>
            <Text style={{color: Colors.white}}>SET PROPERTIES</Text>
        </TouchableOpacity>
    ),
  }
  return (
    <NavigationContainer>
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}/>
      <Stack.Navigator initialRouteName={"Dashboard"}>
        {
          /*

        <Tab.Screen name={"Event"} component={Event} options={tabBarOptions}/>
        <Tab.Screen name={"User"} component={User} options={tabBarOptions}/>
        <Tab.Screen name={"PushInbox"} component={PushInbox} options={tabBarOptions}/>
        <Tab.Screen name={"Settings"} component={Settings} options={tabBarOptions}/>
        <Tab.Screen name={"Category"} component={Category} options={tabBarOptions}/>
          * */
        }
        <Stack.Screen name={"CategoryInboxTest"}  component={CategoryInboxTest} />
        <Stack.Screen name={"CommerceEventTest"} component={CommerceEventTest} />
        <Stack.Screen name={"Coupons"} component={Coupons} />
        <Stack.Screen name={"Dashboard"} options={headerOptions} component={Dashboard} />
        <Stack.Screen name={"Events"} component={Events} />
        <Stack.Screen name={"GeneralEventTest"} component={GeneralEventTest} />
        <Stack.Screen name={"MediaEventTest"} component={MediaEventTest} />
        <Stack.Screen name={"PushInboxTest"} component={PushInboxTest} />
        <Stack.Screen name={"UpdateUserTest"} component={UpdateUserTest} />
      </Stack.Navigator>
        <Toast />
    </NavigationContainer>
  )
};

export default App;
