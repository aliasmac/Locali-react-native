import { AsyncStorage } from 'react-native';

const deviceStorage = {

  async saveKey(key, valueToSave) {
    console.log("DEVICE STORAGE")
    console.log("KEY:", key)
    console.log("VALUE:", valueToSave)
    try {
      await AsyncStorage.setItem(key, valueToSave);
    } catch (error) {
      console.log('AsyncStorage Error (saveKey): ' + error.message);
    }
  },

  // 'token'
  // 'userId'

  async loadJWT() {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          jwt: value,
          // loading: false
        });
      }
      // else {
      //   this.setState({
      //     loading: false
      //   });
      // }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  // id || userName

  async loadUsername() {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        this.setState({
          username: value,
        });
      } else {
        this.setState({
          username: false,
        });
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },



  async deleteJWT() {
    try{
      await AsyncStorage.removeItem('id_token')
      .then(
        () => {
          this.setState({
            jwt: ''
          })
        }
      );
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }
};

export default deviceStorage;