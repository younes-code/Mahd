import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Image, TextInput, TouchableHighlight } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function BDay({navigation}){
    const [loading, setLoading] = React.useState(false);
    const [txt, setText] = React.useState("");
    const [name, setName] = React.useState("");
    React.useEffect(() => {
        SecureStore.getItemAsync("register_babys_name")
        .then(name => {
            if(name) {
                setName(name)
            }
        })
    }, []);

    async function addBDay(){
        setLoading(true);
        const fd = new FormData();
        SecureStore.getItemAsync("register_name")
        .then(name => {
            if(name) {
                fd.append('fullname', name)
                SecureStore.getItemAsync("register_phone")
                .then(phone => {
                    if(phone) {
                        fd.append("phone", phone)

                        SecureStore.getItemAsync("register_gender")
                        .then(gender => {
                            if(gender) {
                                fd.append("gender", parseInt(gender))
                                fd.append("birthday", txt);
                                axios.post('http://192.168.43.7:4001/register', fd, {
                                    headers: {
                                        "Content-Type": "multipart/form-data"
                                    }
                                })
                                .then(res => {
                                    if(res.data.status == "success")
                                    {
                                        navigation.navigate('Connect')
                                    }
                                })
                                .catch(err => {
                                    console.error(err);
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    return(
        <View style={styles.container}>
            <Image style={styles.img} source={require("../assets/images/register/bubbles.png")}/>
            <View style={styles.top_view}>
                <Image source={require("../assets/images/register/logo.png")}/>
                <Text style={styles.text}>When is {name}'s birthday?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="DD/MM/YY"
                    keyboardType="default"
                    onChangeText={text => {
                        setText(text);
                    }}
                />

                <View style={styles.view2}>
                    {
                        !loading ? 
                        <TouchableHighlight style={styles.btn} onPress={() => addBDay()}>
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