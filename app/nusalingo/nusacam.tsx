"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"

interface NusaLingoCameraProps {
  onBack: () => void
}

export default function NusaLingoCamera({ onBack }: NusaLingoCameraProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [type, setType] = useState<CameraType>('back')
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off')
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const cameraRef = useRef<CameraView>(null)

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [])

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        })

        if (photo?.uri) {
          setImageUri(photo.uri)
          analyzeImage(photo.uri)
        }
      } catch (error) {
        console.error("Error taking picture:", error)
        Alert.alert("Error", "Failed to take picture. Please try again.")
      }
    }
  }

  const analyzeImage = async (uri: string) => {
    try {
      setIsAnalyzing(true)

      // Simulate OCR text extraction
      setTimeout(() => {
        const mockExtractedText = "Selamat pagi, bagaimana kabar Anda hari ini?"
        setExtractedText(mockExtractedText)

        // Simulate translation
        setTimeout(() => {
          const mockTranslation = "Good morning, how are you today?"
          setTranslatedText(mockTranslation)
          setIsAnalyzing(false)
        }, 1500)
      }, 2000)
    } catch (error) {
      console.error("Error analyzing image:", error)
      setIsAnalyzing(false)
      Alert.alert("Error", "Failed to analyze image. Please try again.")
    }
  }

  const retakePicture = () => {
    setImageUri(null)
    setExtractedText(null)
    setTranslatedText(null)
    setIsAnalyzing(false)
  }

  const saveTranslation = () => {
    if (extractedText && translatedText) {
      Alert.alert("Success", "Translation saved to history!")
      onBack()
    }
  }

  const toggleCameraType = () => {
    setType((current) => (current === 'back' ? 'front' : 'back'))
  }

  const toggleFlash = () => {
    setFlashMode((current) => {
      switch (current) {
        case 'off':
          return 'on'
        case 'on':
          return 'auto'
        case 'auto':
          return 'off'
        default:
          return 'off'
      }
    })
  }

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on':
        return "flash"
      case 'auto':
        return "flash-outline"
      case 'off':
      default:
        return "flash-off"
    }
  }

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Requesting camera permission...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <Ionicons name="camera" size={64} color="#6b7280" />
        <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">Camera Permission Required</Text>
        <Text className="text-gray-600 text-center mb-6">
          Please grant camera permission to scan and translate text from images.
        </Text>
        <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-lg" onPress={requestPermission}>
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-black/20 absolute top-0 left-0 right-0 z-10" style={{ paddingTop: 30 }}>
        <TouchableOpacity className="p-2" onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">Nusalingo</Text>
        <View className="w-10" />
      </View>

      {!imageUri ? (
        /* Camera View */
        <View className="flex-1">
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={type}
            flash={flashMode}
            onCameraReady={() => setIsCameraReady(true)}
          >
            {/* Camera Controls Overlay */}
            <View className="flex-1 justify-between">
              {/* Top Controls */}
              <View className="flex-row justify-between items-center px-6 pt-20">
                <TouchableOpacity className="bg-black/30 rounded-full p-3" onPress={toggleFlash}>
                  <Ionicons name={getFlashIcon()} size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity className="bg-black/30 rounded-full p-3" onPress={toggleCameraType}>
                  <Ionicons name="camera-reverse" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Center Guide */}
              <View className="flex-1 justify-center items-center px-8">
                <View className="border-2 border-white/50 border-dashed rounded-2xl w-full h-48 justify-center items-center">
                  <Ionicons name="document-text-outline" size={48} color="white" />
                  <Text className="text-white mt-2 text-center">Position text within this frame</Text>
                </View>
              </View>

              {/* Bottom Controls */}
              <View className="flex-row justify-center items-center pb-8">
                <TouchableOpacity
                  className={`w-20 h-20 rounded-full border-4 border-white justify-center items-center ${
                    isCameraReady ? "bg-white/20" : "bg-gray-500/50"
                  }`}
                  onPress={takePicture}
                  disabled={!isCameraReady}
                >
                  <View className="w-16 h-16 bg-white rounded-full" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      ) : (
        /* Analysis View */
        <View className="flex-1 bg-gray-50">
          <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

          <View className="flex-1 px-4 py-6">
            {/* Captured Image */}
            <View className="bg-white rounded-2xl p-4 mb-4 mt-20">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Captured Image</Text>
              <Image source={{ uri: imageUri }} className="w-full h-48 rounded-lg" resizeMode="cover" />
            </View>

            {/* Extracted Text */}
            <View className="bg-white rounded-2xl p-4 mb-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Extracted Text</Text>
              {isAnalyzing ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text className="ml-2 text-gray-600">Extracting text...</Text>
                </View>
              ) : extractedText ? (
                <Text className="text-gray-700">{extractedText}</Text>
              ) : (
                <Text className="text-gray-400">No text extracted</Text>
              )}
            </View>

            {/* Translation */}
            <View className="bg-white rounded-2xl p-4 mb-6 flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Translation</Text>
              {isAnalyzing ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text className="ml-2 text-gray-600">Translating...</Text>
                </View>
              ) : translatedText ? (
                <Text className="text-gray-700">{translatedText}</Text>
              ) : (
                <Text className="text-gray-400">Translation will appear here</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="flex-1 bg-gray-200 py-4 rounded-2xl flex-row justify-center items-center"
                onPress={retakePicture}
              >
                <Ionicons name="camera" size={20} color="#6b7280" />
                <Text className="ml-2 text-gray-700 font-semibold">Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 py-4 rounded-2xl flex-row justify-center items-center ${
                  translatedText ? "bg-blue-600" : "bg-gray-300"
                }`}
                onPress={saveTranslation}
                disabled={!translatedText}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text className="ml-2 text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
