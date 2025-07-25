"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import NusaLingoTapToSpeak from "../nusalingo/nusaspeak"
import NusaLingoType from "../nusalingo/nusatype"
import NusaLingoCamera from "../nusalingo/nusacam"

type Screen = "main" | "tapToSpeak" | "typeWord" | "scanImage"

const historyItems = [
  "Bahasa Batak dari saya mau makan ...",
  "Bahasa Batak dari saya mau makan ...",
  "Bahasa Batak dari saya mau makan ...",
  "Bahasa Batak dari saya mau makan ...",
]

export default function NusaLingoMainPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("main")

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const navigateBack = () => {
    setCurrentScreen("main")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "tapToSpeak":
        return <NusaLingoTapToSpeak onBack={navigateBack} />
      case "typeWord":
        return <NusaLingoType onBack={navigateBack} />
      case "scanImage":
        return <NusaLingoCamera onBack={navigateBack} />
      default:
        return renderMainScreen()
    }
  }

  const renderMainScreen = () => (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-5 bg-white">
        <TouchableOpacity className="p-2">
          <Ionicons name="arrow-back" size={24} color="#10367D" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-[#10367D]">NusaLingo</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row mb-6">
          {/* Tap to Speak - Large Card */}
          <TouchableOpacity
            className="flex-1 bg-blue-600 rounded-2xl p-6 mr-3 min-h-[200px] justify-between"
            onPress={() => navigateToScreen("tapToSpeak")}
          >
            <View className="bg-white/20 rounded-full w-12 h-12 items-center justify-center">
              <Ionicons name="volume-high" size={24} color="white" />
            </View>
            <View>
              <Text className="text-white text-xl font-semibold">Tap to</Text>
              <Text className="text-white text-xl font-semibold">Speak</Text>
            </View>
            <View className="self-end">
              <View className="bg-white/20 rounded-full w-8 h-8 items-center justify-center">
                <Ionicons
                  name="arrow-up-outline"
                  size={16}
                  color="white"
                  style={{ transform: [{ rotate: "45deg" }] }}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Column */}
          <View className="flex-1">
            {/* Type a Word */}
            <TouchableOpacity
              className="bg-blue-500 rounded-2xl p-4 mb-3 min-h-[95px] justify-between"
              onPress={() => navigateToScreen("typeWord")}
            >
              <View className="flex-row justify-between items-start">
                <View className="bg-white/20 rounded-full w-10 h-10 items-center justify-center">
                  <Ionicons name="chatbubble" size={20} color="white" />
                </View>
                <View className="bg-white/20 rounded-full w-6 h-6 items-center justify-center">
                  <Ionicons
                    name="arrow-up-outline"
                    size={12}
                    color="white"
                    style={{ transform: [{ rotate: "45deg" }] }}
                  />
                </View>
              </View>
              <Text className="text-white font-semibold">Type a Word</Text>
            </TouchableOpacity>

            {/* Scan Image Text */}
            <TouchableOpacity
              className="bg-blue-400 rounded-2xl p-4 min-h-[95px] justify-between"
              onPress={() => navigateToScreen("scanImage")}
            >
              <View className="flex-row justify-between items-start">
                <View className="bg-white/20 rounded-full w-10 h-10 items-center justify-center">
                  <Ionicons name="camera" size={20} color="white" />
                </View>
                <View className="bg-white/20 rounded-full w-6 h-6 items-center justify-center">
                  <Ionicons
                    name="arrow-up-outline"
                    size={12}
                    color="white"
                    style={{ transform: [{ rotate: "45deg" }] }}
                  />
                </View>
              </View>
              <View>
                <Text className="text-white font-semibold">Scan Image</Text>
                <Text className="text-white font-semibold">Text</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* History Section */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">History</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3 gap-4">
            {historyItems.map((item, index) => (
              <TouchableOpacity key={index} className="bg-blue-600 rounded-2xl p-4 flex-row items-center">
                <View className="bg-white/20 rounded-full w-10 h-10 items-center justify-center mr-3">
                  <Ionicons name="volume-high" size={20} color="white" />
                </View>
                <Text className="text-white font-medium flex-1">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )

  return <SafeAreaView className="flex-1 bg-white">{renderScreen()}</SafeAreaView>
}
