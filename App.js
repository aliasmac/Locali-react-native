import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

class App extends React.Component {

  constructor(props) {
    super(props)
    // this.params()
    state = {
      isLoadingComplete: false,
      params: null
    }

  }


  render() {

      return (
          <AppNavigator />
      );

  }
}

export default App






// The problem with having a common header is that how will
// you switch the title based on the context of your tab﻿

// AppTabNavigator.navigationOptions = ({ navigation }) => {
//   let { routeName } = navigation.state.routes[navigation.state.index];