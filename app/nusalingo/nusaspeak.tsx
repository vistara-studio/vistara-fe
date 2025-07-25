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
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingTimer, setRecordingTimer] = useState<any>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  const togglePlayback = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, isPlaying: !msg.isPlaying } : { ...msg, isPlaying: false },
      ),
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)
    
    // Start timer untuk menghitung durasi recording
    const timer = setInterval(() => {
      setRecordingDuration(prev => prev + 1)
    }, 1000)
    
    setRecordingTimer(timer)
    
    // TODO: Implement actual recording logic here
    console.log("🎤 Recording started...")
  }

  const stopRecording = () => {
    setIsRecording(false)
    
    // Clear timer
    if (recordingTimer) {
      clearInterval(recordingTimer)
      setRecordingTimer(null)
    }
    
    // Jika durasi recording lebih dari 1 detik, tambahkan ke messages
    if (recordingDuration > 0) {
      const newMessage: VoiceMessage = {
        id: Date.now().toString(),
        isUser: true,
        duration: `00:00/${formatDuration(recordingDuration)}`,
        timestamp: getCurrentTime(),
        isPlaying: false
      }
      
      setMessages(prev => [...prev, newMessage])
      
      // Scroll ke bawah setelah menambah message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
      
      // Simulate AI response setelah 2 detik
      setTimeout(() => {
        const aiResponse: VoiceMessage = {
          id: (Date.now() + 1).toString(),
          isUser: false,
          duration: "00:00/00:28",
          timestamp: getCurrentTime(),
          isPlaying: false
        }
        setMessages(prev => [...prev, aiResponse])
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }, 100)
      }, 2000)
    }
    
    setRecordingDuration(0)
    
    // TODO: Implement actual stop recording and send message logic here
    console.log("🛑 Recording stopped and message sent!")
  }

  const sendTextMessage = () => {
    if (inputText.trim()) {
      // Convert text to voice message (simulation)
      const newMessage: VoiceMessage = {
        id: Date.now().toString(),
        isUser: true,
        duration: "00:00/00:15", // Simulated duration for text-to-speech
        timestamp: getCurrentTime(),
        isPlaying: false
      }
      
      setMessages(prev => [...prev, newMessage])
      setInputText("")
      
      // Scroll ke bawah
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: VoiceMessage = {
          id: (Date.now() + 1).toString(),
          isUser: false,
          duration: "00:00/00:22",
          timestamp: getCurrentTime(),
          isPlaying: false
        }
        setMessages(prev => [...prev, aiResponse])
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }, 100)
      }, 1500)
    }
  }

  const renderWaveform = () => {
    return (
      <View className="flex-row items-center justify-between flex-1" style={{ minWidth: 150 }}>
        {Array.from({ length: 25 }).map((_, index) => (
          <View
            key={index}
            className="bg-white/60 rounded-full"
            style={{
              width: 3,
              height: Math.random() * 18 + 6,
              marginHorizontal: 1,
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
            <View className={`min-w-[60%] max-w-[85%] rounded-2xl p-4 ${message.isUser ? "bg-blue-600" : "bg-blue-400"}`}>
              <View className="flex-row items-center space-x-3">
                <TouchableOpacity
                  className="bg-white/20 rounded-full w-8 h-8 items-center justify-center flex-shrink-0"
                  onPress={() => togglePlayback(message.id)}
                >
                  {message.isPlaying ? (
                    <Ionicons name="pause" size={16} color="white" />
                  ) : (
                    <Ionicons name="play" size={16} color="white" />
                  )}
                </TouchableOpacity>

                <View className="flex-1 min-w-0">
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
        {isRecording && (
          <View className="mb-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <View className="flex-row items-center justify-center space-x-2">
              <View className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <Text className="text-red-600 font-medium">Recording... {formatDuration(recordingDuration)}</Text>
            </View>
          </View>
        )}
        
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
              onSubmitEditing={sendTextMessage}
            />
          </View>

          <TouchableOpacity className="p-2">
            <Ionicons name="camera" size={24} color="#6b7280" />
          </TouchableOpacity>

          {inputText.trim() ? (
            <TouchableOpacity
              className="p-3 rounded-full bg-blue-600"
              onPress={sendTextMessage}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={`p-3 rounded-full ${isRecording ? "bg-red-500" : "bg-blue-600"}`}
              onPressIn={startRecording}
              onPressOut={stopRecording}
            >
              <Ionicons name="mic" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}
