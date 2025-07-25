import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome } from "@expo/vector-icons"
import { AntDesign } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import * as Linking from "expo-linking"
import { authService } from "../../services/authService"
import { tokenManager } from "../../utils/tokenManager"

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

  // Handle login dengan backend API (primary) dan improved error handling
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
      const response = await authService.login({
        email: email.trim(),
        password: password
      })
      // Handle backend response structure
      // Backend returns: { message: "login successful", payload: { token: "..." } }
      if (response.message === "login successful" && response.payload && response.payload.token) {
        
        // Simpan token dan user data menggunakan tokenManager
        await tokenManager.saveAuthData(
          response.payload.token,
          email,
          null // User data tidak tersedia dari response ini
        );
        
        Alert.alert('Berhasil', 'Login berhasil!', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/home')
            }
          }
        ])
        return
      } else if (response.success && response.data) {
        // Fallback untuk struktur response lain
        await tokenManager.saveAuthData(
          response.data.token,
          email,
          response.data.user
        );
        
        Alert.alert('Berhasil', 'Login berhasil!', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/')
            }
          }
        ])
        return
      } else {
        // Handle specific backend response errors
        let errorMessage = 'Login gagal. Silakan periksa email dan password Anda.'
        if (response.message && response.message !== "login successful") {
          errorMessage = response.message
        }
        
        Alert.alert('Login Gagal', errorMessage)
        return
      }
      
    } catch (apiError: any) {
      // Improved error handling based on error type
      let userMessage = 'Terjadi kesalahan saat login. Silakan coba lagi.'
      
      if (apiError.message.includes('Network') || apiError.message.includes('fetch')) {
        userMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      } else if (apiError.message.includes('401') || apiError.message.includes('Unauthorized')) {
        userMessage = 'Email atau password salah. Silakan periksa kembali.'
      } else if (apiError.message.includes('400') || apiError.message.includes('Bad Request')) {
        userMessage = 'Data yang dikirim tidak valid. Silakan periksa input Anda.'
      } else if (apiError.message.includes('500') || apiError.message.includes('Internal Server Error')) {
        userMessage = 'Terjadi kesalahan di server. Silakan coba beberapa saat lagi.'
      }
      
      // Show fallback option in development
      if (__DEV__) {
        Alert.alert(
          'Login Gagal', 
          `${userMessage}\n\n🔧 Mode Development:\nUntuk testing, gunakan:\nEmail: wewe@example.com\nPassword: Nickolas001`,
          [
            { text: 'OK' },
            {
              text: 'Coba Static',
              onPress: () => tryStaticLogin()
            }
          ]
        )
      } else {
        Alert.alert('Login Gagal', userMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Separate function for static login (development only)
  const tryStaticLogin = async () => {
    if (email === STATIC_CREDENTIALS.email && password === STATIC_CREDENTIALS.password) {
      try {
        // Simpan session menggunakan tokenManager (static)
        await tokenManager.saveAuthData('static-token-123', email);
        
        Alert.alert('Berhasil', 'Login berhasil (mode development)!', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/')
            }
          }
        ])
      } catch (error) {
        Alert.alert('Error', 'Gagal menyimpan session static')
      }
    } else {
      Alert.alert(
        'Static Login Gagal', 
        'Kredensial static tidak cocok.\n\nGunakan:\nEmail: wewe@example.com\nPassword: Nickolas001'
      )
    }
  }

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsGoogleAuthInProgress(true)
    try {
      // TODO: Implement Google Sign In with backend integration
      // For now, simulate Google login
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      Alert.alert(
        "Info", 
        "Google Sign In akan segera tersedia",
        [{ text: "OK" }]
      )
    } catch (error) {
      Alert.alert("Error", "Google Sign In gagal")
    } finally {
      setIsGoogleAuthInProgress(false)
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
                if (emailError) {
                  setEmailError("")
                }
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
                if (passwordError) {
                  setPasswordError("") // Reset password error on change
                }
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
          className={`rounded-lg py-4 items-center mt-8 ${isSubmitting ? 'bg-gray-400' : 'bg-[#10367D]'}`}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold">{isSubmitting ? "Masuk..." : "Masuk"}</Text>
        </TouchableOpacity>

        <TouchableOpacity className='flex items-center justify-center mt-4'>
          <Text className="mx-4 text-[#10367D] font-bold">Forget Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`rounded-lg py-4 mt-5 border border-gray-300 flex-row items-center justify-center ${isGoogleAuthInProgress ? 'bg-gray-100' : 'bg-white'}`}
          onPress={handleGoogleLogin}
          disabled={isGoogleAuthInProgress}
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
