"use client"

import { useEffect } from "react"
import { View } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated"

interface AnimatedLoadingBarProps {
  width?: number
  height?: number
  backgroundColor?: string
  progressColor?: string
  duration?: number
}

export default function AnimatedLoadingBar({
  width = 120,
  height = 8,
  backgroundColor = "#1f2937",
  progressColor = "#3b82f6",
  duration = 1500,
}: AnimatedLoadingBarProps) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    )
  }, [duration])

  const animatedStyle = useAnimatedStyle(() => {
    const progressWidth = interpolate(progress.value, [0, 1], [0, width])

    return {
      width: progressWidth,
    }
  })

  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])

    return {
      opacity,
    }
  })

  return (
    <View
      className="rounded-full overflow-hidden"
      style={{
        width,
        height,
        backgroundColor,
      }}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[
          animatedStyle,
          {
            backgroundColor: progressColor,
          },
        ]}
      >
        {/* Gradient overlay for the shimmer effect */}
        <Animated.View
          className="absolute inset-0 rounded-full"
          style={[
            gradientStyle,
            {
              backgroundColor: '#60a5fa', // Simple solid color instead of gradient
            },
          ]}
        />
      </Animated.View>
    </View>
  )
}
