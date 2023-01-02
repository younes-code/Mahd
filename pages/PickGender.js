import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Image, Pressable, TouchableHighlight } from 'react-native';
import * as SecureStore from 'expo-secure-store';
export default function PickGender({navigation}){
    const [loading, setLoading] = React.useState(false);
    const [gender, setGender] = React.useState(-1);
    const [name, setName] = React.useState('');
    React.useEffect(() => {
        SecureStore.getItemAsync("register_babys_name")
        .then(name => {
            if(name) {
                setName(name)
            }
        })
    }, [])
    async function addGender(){
        setLoading(true);
        SecureStore.setItemAsync("register_gender", gender+'')
        .then(_ => {
            setLoading(false)
            navigation.navigate('BDay')
        })
        .catch(e => {
            console.log(e)
            setLoading(false);
        });
    }

    function setGenderTo(m_gender) {
        setGender(m_gender === 'male' ? 1 : 0);
    }
    return(
        <View style={styles.container}>
            <Image style={styles.img} source={require("../assets/images/register/bubbles.png")}/>
            <View style={styles.top_view}>
                <Text style={styles.text}>{name} is ?</Text>
                <View style={{flexDirection: 'row'}}>
                    <Pressable onPress={() => setGenderTo('female')}>
                        <Image
                            resizeMode="contain"
                            source={require("../assets/images/gender/girl.png")}
                            style={{width: gender == 0 ? 200 : 150}}
                        />
                    </Pressable>

                    <Pressable onPress={() => setGenderTo('male')}>
                        <Image
                            resizeMode="contain"
                            source={require("../assets/images/gender/boy.png")}
                            style={{width: gender == 1 ? 200 : 150}}
                        />
                    </Pressable>
                </View>
                <View style={styles.view2}>
                    {
                        !loading ? 
                        <TouchableHighlight style={styles.btn} onPress={() => addGender()}>
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