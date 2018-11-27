import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TestScreen from '../screens/TestScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Test: TestScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),

};


// createStackNavigator({
//   // For each screen that you can navigate to, create a new entry like this:
//   Profile: {
//     // `ProfileScreen` is a React component that will be the main content of the screen.
//     screen: ProfileScreen,
//     // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

//     // Optional: When deep linking or using react-navigation in a web app, this path is used:
//     path: 'people/:name',
//     // The action and route params are extracted from the path.

//     // Optional: Override the `navigationOptions` for the screen
//     navigationOptions: ({ navigation }) => ({
//       title: `${navigation.state.params.name}'s Profile'`,
//     }),
//   },

//   ...MyOtherRoutes,
// });



const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});
