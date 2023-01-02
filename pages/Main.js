import * as React from 'react';
import { View, Text, Image, Pressable, ScrollView, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import camp from '../assets/images/main/pressedcambtn.png'
import cam from '../assets/images/main/cambtn.png';
import io from "socket.io-client";

export default function Main({navigation}) {
    const [name, setName] = React.useState('');
    const [camPressed, setCamPressed] = React.useState(false);
    const [sleepTime, setSleepTime] = React.useState(0);
    const [heartBeat, setHeartBeat] = React.useState(0);
    const [bodyTemp, setBodyTemp] = React.useState(0)
    const [dangerMsg, setDangerMsg] = React.useState('');
    const [danger, setDanger] = React.useState(false);
    React.useEffect(() => {
        SecureStore.getItemAsync("register_name")
        .then(name => {
            if(name) {
                setName(name)
            }
        })

        const socket = io("http://192.168.43.7:4001");
        socket.on('heart_data', data => {
            const d = parseInt(data);
            console.log(d);
            setHeartBeat(d)
        })

        socket.on('temperature_data', data => {
            const d = (Math.round(data * 100) / 100).toFixed(2);
            setBodyTemp(d)
        })

        socket.on('sleep', data => {
            const d = parseInt(data);
            console.log(d);
            setSleepTime(d)
        })

        socket.on('danger', data => {
            setDanger(true)
            if(Object.keys(data).includes("temp")){
                if(data["temp"] === "lr"){
                    setDangerMsg(`CAREFUL!! The baby's body Temperature is too low!`);
                }
                else 
                {
                    setDangerMsg(`CAREFUL!! The baby's body Temperature is too high!`);
                }
            }

            if(Object.keys(data).includes("temp")){
                if(data["temp"] === "lr"){
                    setDangerMsg(`CAREFUL!! The baby's heartbeat is too low!`);
                }
                else 
                {
                    setDangerMsg(`CAREFUL!! The baby's heartbeat is too high!`);
                }
            }
        })

        socket.on('flipped', () => {
            setDangerMsg("CAREFUL!! The baby may be flipped, RUN AND CHECK!");
            setDanger(true)
        })
    }, [])
    
    return (
        <View style={{flex: 1}}>
            <Image style={{position: 'absolute'}} source={require('../assets/images/main/header.png')}/>
            {
                danger ? 
                <Pressable onPress={() => {
                    setDangerMsg("")
                    setDanger(false)
                }}
                    style={{
                        position: 'absolute',
                        flex: 1,
                        zIndex: 99,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        width: '100%',
                        height: '100%',
                        alignContent: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image style={{width: '100%'}} source={require('../assets/images/main/danger.png')}/>
                    <Text
                        style={{
                            fontSize: 19,
                            position: 'absolute',
                            width: '80%',
                            textAlign: 'center',
                            alignSelf: 'center',
                            paddingTop: 50,
                            fontWeight: 'bold'
                        }}
                    >
                        {dangerMsg}
                    </Text>
                </Pressable>
                :
                null
            }
            <View style={{marginTop: 105, flexDirection: 'row', paddingHorizontal: 15}}>
                <Text style ={{fontSize: 25}}>Hey </Text>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 25 
                }}>{name} 👋!</Text>
            </View>
            <Text style ={{fontSize: 25, paddingHorizontal: 15}}>
                Check on your baby 
            </Text>
            
            <Pressable style={{marginTop: 15}} onPress={() => navigation.navigate('Camera')} onPressIn={() => setCamPressed(true)} onPressOut={() => setCamPressed(false)}>
                <Image source={camPressed ? camp : cam}/>
            </Pressable>

            <View style={{
                paddingHorizontal: 15
            }}>
                <Text style ={{fontSize: 25}}>
                    Room conditions
                </Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View>
                        <Image resizeMode="contain" style={{ width: 160 }} source={require('../assets/images/main/room_temp.png')}/>
                    </View>
                    <View>
                        <Image resizeMode="contain" style={{ width: 160}} source={require('../assets/images/main/sleeping.png')}/>
                        <Text style={{color: 'white', position: 'absolute', top: 110, left: 21, fontSize: 25, fontWeight: 'bold'}}>{sleepTime} hr</Text>
                    </View>
                </View>

                <Text style ={{fontSize: 25}}>
                    Baby's vital signs
                </Text>

                <ScrollView horizontal={true} style={{flexDirection: 'row', marginTop: 25}}>
                    <View>
                        <Image resizeMode="contain" style={{ width: 160}} source={require('../assets/images/main/heart.png')}/>
                        <View style={{flexDirection: 'row', position: 'absolute', top: 65, right: 55}}>
                            <Text style={{fontSize: 25, fontWeight: 'bold'}}>{heartBeat} </Text>
                        </View>
                    </View>

                    <View>
                        <Image resizeMode="contain" style={{ width: 160}} source={require('../assets/images/main/body_temp.png')}/>
                        <View style={{flexDirection: 'row', position: 'absolute', top: 65, right: 50}}>
                            <Text style={{fontSize: 25, fontWeight: 'bold'}}>{bodyTemp}</Text>
                        </View>
                    </View>
                    
                    <View>
                        <Image resizeMode="contain" style={{ width: 160}} source={require('../assets/images/main/hydr.png')}/>
                        <View style={{flexDirection: 'row', position: 'absolute', top: 65, right: 72}}>
                            <Text style={{fontSize: 25, fontWeight: 'bold'}}>{0}</Text>
                        </View>
                    </View>

                    <View>
                        <Image resizeMode="contain" style={{ width: 160}} source={require('../assets/images/main/breath.png')}/>
                        <View style={{flexDirection: 'row', position: 'absolute', top: 65, right: 70}}>
                            <Text style={{fontSize: 25, fontWeight: 'bold'}}>{0}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <Image resizeMode="contain" style={{ width: "100%", position: 'absolute', bottom: 0}} source={require('../assets/images/main/navbar.png')}/>
        </View>
    )
}