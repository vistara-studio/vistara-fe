"use client"
import { View, Text, TouchableOpacity, StatusBar, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect } from "react"

export default function Success() {
  const params = useLocalSearchParams()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(tabs)/home")
    }, 10000) // 10 detik

    // Cleanup timer jika component unmount
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? Number.parseInt(amount) : amount
    return `Rp ${numAmount.toLocaleString("id-ID")}`
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity
            className="absolute top-20 left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

      {/* Status Bar Area */}
      <View className="h-12" />

      <View className="flex-1 px-5">
        {/* Success Icon and Text */}
        <View className="items-center mt-16 mb-8">
          <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark" size={20} color="white" />
          </View>

          <Text className="text-xl font-semibold text-gray-900 mb-2">Booking Successful</Text>

          <Text className="text-gray-500 text-sm mb-1">Booking confirmed!</Text>

          <Text className="text-gray-900 font-medium text-sm">
            {params.eventName || "Budaya Nusantara"} Entrance Ticket
          </Text>
        </View>

        {/* Invoice Section */}
        <View className="bg-gray-100 rounded-xl p-5">
          <Text className="text-lg font-semibold text-gray-900 mb-6">Invoice</Text>

          <View className="space-y-4">
            {/* Ticket Info */}
            <View>
              <Text className="text-xs text-gray-500 mb-1">Ticket Info</Text>
              <Text className="text-sm font-medium text-gray-900">{params.eventName || "Budaya Nusantara"}</Text>
            </View>

            {/* Date */}
            <View>
              <Text className="text-xs text-gray-500 mb-1">Date</Text>
              <Text className="text-sm font-medium text-gray-900">{params.date || "19 September 2025"}</Text>
            </View>

            {/* Guest */}
            <View>
              <Text className="text-xs text-gray-500 mb-1">Guest</Text>
              <Text className="text-sm font-medium text-gray-900">{params.quantity || "1"} Adults</Text>
            </View>
          </View>

          {/* Barcode */}
          <View className="items-center mt-6">
            <View className="bg-white p-2 rounded-lg w-full">
              <Image
                source={require("../../assets/Barcode.png")}
                className="w-full h-15"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
