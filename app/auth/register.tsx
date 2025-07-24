import React from 'react'
import { useState, useEffect } from "react"
import { Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native"
import { router } from "expo-router"
// import { registerUser } from "../../services/api"
// import { validateEmail, validatePassword, validateUsername } from "../../utils/validation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons"
// import * as WebBrowser from "expo-web-browser"
import * as Linking from "expo-linking"


const Register = () => {
  return (
    <>
      <SafeAreaView className="flex-1 p-10">
        <View className="mt-10 pt-10">
          <Text className="text-[#FF6347] text-3xl font-bold">Daftar Akun</Text>
          <Text className="text-[#FF6347] mt-2">Mohon isikan data diri kamu dengan benar</Text>
        </View>

        <View className="mt-8">
          <Text className="text-gray-800 mb-2">Nama</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik nama di sini"
              placeholderTextColor="#999"
            //   value={name}
            //   onChangeText={(text) => {
            //     setName(text)
            //     if (nameError) setNameError("")
            //   }}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="user" size={18} color="#999" />
            </View>
          </View>
          {/* {nameError ? <Text className="text-red-500 text-xs mt-1">{nameError}</Text> : null} */}
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
            //   value={email}
            //   onChangeText={(text) => {
            //     setEmail(text)
            //     if (emailError) setEmailError("")
            //   }}
            />
            <View className="absolute left-3 top-4">
              <FontAwesome name="envelope-o" size={18} color="#999" />
            </View>
          </View>
          {/* {emailError ? <Text className="text-red-500 text-xs mt-1">{emailError}</Text> : null} */}
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Kata Sandi</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik kata sandi di sini"
              placeholderTextColor="#999"
            //   secureTextEntry={!showPassword}
            //   value={password}
            //   onChangeText={(text) => {
            //     setPassword(text)
            //     if (passwordError) setPasswordError("")
            //   }}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="lock" size={18} color="#999" />
            </View>
            {/* <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-3 top-4">
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
            </TouchableOpacity> */}
          </View>
          {/* {passwordError ? <Text className="text-red-500 text-xs mt-1">{passwordError}</Text> : null} */}
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Konfirmasi Kata Sandi</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik kata sandi di sini"
              placeholderTextColor="#999"
            //   secureTextEntry={!showConfirmPassword}
            //   value={confirmPassword}
            //   onChangeText={(text) => {
            //     setConfirmPassword(text)
            //     if (confirmPasswordError) setConfirmPasswordError("")
            //   }}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="lock" size={18} color="#999" />
            </View>
            <TouchableOpacity
            //   onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-4"
            >
              {/* <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" /> */}
            </TouchableOpacity>
          </View>
          {/* {confirmPasswordError ? <Text className="text-red-500 text-xs mt-1">{confirmPasswordError}</Text> : null} */}
        </View>

        <TouchableOpacity
          className="bg-[#FFA69E] rounded-lg py-4 items-center mt-8"
        //   onPress={handleRegister}
        //   disabled={isSubmitting}
        >
          {/* <Text className="text-white font-bold">{isSubmitting ? "Mendaftar..." : "Daftar"}</Text> */}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center my-6">
          <View className="border-t border-gray-300 flex-1"></View>
          <Text className="mx-4 text-gray-500">Atau</Text>
          <View className="border-t border-gray-300 flex-1"></View>
        </View>

        <TouchableOpacity
          className="bg-white rounded-lg py-4 border border-gray-300 flex-row items-center justify-center"
        //   onPress={handleGoogleSignUp}
        //   disabled={isGoogleAuthInProgress}
        >
          <View className="mr-2">
            <FontAwesome name="google" size={18} color="#4285F4" />
          </View>
          {/* <Text className="text-gray-700">{isGoogleAuthInProgress ? "Menghubungkan..." : "Daftar dengan Google"}</Text> */}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-700">Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="font-bold text-[#FF6347]">Masuk</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" />
      </>
  )
}

export default Register
