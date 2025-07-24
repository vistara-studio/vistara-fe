"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface VoiceMessage {
  id: string
  isUser: boolean
  duration: string
  timestamp: string
  isPlaying?: boolean
}

interface NusaLingoTapToSpeakProps {
  onBack: () => void
}

export default function NusaLingoTapToSpeak({ onBack }: NusaLingoTapToSpeakProps) {
  const [messages, setMessages] = useState<VoiceMessage[]>([
    { id: "1", isUser: false, duration: "00:00/00:32", timestamp: "4:56 pm" },
    { id: "2", isUser: true, duration: "00:00/00:32", timestamp: "4:56 pm" },
    { id: "3", isUser: false, duration: "00:00/00:32", timestamp: "4:56 pm" },
    { id: "4", isUser: true, duration: "00:00/00:32", timestamp: "4:56 pm" },
    { id: "5", isUser: false, duration: "00:00/00:32", timestamp: "4:56 pm" },
    { id: "6", isUser: true, duration: "00:00/00:32", timestamp: "4:56 pm" },
    { id: "7", isUser: false, duration: "00:00/00:32", timestamp: "4:56 pm" },
  ])
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const togglePlayback = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, isPlaying: !msg.isPlaying } : { ...msg, isPlaying: false },
      ),
    )
  }

  const startRecording = () => {
    setIsRecording(true)
    // Implement recording logic here
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Implement stop recording and send message logic here
  }

  const renderWaveform = () => {
    return (
      <View className="flex-row items-center space-x-1">
        {Array.from({ length: 30 }).map((_, index) => (
          <View
            key={index}
            className="bg-white/60 rounded-full"
            style={{
              width: 2,
              height: Math.random() * 20 + 8,
            }}
          />
        ))}
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-5 bg-white">
        <TouchableOpacity className="p-2" onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Nusalingo</Text>
        <View className="w-10" />
      </View>

      {/* Messages */}
      <ScrollView ref={scrollViewRef} className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {messages.map((message, index) => (
          <View key={message.id} className={`mb-4 ${message.isUser ? "items-end" : "items-start"}`}>
            <View className={`max-w-[80%] rounded-2xl p-4 ${message.isUser ? "bg-blue-600" : "bg-blue-400"}`}>
              <View className="flex-row items-center space-x-3">
                <TouchableOpacity
                  className="bg-white/20 rounded-full w-8 h-8 items-center justify-center"
                  onPress={() => togglePlayback(message.id)}
                >
                  {message.isPlaying ? (
                    <Ionicons name="pause" size={16} color="white" />
                  ) : (
                    <Ionicons name="play" size={16} color="white" />
                  )}
                </TouchableOpacity>

                <View className="flex-1">
                  {renderWaveform()}
                  <Text className="text-white/80 text-xs mt-1">{message.duration}</Text>
                </View>
              </View>
            </View>

            <Text className="text-xs text-gray-500 mt-1 mx-2">{message.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity className="p-2">
            <Ionicons name="attach" size={24} color="#6b7280" />
          </TouchableOpacity>

          <View className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <TextInput
              className="text-gray-700"
              placeholder="Type your message here..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>

          <TouchableOpacity className="p-2">
            <Ionicons name="camera" size={24} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-3 rounded-full ${isRecording ? "bg-red-500" : "bg-blue-600"}`}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Ionicons name="mic" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
