import React from 'react';
import { 
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Alert,
  AsyncStorage,
  ScrollView,
  Image,
 } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
// import AppNavigator from './navigation/AppNavigator';

import { createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  DrawerItems
} from "react-navigation";


import HomeScreen from '../screens/HomeScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import SignUpScreen from '../screens/SignUpScreen'
import SignInScreen from '../screens/SignInScreen'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import SettingsScreen from '../screens/SettingsScreen'
import HistoryScreen from '../screens/HistoryScreen'
import HelpScreen from '../screens/HelpScreen'

const AuthStackNavigator = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen
})


const AppTabNavigator = createBottomTabNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return <Ionicons name="ios-home" size={37} color={tintColor} />;
    }
  })
  }, 
  History: {
    screen: HistoryScreen,
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return <Ionicons name="ios-archive" size={37} color={tintColor} />;
    }
  })
  }, 
  Help: {
    screen: HelpScreen,
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return <Ionicons name="ios-help-circle-outline" size={37} color={tintColor} />;
    }
  })
  }
}, {
  tabBarOptions: {
    activeTintColor: '#6acbd5',
    style: {
      backgroundColor: '#030056',
      height: 70,
      padding: 10,
    },
    showLabel: false,
  },
 
  
})


const AppStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: AppTabNavigator,
    navigationOptions: ({navigation}) => ({
      title: 'Locali',
      headerLeft: 
      (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
          <View style={{ paddingHorizontal: 20 }}>
            <Ionicons name="md-menu" size={32} />
          </View>
        </TouchableOpacity >
      )
    })
  }
})


const AppDrawerNavigator = createDrawerNavigator(

  { 
    Home: AppStackNavigator,
  },
  {
    contentComponent:(props) => (
      <View style={{flex:1}}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <ScrollView>  
            <View style={{height: 190, backgroundColor: 'white', alignItems: 'center'}}>
          <Image source={require('../assets/images/localiLogo.png')} style={{height: 150, width: 150, marginTop: 3,}} />
      </View>
        
      </ScrollView>
        <DrawerItems {...props} />
          <TouchableOpacity onPress={()=>
            Alert.alert(
              'Log out',
              'Do you want to logout?',
              [
                {text: 'Cancel', onPress: () => {return null}},
                {text: 'Confirm', onPress: () => {
                  AsyncStorage.clear();
                  props.navigation.navigate('AuthLoading')
                }},
              ],
              { cancelable: false }
            )  
          }>
            <Text style={{margin: 16,fontWeight: 'bold',color: 'red'}}>Logout</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    ),
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
  }

)


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
