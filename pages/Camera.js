import * as React from 'react';
import { View, Image } from 'react-native';
import io from "socket.io-client";

export default function Camera() {
    const [frame, setFrame] = React.useState(null);
    React.useEffect(() => {
        const socket = io("http://192.168.43.7:4001");
        socket.on('image', data => {
            setFrame(data);
        })
    }, [])
    return(
        <View>
            <Image source={frame} style={{width: '100%', height: '100%'}} />
        </View>        
    )
}