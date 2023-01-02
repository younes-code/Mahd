import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Image, Linking, TouchableHighlight } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import axios from 'axios';

export default function Connect({navigation}){
    const [loading, setLoading] = React.useState(false);
    const [phone, setPhone] = React.useState('');
    const [canConnect, setCanConnect] = React.useState(false);

    React.useEffect(() => {
        SecureStore.getItemAsync("register_phone")
        .then(phone => {
            if(phone) {
                setPhone(phone)
            }
        })
    }, []); 

    React.useEffect(() => {
        if(phone){
            checkUserId();
        }
    }, [phone])

    function checkUserId(){
        axios.get('http://192.168.43.7:4001/user_id?id='+phone)
        .then(res => {
            if(!Object.keys(res.data.data.devices).length) {
                setCanConnect(true);
                return;
            }

            SecureStore.setItemAsync("user_id", res.data.data.devices.user_id)
            .then(_ => {
                navigation.navigate('Main')
            })
            .catch(e => {
                console.log(e)
                setLoading(false);
            });
        })
        .catch(err => {
            console.error(err);
        })
    }

    function connectToBraclet(){
        if(!canConnect)
            return;

        const headers = {
            "dev-id": "bits-n-bytes-dev-gJ7saQndTH", 
            "x-api-key": "e98630d58b3429f1ff330d2bfc84becfe3ecaad523d06e29892563617fb766bd"
        }

        axios.post('https://api.tryterra.co/v2/auth/generateWidgetSession', {
            "reference_id": phone,
            "providers": "FITBIT, OURA, TEMPO",
            "auth_success_redirect_url": "http://192.168.43.7:4001/success",
            "auth_failure_redirect_url": "http://192.168.43.7:4001/failure",
            "language": "EN"
        }, {
            headers
        })
        .then(res => {
            Linking.openURL(res.data.url)
            let can_req = true;
            let interv = setInterval(() => {
                if(can_req)
                {
                    can_req = false;
                    axios.get('http://192.168.43.7:4001/user_id?id='+phone)
                    .then(res => {
                        SecureStore.setItemAsync("user_id", res.data.data.devices.user_id+'')
                        .then(_ => {
                            navigation.navigate('Main')
                            clearInterval(interv);
                        })
                        .catch(e => {
                            //console.log(e)
                            can_req = true
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        can_req = true;
                    })
                }
            })
            
        }) 
        .catch(err => {
            console.error(err);
        }, 1000)       
    }

    return(
        <View style={styles.container}>
            <Image style={styles.img} source={require("../assets/images/register/bubbles.png")}/>
            <View style={styles.top_view}>
                <Text style={styles.text}>Connect to the braclet</Text>
                <Image source={require("../assets/images/connect/watch.png")}/>
                <View style={styles.view2}>
                    {
                        !loading ? 
                        <TouchableHighlight style={styles.btn} onPress={() => connectToBraclet()}>
                            <Text style={styles.textBtn}>Connect</Text>
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
        fontSize: 30
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