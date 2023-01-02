import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Image, TextInput, TouchableHighlight } from 'react-native';
import * as SecureStore from 'expo-secure-store';
export default function AddBabysName({navigation}){
    const [loading, setLoading] = React.useState(false);
    const [txt, setText] = React.useState("");
    async function addName(){
        setLoading(true);
        SecureStore.setItemAsync("register_babys_name", txt)
        .then(_ => {
            setLoading(false);
            navigation.navigate('PickGender')
        })
        .catch(e => {
            setLoading(false);
        });
    }

    return(
        <View style={styles.container}>
            <Image style={styles.img} source={require("../assets/images/register/bubbles.png")}/>
            <View style={styles.top_view}>
                <Image source={require("../assets/images/register/logo.png")}/>
                <Text style={styles.text}>Enter your baby's name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Add name"
                    keyboardType="default"
                    onChangeText={text => {
                        setText(text);
                    }}
                />

                <View style={styles.view2}>
                    {
                        !loading ? 
                        <TouchableHighlight style={styles.btn} onPress={() => addName()}>
                            <Text style={styles.textBtn}>Next</Text>
                        </TouchableHighlight>
                        :
                        <View style={{marginTop: 20}}>
                            <ActivityIndicator size="large" color="#ffffff"/>
                        </View>
                    }
                </View>
            </View>
        </View>        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(68, 64, 137)"
    },
    img: {
        position: 'absolute',
        width: '100%',
        height: '100%'
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
        marginVertical: 45,
        width: "80%",
        textAlign: 'center',
        color: "white",
        fontSize: 20
    },
    input: {
        backgroundColor: 'rgba(197, 195, 226, 1)',
        paddingHorizontal: 50,
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 18,
        borderRadius: 55,
        fontWeight: 'bold'
    },
    btn: {
        marginTop: 20,
        paddingVertical: 20,
        paddingHorizontal: 60,
        backgroundColor: "white",
        borderRadius: 60
    },
    textBtn: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    view2: {
        alignItems: 'center',
        marginTop: 60
    },
    txt2: {
        fontSize: 17,
        color: 'white'
    }
})