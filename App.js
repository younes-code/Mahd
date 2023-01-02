import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './pages/HomeScreen';
import HomeScreen2 from './pages/HomeScreen2';
import HomeScreen3 from './pages/HomeScreen3';
import AddPhone from './pages/AddPhone';
import AddName from './pages/AddName';
import PickGender from './pages/PickGender';
import BDay from './pages/BDay';
import Connect from './pages/Connect';
import Main from './pages/Main';
import AddBabysName from './pages/AddBabysName';
import Camera from './pages/Camera';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="Home2" component={HomeScreen2} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="Home3" component={HomeScreen3} />
        <Stack.Screen options={{headerShown: false }} name="AddPhone" component={AddPhone} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="AddName" component={AddName} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="AddBabysName" component={AddBabysName} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="PickGender" component={PickGender} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="BDay" component={BDay} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="Connect" component={Connect} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="Main" component={Main} />
        <Stack.Screen options={{headerShown: false, animation: "slide_from_right"}} name="Camera" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
