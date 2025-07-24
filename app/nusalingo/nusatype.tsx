"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

interface NusaLingoTypeProps {
  onBack: () => void
}

export default function NusaLingoType({ onBack }: NusaLingoTypeProps) {
  const [sourceLanguage, setSourceLanguage] = useState("Indonesia")
  const [targetLanguage, setTargetLanguage] = useState("Javanese")
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)

  const swapLanguages = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)

    const tempText = sourceText
    setSourceText(translatedText)
    setTranslatedText(tempText)
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)
    // Simulate translation API call
    setTimeout(() => {
      setTranslatedText(`Translated: ${sourceText}`)
      setIsTranslating(false)
    }, 1000)
  }

  const speakText = (text: string) => {
    // Implement text-to-speech functionality
    console.log("Speaking:", text)
  }

  const copyText = (text: string) => {
    // Implement copy to clipboard
    console.log("Copied:", text)
  }

  const shareText = (text: string) => {
    // Implement share functionality
    console.log("Sharing:", text)
  }

  const favoriteTranslation = () => {
    // Implement favorite functionality
    console.log("Added to favorites")
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity className="p-2" onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Nusalingo</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-4 py-6">
        {/* Language Selector */}
        <View className="bg-white rounded-full p-1 mb-6 flex-row items-center">
          <View className="flex-1 bg-blue-600 rounded-full py-3 px-4">
            <Text className="text-white text-center font-medium">{sourceLanguage}</Text>
          </View>

          <TouchableOpacity className="px-3" onPress={swapLanguages}>
            <Ionicons name="swap-vertical" size={20} color="#6b7280" />
          </TouchableOpacity>

          <View className="flex-1 py-3 px-4">
            <Text className="text-gray-700 text-center font-medium">{targetLanguage}</Text>
          </View>
        </View>

        {/* Source Text Input */}
        <View className="bg-white rounded-2xl p-4 mb-4 min-h-[150px]">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-blue-600 font-semibold">{sourceLanguage}</Text>
            <TouchableOpacity onPress={() => speakText(sourceText)}>
              <Ionicons name="volume-high" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <TextInput
            className="flex-1 text-gray-700 text-base"
            placeholder="Enter the text to translate........."
            value={sourceText}
            onChangeText={setSourceText}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Translate Button */}
        <TouchableOpacity
          className={`bg-blue-600 rounded-2xl py-4 mb-4 ${isTranslating ? "opacity-50" : ""}`}
          onPress={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isTranslating ? "Translating..." : "Translate"}
          </Text>
        </TouchableOpacity>

        {/* Translated Text */}
        <View className="bg-white rounded-2xl p-4 min-h-[200px] flex-1">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-blue-600 font-semibold">{targetLanguage}</Text>
            <TouchableOpacity onPress={() => speakText(translatedText)}>
              <Ionicons name="volume-high" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <View className="flex-1">
            {translatedText ? (
              <Text className="text-gray-700 text-base">{translatedText}</Text>
            ) : (
              <Text className="text-gray-400 text-base">Enter the text to translate.........</Text>
            )}
          </View>

          {/* Action Buttons */}
          {translatedText && (
            <View className="flex-row justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
              <TouchableOpacity className="p-3" onPress={() => copyText(translatedText)}>
                <Ionicons name="copy" size={24} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity className="p-3" onPress={() => shareText(translatedText)}>
                <Ionicons name="share" size={24} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity className="p-3" onPress={favoriteTranslation}>
                <Ionicons name="star" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
