import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import { Input, Button } from 'react-native-elements'

import API from '../API'
import deviceStorage from '../components/deviceStorage';

import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// const BG_IMAGE = require('../../../assets/images/bg_screen1.jpg');

export default class LoginScreen1 extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
        // fontLoaded: false,
        username: '',
        password: '',
        errorMessage: null,
        // login_failed: false,
        // showLoading: false
        };
    }
    
    signIn = async () => {
        console.log("Hello from signIn")
        const { username, password } = this.state
        API.signIn(username, password)
            .then(user => 
                {
                deviceStorage.saveKey("token", user.token)
                console.log("SIGN IN:", user)
                this.props.navigation.navigate('HomeScreen', {...user})
            }
            ).catch(error => {
                this.props.navigation.navigate('Auth')
                this.setState({ errorMessage: "Sign in failed" })
            })
    }

    // async () => {
    //     await AsyncStorage.setItem('user', user.token)
    //     this.props.navigation.navigate('App', { user: user }) 
        

    // loginUser() {
    //     const { email, password, password_confirmation } = this.state;
    
    //     this.setState({ error: '', loading: true });
    
    //     // NOTE Post to HTTPS only in production
    //     axios.post("http://localhost:4000/api/v1/sign_in",{
    //         email: email,
    //         password: password
    //     })
    //     .then((response) => {
    //       deviceStorage.saveKey("id_token", response.data.jwt);
    //       this.props.newJWT(response.data.jwt);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       this.onLoginFail();
    //     });
    //   }



  render() {
    const { username, password, email_valid } = this.state;

    console.log("Sign In:", username)

    return (
      <View style={styles.container}>
        {/* <ImageBackground
          source={BG_IMAGE}
          style={styles.bgImage}
        > */}
        {/* { this.state.fontLoaded ? */}
          <View style={styles.loginView}>
            <View style={styles.loginTitle}>
              {/* <View style={{flexDirection: 'row'}}>
                <Text style={styles.travelText}>TRAVEL</Text>
                <Text style={styles.plusText}>+</Text>
              </View>
              <View style={{marginTop: -10}}>
                <Text style={styles.travelText}>LEISURE</Text>
              </View> */}
              <Text style={styles.plusText}>Sign In</Text>
            </View>
            <View style={styles.loginInput}>
              <Input
                leftIcon={
                  <Icon
                    name='user-o'
                    color='rgba(171, 189, 219, 1)'
                    size={25}
                  />
                }
                containerStyle={{marginVertical: 10}}
                onChangeText={username => this.setState({ username })}
                value={username}
                inputStyle={{marginLeft: 10, color: 'white'}}
                keyboardAppearance="light"
                placeholder="Username"
                autoFocus={false}
                autoCapitalize="none"
                autoCorrect={false}
                // keyboardType="email-address"
                returnKeyType="next"               
                blurOnSubmit={false}
                placeholderTextColor="white"
                errorStyle={{textAlign: 'center', fontSize: 12}}
                // errorMessage={email_valid ? null : "Please enter a valid email address"}
              />
              <Input
                leftIcon={
                  <Icon
                    name='lock'
                    color='rgba(171, 189, 219, 1)'
                    size={25}
                  />
                }
                containerStyle={{marginVertical: 10}}
                onChangeText={(password) => this.setState({password})}
                value={password}
                inputStyle={{marginLeft: 10, color: 'white'}}
                secureTextEntry={true}
                keyboardAppearance="light"
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="done"
                // ref={ input => this.passwordInput = input}
                blurOnSubmit={true}
                placeholderTextColor="white"
              />
            </View>
            <Button
              title='Sign In'
              activeOpacity={1}
              underlayColor="transparent"
              onPress={this.signIn}
            //   loading={showLoading}
              loadingProps={{size: 'small', color: 'white'}}
            //   disabled={ !email_valid && password.length < 8}
              buttonStyle={{height: 50, width: 250, backgroundColor: 'transparent', borderWidth: 2, borderColor: 'white', borderRadius: 30}}
              containerStyle={{marginVertical: 10}}
              titleStyle={{fontWeight: 'bold', color: 'white'}}
              activeOpacity={0.5}
            />
            <View style={styles.footerView}>
              <Text style={{color: 'grey'}}>
                New here?
              </Text>
              <Button
                title="Create an Account"
                clear
                activeOpacity={0.5}
                titleStyle={{color: 'white', fontSize: 15}}
                containerStyle={{marginTop: -10}}
                onPress={() => console.log('Account created')}
              />
            </View>
          </View> 
          {/* <Text>Loading...</Text>
        } */}
        {/* </ImageBackground> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue'
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginView: {
    marginTop: 150,
    backgroundColor: 'transparent',
    width: 250,
    height: 400,
  },
  loginTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  travelText: {
    color: 'white',
    fontSize: 30,
    // fontFamily: 'bold'
  },
  plusText: {
    color: 'white',
    fontSize: 30,
    // fontFamily: 'regular'
  },
  loginInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerView: {
    marginTop: 20,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});