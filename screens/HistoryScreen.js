import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    AsyncStorage,
} from "react-native";

class HistoryScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: null,
            loading: true,
        }
    }

    componentWillMount() {
        this.loadUsername()
    }

    loadUsername = async() => {
        const username = await AsyncStorage.getItem('username')
        this.setState({
            username,
            loading: false,
        })
    }

    static navigationOptions = {
        title: 'History',
    };
    
    render() {
        return (
            this.state.loading ?
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
            :
            <View style={styles.container}>
                <Text>Coming Soon</Text>
            </View>
        );
    }
}



export default HistoryScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


