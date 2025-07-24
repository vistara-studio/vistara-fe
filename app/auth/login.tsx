import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome } from "@expo/vector-icons"
import { AntDesign } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import * as Linking from "expo-linking"

// Static credentials untuk testing
const STATIC_CREDENTIALS = {
  email: 'wewe@example.com',
  password: 'Nickolas001'
}

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleAuthInProgress, setIsGoogleAuthInProgress] = useState(false)

  // Validasi email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Handle login dengan static credentials
  const handleLogin = async () => {
    // Reset errors
    setEmailError('')
    setPasswordError('')

    // Validasi input
    if (!email.trim()) {
      setEmailError('Email tidak boleh kosong')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Format email tidak valid')
      return
    }

    if (!password.trim()) {
      setPasswordError('Kata sandi tidak boleh kosong')
      return
    }

    if (password.length < 6) {
      setPasswordError('Kata sandi minimal 6 karakter')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulasi delay untuk loading state
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Cek static credentials
      if (email === STATIC_CREDENTIALS.email && password === STATIC_CREDENTIALS.password) {
        // Simpan session ke AsyncStorage
        await AsyncStorage.setItem('userToken', 'static-token-123')
        await AsyncStorage.setItem('userEmail', email)
        
        Alert.alert('Berhasil', 'Login berhasil!', [
          {
            text: 'OK',
            onPress: () => {
              
              router.replace('/')
            }
          }
        ])
      } else {
        Alert.alert('Error', 'Email atau kata sandi salah!\n\nGunakan:\nEmail: admin@example.com\nPassword: password123')
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat login')
    } finally {
      setIsSubmitting(false)
    }
  }
    

  return (
     <View className="">
      <SafeAreaView className="px-10 ">
        <View className="mt-10 pt-20 flex flex-col items-center justify-center w-full">
          <Text className="text-[#10367D] text-3xl font-bold ">Welcome Back!</Text>
        </View>

        <View className="mt-8">
          <Text className="text-gray-800 mb-2">Email</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik email di sini"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (emailError) setEmailError("")
              }}
            />
            <View className="absolute left-3 top-4">
              <FontAwesome name="envelope-o" size={18} color="#999" />
            </View>
          </View>
          {emailError ? <Text className="text-red-500 text-xs mt-1">{emailError}</Text> : null}
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Kata Sandi</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik kata sandi di sini"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text)
                if (passwordError) setPasswordError("") // Reset password error on change
              }}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="lock" size={18} color="#999" />
            </View>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-3 top-4">
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text className="text-red-500 text-xs mt-1">{passwordError}</Text> : null}
        </View>

        <TouchableOpacity
          className="bg-[#10367D] rounded-lg py-4 items-center mt-8"
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold">{isSubmitting ? "Masuk..." : "Masuk"}</Text>
        </TouchableOpacity>

        <TouchableOpacity className='flex items-center justify-center mt-4'>
          <Text className="mx-4 text-[#10367D] font-bold">Forget Password?</Text>
        </TouchableOpacity>

          <TouchableOpacity
          className="bg-white rounded-lg py-4 mt-5  border border-gray-300 flex-row items-center justify-center"
        >
          <View className="mr-3 ">
            <FontAwesome name="google" size={18} color="#4285F4" />
          </View>
          <Text className="text-gray-700">{isGoogleAuthInProgress ? "Menghubungkan..." : "Masuk dengan Google"}</Text>
        </TouchableOpacity>


        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-700">You dont have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text className="font-bold text-[#10367D]">Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" />
    </View>
  )
}

export default Login
