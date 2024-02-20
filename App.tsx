/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Platform, StatusBar, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import Dashboard from './src/screens/Dashboard';
import Coupons from './src/screens/Coupons';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Events from './src/screens/Events';
import Toast from 'react-native-toast-message';
import Category from './src/screens/Category';
import User from './src/screens/User';
import PushInbox from './src/screens/PushInbox';

const Stack = createNativeStackNavigator();

const App = () => {
  const headerOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTitle: props => (
      <View style={{justifyContent: 'flex-start', flex: 1}}>
        <Text style={{fontWeight: '500', fontSize: 18, color: Colors.white}}>
          {'ReactTSExample'}
        </Text>
      </View>
    ),
    /*
      TODO: SET PROPERTIES Button
      headerRight: () => (
        <TouchableOpacity onPress={()=> console.log("setProperties")}>
        <Text style={{color: Colors.white}}>SET PROPERTIES</Text>
      </TouchableOpacity>
    ),
      * */
  };
  return (
    <NavigationContainer>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <Stack.Navigator initialRouteName={'Dashboard'}>
        <Stack.Screen name={'Category'} component={Category} />
        <Stack.Screen name={'Coupons'} component={Coupons} />
        <Stack.Screen
          name={'Dashboard'}
          options={headerOptions}
          component={Dashboard}
        />
        <Stack.Screen name={'Events'} component={Events} />
        <Stack.Screen name={'PushInbox'} component={PushInbox} />
        <Stack.Screen name={'User'} component={User} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
