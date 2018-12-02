import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    ActivityIndicator,
    AsyncStorage,
} from "react-native";


class AuthLoadingScreen extends Component {

    constructor(props) {
        super(props)
        this.loadApp()
    }

    // loadApp = async() => {
    //     const user = await AsyncStorage.getItem('userObj')
    //     // const user = await AsyncStorage.getItem('userObj')
    //     this.props.navigation.navigate( user ? ('HomeScreen', { id: user.id, username: user.username } ) : 'Auth')
    // }

    loadApp = async() => {
        // let username
        // const username = await AsyncStorage.getItem('username')
        // console.log("HELLO FROM LOAD AUTH LOAD SCREEN!!", username)
        const userToken = await AsyncStorage.getItem('token')
            // .then( username = await AsyncStorage.getItem('username') )
        // const userId = await AsyncStorage.getItem('token')
        
        this.props.navigation.navigate( userToken ? ('HomeScreen') : 'SignIn')
    }

    // this.props.navigation.navigate('HomeScreen', { username: user.username })

    // , { username: username }
    

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }
}

export default AuthLoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

