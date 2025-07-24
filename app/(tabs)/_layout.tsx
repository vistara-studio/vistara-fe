import React from 'react';
import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null, // Menghilangkan label
          }}
        />
        
        <Tabs.Screen
          name="localconnect"
          options={{
            headerShown: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null, // Menghilangkan label
          }}
        />

        {/* Smart Planner Tab */}
        <Tabs.Screen
          name="smartplanner"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="location-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />

        <Tabs.Screen
          name="nusalingo"
          options={{
            headerShown: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
            tabBarLabel: () => null,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};

export default TabLayout;