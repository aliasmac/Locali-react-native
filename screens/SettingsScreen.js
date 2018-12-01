import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { 
  View,
  Text,
  StyleSheet, 
  Button,
  AsyncStorage,
} from "react-native";

class SettingsScreen extends React.Component {

  static navigationOptions = {
    title: 'Settings',
  };

  signOut = async() => {
    AsyncStorage.clear()
    this.props.navigation.navigate('AuthLoading')
  }

  render() {
    
    return (
      <View style={styles.container}>
          <Button title='Sign Out'
          onPress={this.signOut}
          ></Button>
      </View>
    )
    

  }
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  }
});