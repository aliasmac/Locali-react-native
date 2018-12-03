/*global google*/
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,  
  Button,
  Dimensions,
  Modal,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MapView } from 'expo';
import decodeGeoCode from '../helper_functions/decodeGeoCode'
import { Constants, Location, Permissions } from 'expo';
import Geofence from 'react-native-expo-geofence';

import API from '../API'
import deviceStorage from '../components/deviceStorage';

const {width, height} = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO




export default class HomeScreen extends React.Component {
  
  // static navigationOptions = {
  //   header: null,
  // };

  constructor(props) {
    super(props)
    // this.loadUsername()
    this.state = { 
      broadcastPin: "",
      currentBroadcast: null,
      polygons: [],
      currentPosition: {
        latitude: "",
        longitude: "",
        latitudeDelta:"",
        longitudeDelta:"",
      },
      location: null,
      errorMessage: null,
      insideFence: [],
      currentMessage: null,
      removeWatchFunction: null,
      username: null,
      userId: null,
      loading: true,
    };

  }

  // Helper Functions
  getDelta(lat, long, distance) {
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = distance / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));
  
    this.setState({
      currentPosition: {
        latitude: lat,
        longitude: long,
        latitudeDelta,
        longitudeDelta,
        },
      })
  }

  pointInPolygon = (point, polygon) => {
    // from https://github.com/substack/point-in-polygon

    let x = point.coords[0]
    let y = point.coords[1]
    let inside = false
  
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0]
      let yi = polygon[i][1]
      let xj = polygon[j][0]
      let yj = polygon[j][1]
      let intersect = ((yi > y) !== (yj > y)) &&
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }

    // console.log("POINT IN POLYGON?", inside)
    return inside
  }

  
  /////////////////////////////////////////////

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.getLocationAsync();
      this.loadUsername()
    }
  }

  loadUsername = async() => {
    const username = await AsyncStorage.getItem('username')
    this.setState({ username })
  }

 

  componentDidMount() {
    
  }

  // getUsername = async() => {
  //       const user = await AsyncStorage.getItem('userObj')
  //       // const user = await AsyncStorage.getItem('userObj')
  //       this.props.navigation.navigate( user ? ('HomeScreen', { id: user.id, username: user.username } ) : 'Auth')
  //   }



  


  checkGeoFence = () => {
    console.log("Hello from checkGeoFence")

    if (this.state.currentBroadcast) {
      // console.log("INSIDE IF STATEMENT")
      const lat = this.state.currentPosition.latitude
      const long = this.state.currentPosition.longitude
      const point = { coords: [lat, long] }

      // console.log("[checkGeoFence] CURRENT BROADCAST MESSAGES:", this.state.currentBroadcast.messages)
      
      this.state.currentBroadcast.messages.map(message => {
        // console.log("[checkGeoFence] MESSAGE:", message)
        const messageContent = message.content
        // console.log("[checkGeoFence] MESSAGE NAME:", messageContent)
        const polygon = decodeGeoCode(message.geofence)
        // console.log("[checkGeoFence] POLYGON:", polygon)
        let expectedPoly = []
        // console.log("[checkGeoFence] EXOECTED POLY:", expectedPoly)

        polygon.map(poly => {
          const arrayOfTwoCoords = [poly.latitude, poly.longitude]
          expectedPoly = [...expectedPoly, arrayOfTwoCoords]
        })

        const checkIfInPolygon = this.pointInPolygon(point, expectedPoly)

        // console.log("[checkGeoFence]:", checkIfInPolygon)

        if (checkIfInPolygon) {
          this.setState({
            currentMessage: messageContent
          })
        }

      })
      
    }

  }


  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
    console.log("LOCATION OBJECT:", location)
    
    const lat = location.coords.latitude
    const long = location.coords.longitude
    
    this.getDelta(lat, long, 1000)

    Location.watchPositionAsync({
      enableHighAccuracy: true,
      distanceInterval: 10,
    }, NewLocation => {
        console.log("NEW LOCATION:", NewLocation)
        let coords = NewLocation.coords;
        this.getDelta(coords.latitude, coords.longitude, 1000)
        this.checkGeoFence()
    }).then(func => this.setState({ removeWatchFunction: func }))

  };

  getGeoFencesFromBroadCast = (broadcast) => {
    let geofenceArray = []
    broadcast.messages.map(message => geofenceArray = [...geofenceArray, message.geofence])
    // console.log("HELLO FROM GET GEOFENCES:", geofenceArray)
    this.makePolygons(geofenceArray)
  }

  makePolygons = (geofenceArray) => {
    geofenceArray.map(geofence => {
      const decodedGeofence = decodeGeoCode(geofence)
      // console.log("DECODED GEO-FENCE:", decodedGeofence)
      this.setState({
        polygons: [...this.state.polygons, decodedGeofence]
      })
    })
  }

  renderPolygonsOnMap = () => {
    return this.state.polygons.map((polygon, idx) => (
      <MapView.Polygon
        key={idx}
        coordinates={polygon}
        fillColor='rgba(1,180,225,0.3)'
      />
    )
  )}

  onChangePin = (val) => {
    this.setState({ broadcastPin: val })
  }

  onPinSubmit = () => {

    // so that we can set new broadcast
    if (this.state.currentBroadcast) {
      this.setState({
        currentBroadcast: null,
        // polygons: null,
      })
    }

    this.setState({ 
      broadcastPin: "",
      polygons: [],
    })


    API.getBroadcast(this.state.broadcastPin)
      .then(broadcast => {
        this.getGeoFencesFromBroadCast(broadcast)
        this.setState({ currentBroadcast: broadcast })
        this.checkGeoFence()

      //   Location.watchPositionAsync({
      //     enableHighAccuracy: true,
      //     distanceInterval: 10,
      //   }, NewLocation => {
      //       console.log("NEW LOCATION:", NewLocation)
      //       let coords = NewLocation.coords;
      //       this.getDelta(coords.latitude, coords.longitude, 1000)
      //       this.checkGeoFence()
    
      //  }).then(func => this.setState({ removeWatchFunction: func }))
      })
  } 

  marker(){
    return {
        latitude: this.state.currentPosition.latitude,
        longitude: this.state.currentPosition.longitude
    }
  }

  closeModal = () => {
    this.setState({ currentMessage: null })
  }

  
  render() {

    return (

      // this.state.loading ? 

      // <View style={styles.container}>
      //           <ActivityIndicator />
      //       </View> :


      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
           <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
                {`Hello ${this.state.username} how are you today?`}
            </Text>
            <View style={styles.pinInputContainer} >
  
              <TextInput
                style={{ width: 200, textAlign: "center", paddingTop: 10 }}
                value={this.state.broadcastPin}
                onChangeText={this.onChangePin}
                placeholder="Enter broadcast PIN"
              />
              <Button style={styles.pinInputContainerBtn}
                title="Get Broadcast"
                onPress={this.onPinSubmit}
              /> 
            </View>  
          </View>
        </ScrollView>

        {
          this.state.currentBroadcast &&
          <>
            <Text style={styles.mapText}>
            You've subscribed to "{this.state.currentBroadcast.name}". Visit to location on the map to access the secret messages!!
            </Text>
            <MapView
              ref={ map => { this.map = map }}
              style={{ flex: 1 }}
              initialRegion={
                this.state.currentPosition   
              }
              zoomEnabled={true}
              provider={"google"}
            > 
            {this.state.polygons && this.renderPolygonsOnMap()}
            {/* {this.pointInPolygon(point, poly)} */}
            {/* {this.test()} */}
              <MapView.Marker
                coordinate={this.marker()}
                title="You"
                description="You are here!"
                pinColor='green'
              />
            </MapView>
           </>
        }

        {/* MESSAGE MODAL */}
        {

          this.state.currentMessage &&
          <>
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{marginTop: 22}} style={styles.modalView}  >
              <View>
                <Text>{this.state.currentMessage}</Text>

                <TouchableHighlight
                  onPress={() => this.closeModal()}>
                  <Text>Close Message</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

        </>

        }
        


      </View>
    );
  }





  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
  },
  pinInputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  pinInputContainerBtn: {
    paddingTop: 1000,
    backgroundColor: "red",
  },
  mapText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(96,100,109, 1)',
    marginBottom: 10,
    lineHeight: 19,
    padding: 5,
  },
  modalView: {
    textAlign: "center",
    marginTop: 200,
  },

  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});


