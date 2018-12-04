import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class HelpScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>HelpScreen</Text>
            </View>
        );
    }
}
export default HelpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});