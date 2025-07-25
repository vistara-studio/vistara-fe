import React from 'react'
import { useState, useEffect } from "react"
import { Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons"
import * as Linking from "expo-linking"
import { authService, RegisterRequest } from "../../services/authService"


const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: ""
  })
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleAuthInProgress, setIsGoogleAuthInProgress] = useState(false)

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const validateForm = () => {
    const newErrors = {
      full_name: "",
      email: "",
      password: "",
      confirm_password: ""
    }

    // Validate full name
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Nama lengkap wajib diisi"
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password wajib diisi"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password minimal 6 karakter"
    }

    // Validate confirm password
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Konfirmasi password wajib diisi"
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Password tidak cocok"
    }

    setErrors(newErrors)
    return Object.values(newErrors).every(error => error === "")
  }

  // API call for registration using service
  const handleRegister = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await authService.register(formData)
      
      // Registration successful
      Alert.alert(
        "Pendaftaran Berhasil",
        result.message || "Akun Anda telah berhasil dibuat. Silakan login.",
        [
          {
            text: "OK",
            onPress: () => router.push("/auth/login")
          }
        ]
      )
    } catch (error: any) {
      Alert.alert(
        "Pendaftaran Gagal",
        error.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
        [{ text: "OK" }]
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleAuthInProgress(true)
    // TODO: Implement Google Sign Up
    setTimeout(() => {
      setIsGoogleAuthInProgress(false)
      Alert.alert("Info", "Google Sign Up akan segera tersedia")
    }, 2000)
  }

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }
  return (
    <>
      <SafeAreaView className="flex-1 px-10">
        <View className="mt-10 pt-10">
          <Text className="text-[#10367D] text-3xl font-bold">Daftar Akun</Text>
          <Text className="text-[#10367D] mt-2">Mohon isikan data diri kamu dengan benar</Text>
        </View>

        <View className="mt-8">
          <Text className="text-gray-800 mb-2">Nama</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik nama di sini"
              placeholderTextColor="#999"
              value={formData.full_name}
              onChangeText={(text) => updateFormData('full_name', text)}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="user" size={18} color="#999" />
            </View>
          </View>
          {errors.full_name ? <Text className="text-red-500 text-xs mt-1">{errors.full_name}</Text> : null}
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Email</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik email di sini"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
            />
            <View className="absolute left-3 top-4">
              <FontAwesome name="envelope-o" size={18} color="#999" />
            </View>
          </View>
          {errors.email ? <Text className="text-red-500 text-xs mt-1">{errors.email}</Text> : null}
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Kata Sandi</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 pr-12 text-gray-700 bg-white"
              placeholder="Ketik kata sandi di sini"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="lock" size={18} color="#999" />
            </View>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-3 top-4">
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text className="text-red-500 text-xs mt-1">{errors.password}</Text> : null}
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Konfirmasi Kata Sandi</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 pr-12 text-gray-700 bg-white"
              placeholder="Ketik kata sandi di sini"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirm_password}
              onChangeText={(text) => updateFormData('confirm_password', text)}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="lock" size={18} color="#999" />
            </View>
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-4"
            >
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {errors.confirm_password ? <Text className="text-red-500 text-xs mt-1">{errors.confirm_password}</Text> : null}
        </View>

        <TouchableOpacity
          className={`rounded-lg py-4 items-center mt-8 ${isSubmitting ? 'bg-gray-400' : 'bg-[#10367D]'}`}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold">
            {isSubmitting ? "Mendaftar..." : "Register"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center my-6">
          <View className="border-t border-gray-300 flex-1"></View>
          <Text className="mx-4 text-gray-500">Atau</Text>
          <View className="border-t border-gray-300 flex-1"></View>
        </View>

        <TouchableOpacity
          className={`rounded-lg py-4 border border-gray-300 flex-row items-center justify-center ${isGoogleAuthInProgress ? 'bg-gray-100' : 'bg-white'}`}
          onPress={handleGoogleSignUp}
          disabled={isGoogleAuthInProgress}
        >
          <View className="mr-2">
            <FontAwesome name="google" size={18} color="#4285F4" />
          </View>
          <Text className="text-gray-700">{isGoogleAuthInProgress ? "Menghubungkan..." : "Daftar dengan Google"}</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-700">Already Have An Account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="font-bold text-[#10367D]">Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" />
      </>
  )
}

export default Register
