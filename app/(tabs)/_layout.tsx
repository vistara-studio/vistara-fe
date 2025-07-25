import React from 'react';
import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const TabLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerTitleStyle: { fontWeight: "normal" },
          headerTitleAlign: "center",
          tabBarActiveTintColor: "#10367D",
          tabBarInactiveTintColor: "#898D9E",
          tabBarStyle: {
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, size }) => (
             <Image source={require("../../assets/HomeNav.png")} style={{ width: size, height: size, tintColor: focused ? '#10367D' : '#808080'}} />
            ),
            tabBarLabel: () => null, // Menghilangkan label
          }}
        />
        
        <Tabs.Screen
          name="localconnect"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, size }) => (
              <Image source={require("../../assets/LocalNav.png")} style={{ width: size, height: size, tintColor: focused ? '#10367D' : '#808080'}} />
            ),
            tabBarLabel: () => null, // Menghilangkan label
          }}
        />

        {/* Smart Planner Tab */}
        <Tabs.Screen
          name="smartplanner"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, size }) => (
              <Image source={require("../../assets/SmartNav.png")} style={{ width: size, height: size, tintColor: focused ? '#10367D' : '#808080'}} />
            ),
            tabBarLabel: () => null,
          }}
        />

        <Tabs.Screen
          name="NusaLingo"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, size }) => (
              <Image source={require("../../assets/NusaLingoNav.png")} style={{ width: size, height: size, tintColor: focused ? '#10367D' : '#808080'}} />
            ),
            tabBarLabel: () => null,
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            headerShown: true,
            tabBarIcon: ({ focused, size }) => (
               <Image source={require("../../assets/ProfileNav.png")} style={{ width: size, height: size, tintColor: focused ? '#10367D' : '#808080'}} />
            ),
            tabBarLabel: () => null,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};

export default TabLayout;