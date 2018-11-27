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
  Dimensions
} from 'react-native';
import { WebBrowser } from 'expo';
import { MapView } from 'expo';
import decodeGeoCode from '../helper_functions/decodeGeoCode'
import { Constants, Location, Permissions } from 'expo';
import Geofence from 'react-native-expo-geofence';

import API from '../API'

const {width, height} = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO


var poly = [ [51.5214, -0.09108] ,

  [51.51881,  -0.08923],
   
  [51.52098, -0.084],
  
  [51.52293, -0.08751]
]

var poly2 =[ [51.52303, -0.09271], 
  [51.52108, -0.09125], 
  [51.52391, -0.08919]
]


var point = {
  coords: [51.521168, -0.087656]
}


export default class HomeScreen extends React.Component {
  
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super()
    Geofence.Log = true;
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
      });
  }

  pointInPolygon = (point, polygon) => {
    // from https://github.com/substack/point-in-polygon

    console.log(point.coords[0], "+", point.coords[1])

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

    console.log("POINT IN POLYGON?", inside)
  
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
    }

  }

  
  componentDidMount() {
    Location.watchPositionAsync({
      enableHighAccuracy: true,
      distanceInterval: 10,
    }, NewLocation => {
        let coords = NewLocation.coords;
        this.getDelta(coords.latitude, coords.longitude, 1000)

   }) 
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("LOCATION OBJECT:", location)
    
    const lat = location.coords.latitude
    const long = location.coords.longitude
    const accuracy = location.coords.accuracy

    this.getDelta(lat, long, 1000)

  };


  getGeoFencesFromBroadCast = (broadcast) => {
    let geofenceArray = []
    broadcast.messages.map(message => geofenceArray = [...geofenceArray, message.geofence])
    console.log("HELLO FROM GET GEOFENCES:", geofenceArray)
    this.makePolygons(geofenceArray)
  }

  makePolygons = (geofenceArray) => {
    geofenceArray.map(geofence => {
      const decodedGeofence = decodeGeoCode(geofence)
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
    console.log("HELLOOoooooo")
    API.getBroadcast(this.state.broadcastPin)
      .then(broadcast => {
        this.getGeoFencesFromBroadCast(broadcast)
        this.setState({
          currentBroadcast: broadcast 

        })
      })
  } 

  marker(){
    return {
        latitude: this.state.currentPosition.latitude,
        longitude: this.state.currentPosition.longitude
    }
  }

  
  render() {
   
    // console.log("TESTING GEOFENCE:", this.state.insideFence)
    console.log("Hello from inside HomeScreen render() :", this.state.polygons)
    // console.log("COORDS OBJECT:", this.state.location && this.state.location.coords)

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
           <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
                Hello Ali how are we today?
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
              style={{ flex: 1 }}
              initialRegion={
                this.state.currentPosition   
              }
            > 
            {this.state.polygons && this.renderPolygonsOnMap()}
            {this.pointInPolygon(point, poly)}
              <MapView.Marker
                coordinate={this.marker()}
                title="You"
                description="You are here!"
                pinColor='green'
              />
            </MapView>
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


