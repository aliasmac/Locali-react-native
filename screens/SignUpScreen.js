import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import { Input, Button } from 'react-native-elements'

import API from '../API'
import deviceStorage from '../components/deviceStorage';

import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class SignUpScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
        // fontLoaded: false,
        username: '',
        password: '',
        errorMessage: null,
        // signUp_failed: false,
        // showLoading: false
        };
    }

    signUp = async () => {
        console.log("Hello from SIGNUP")
        const { username, password } = this.state
        API.signUp(username, password)
            .then(user =>  {
                deviceStorage.saveKey("token", user.token)
                deviceStorage.saveKey("username", user.username)
                console.log(user)
                this.props.navigation.navigate('HomeScreen', { username: user.username })
            }
            ).catch(error => {
                this.props.navigation.navigate('Auth')
                this.setState({ errorMessage: "Sign Up failed" })
            })
    }

  
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
              <View style={styles.signUpView}>
                <View style={styles.signUpTitle}>
                  {/* <View style={{flexDirection: 'row'}}>
                    <Text style={styles.travelText}>TRAVEL</Text>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                  <View style={{marginTop: -10}}>
                    <Text style={styles.travelText}>LEISURE</Text>
                  </View> */}
                   <Text style={styles.plusText}>Sign Up</Text>
                </View>
                <View style={styles.signUpInput}>
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
                    placeholderTextColor='white'
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
                    placeholderTextColor='white'
                  />
                </View>
                <Button
                  title='Sign Up'
                  activeOpacity={1}
                  underlayColor="transparent"
                  onPress={this.signUp}
                //   loading={showLoading}
                  loadingProps={{size: 'small', color: 'white'}}
                //   disabled={ !email_valid && password.length < 8}
                  buttonStyle={{marginTop: -40, height: 50, width: 250, backgroundColor: 'transparent', borderWidth: 2, borderColor: 'white', borderRadius: 30}}
                  containerStyle={{marginVertical: 10}}
                  titleStyle={{fontWeight: 'bold', color: 'white'}}
                  activeOpacity={0.5}
                />
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
        backgroundColor: '#030056',
        alignItems: 'center',
        justifyContent: 'center',
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
      signUpView: {
        marginTop: -150,
        backgroundColor: 'transparent',
        width: 250,
        height: 400,
      },
      signUpTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'green',
        padding: 0,
        marginBottom: -150,
      }, 	
      travelText: {
        color: 'white',
        fontSize: 30,
        // fontFamily: 'bold'
      },
      plusText: {
        color: '#4c75c2',
        fontSize: 30,
        // fontFamily: 'regular'
      },
      signUpInput: {
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