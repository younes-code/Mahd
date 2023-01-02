import * as React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableHighlight } from 'react-native';

export default function HomeScreen3({navigation}){
    return(
        <View>
            <Image style={styles.img} source={require("../assets/images/home_screens/img3.jpg")}/>
            <View style={styles.top_view}>
                <Image source={require("../assets/images/home_screens/logo.png")}/>
                <Text style={styles.text}>Make sure your baby is sleeping well</Text>
                <TouchableHighlight style={styles.btn} onPress={() => navigation.navigate('AddPhone')}>
                    <Text style={styles.btnText}>Start</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    img: {
        width: "100%",
        height: "100%"
    },
    top_view: {
        flex: 1,
        width: "100%",
        height: "100%",
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(68,64,137,0.5)"
    },
    text: {
        width: "80%",
        textAlign: 'center',
        color: "white",
        fontSize: 25
    },
    btn: {
        backgroundColor: "rgb(68, 64, 137)",
        paddingHorizontal: 60,
        paddingVertical: 10,
        marginTop: 25,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10
    },
    btnText: {
        fontSize: 30,
        color: 'white'
    }
});