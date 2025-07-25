"use client"

import React, { useEffect, useRef } from "react"
import { View, Text, Animated } from "react-native"

interface InlineLoadingProps {
  message?: string
  size?: "small" | "medium" | "large"
  color?: string
}

// Simple animated loading bar component
const AnimatedLoadingBar = ({ 
  width, 
  height, 
  backgroundColor, 
  progressColor, 
  duration 
}: {
  width: number
  height: number
  backgroundColor: string
  progressColor: string
  duration: number
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(0)
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start(() => animate())
    }
    animate()
  }, [animatedValue, duration])

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View
      style={{
        width,
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          width: progressWidth,
          height: '100%',
          backgroundColor: progressColor,
          borderRadius: height / 2,
        }}
      />
    </View>
  )
}

interface InlineLoadingProps {
  message?: string
  size?: "small" | "medium" | "large"
  color?: string
}

export default function InlineLoading({
  message = "Processing...",
  size = "medium",
  color = "#3b82f6",
}: InlineLoadingProps) {
  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return { width: 80, height: 4, textSize: "text-sm" }
      case "large":
        return { width: 160, height: 8, textSize: "text-lg" }
      default:
        return { width: 120, height: 6, textSize: "text-base" }
    }
  }

  const { width, height, textSize } = getSizeConfig()

  return (
    <View className="items-center py-4">
      <AnimatedLoadingBar
        width={width}
        height={height}
        backgroundColor="#f3f4f6"
        progressColor={color}
        duration={1000}
      />
      {message && <Text className={`text-gray-600 mt-3 ${textSize}`}>{message}</Text>}
    </View>
  )
}
