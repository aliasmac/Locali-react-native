import React from 'react';
import { 
  StyleSheet,
  View,
  TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
// import AppNavigator from './navigation/AppNavigator';

import { createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from "react-navigation";

import HomeScreen from '../screens/HomeScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import SignUpScreen from '../screens/SignUpScreen'
import SignInScreen from '../screens/SignInScreen'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import SettingsScreen from '../screens/SettingsScreen'


const AuthStackNavigator = createStackNavigator({
  Welcome: WelcomeScreen,
  SignIn: SignInScreen,
  SignUp: SignUpScreen
})


const AppTabNavigator = createBottomTabNavigator({
  HomeScreen: HomeScreen,
  SettingScreen: {
    screen: SettingsScreen,
  }
})

const AppStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: AppTabNavigator,
    navigationOptions: ({navigation}) => ({
      title: 'Locali',
      headerLeft: 
      (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
          <View style={{ paddingHorizontal: 10 }}>
            <Ionicons name="md-menu" size={32} />
          </View>
        </TouchableOpacity >
      )
    })
  }
})

const AppDrawerNavigator = createDrawerNavigator({
  Home: AppStackNavigator,
})


export default createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppDrawerNavigator,
})


const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  }
});
