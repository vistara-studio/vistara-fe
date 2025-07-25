import { StyleSheet, View, Text, useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "../constants/color";

const RootLayout = () => {
  const colorSchema = useColorScheme();
  const theme = Colors[colorSchema] ?? Colors.light;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTintColor: theme.title,
        headerTitleStyle: { fontWeight: "semibold" },
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "index", headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ title: "Tabs", headerShown: false }}
      />
      <Stack.Screen
        name="auth/login"
        options={{
          title: "Login",
          headerStyle: { backgroundColor: "#10367D" }, 
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="auth/register"
        options={{
          title: "Register",
          headerStyle: { backgroundColor: "#10367D" }, 
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="localconnect/localdetail"
        options={{ title: "Detail" }}
      />
      <Stack.Screen
        name="localconnect/localbooking"
        options={{ title: "Checkout" }}
      />
      <Stack.Screen
        name="smartplanner/smartinput"
        options={{ title: "Smart Planner" }}
      />
      <Stack.Screen
        name="smartplanner/smartoutput"
        options={{ title: "Smart Planner" }}
      />
      <Stack.Screen
        name="destinationexplorer/recommendation"
        options={{ title: "Recommendation" }}
      />
      <Stack.Screen
        name="destinationexplorer/detaildestination"
        options={{ title: "Detail Destination",headerShown: false }}
        />
      <Stack.Screen
        name="destinationexplorer/checkoutdestination"
        options={{ title: "Checkout Destination",headerShown: false }}
      />
      <Stack.Screen
        name="destinationexplorer/successdestination"
        options={{ title: "Success Destination",headerShown: false }}
      />
      <Stack.Screen
        name="culture/culturedetail"
        options={{ title: "Culture Detail",headerShown: false }}
      />
    </Stack>
  );
};

export default RootLayout;
