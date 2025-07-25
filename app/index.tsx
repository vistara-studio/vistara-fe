"use client"
import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
  Animated,
} from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient'
import "../global.css"

const { width, height } = Dimensions.get("window")

export default function AppVistara() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const flatListRef = useRef(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Logo fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const slides = [
    {
      id: "1",
      title: "Welcome to Vistara",
      image: require("../assets/BeachLanding.png"),
      subtitle: "Your go-to platform for sustainable travel! Discover amazing destinations while staying eco-friendly.",
      showBackButton: false,
    },
    {
      id: "2",
      title: "Indonesia Culture",
      image: require("../assets/GunungLanding.png"),
      subtitle: "Culture Sync lets travelers find and book local cultural events nearby, offering real-time updates and authentic experiences.",
      showBackButton: true,
    },
    {
      id: "3",
      image: require("../assets/MomLanding.png"),
      title: "Smart Planner",
      subtitle: "Smart Trip-AI Planner creates a personalized itinerary using your preferences and real-time data.",
      showBackButton: true,
    }
  ]

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      })
    } else {
      router.push("/(tabs)/home")
    }
  }

  const handleBack = () => {
    if (currentPage > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentPage - 1,
        animated: true,
      })
    }
  }

  const handleSkip = () => {
    router.push("/(tabs)/home")
  }

  // Splash Screen Component using actual logo assets
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
        <LinearGradient
          colors={['#1e40af', '#2563eb', '#3b82f6']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Noise texture overlay */}
          <View style={styles.noiseOverlay} />
          
          <Animated.View 
            style={[
              styles.logoContainer,
              { 
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }]
              }
            ]}
          >
            {/* Option 1: Full Logo */}
            {/* 
            <Image 
              source={require("../assets/FullLogo.png")}
              style={styles.fullLogoImage}
              resizeMode="contain"
            />
            */}
            
            {/* Option 2: V Logo + Text */}
            <View style={styles.brandContainer}>
              <Image 
                source={require("../assets/Vlogo.png")}
                style={styles.vLogoImage}
                resizeMode="contain"
              />
              <Text style={styles.vistaraText}>istara</Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    )
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground source={item.image} style={styles.backgroundImage}>
          <View style={styles.safeArea}>
            <View style={styles.header}>
              {item.showBackButton ? (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={styles.headerLeft} />
              )}
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomContent}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              <View style={styles.paginationContainer}>
                {slides.map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.paginationDot,
                      index === dotIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueButtonText}>
                  {index === slides.length - 1 ? "Get Started" : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const currentIndex = Math.round(contentOffsetX / width)
    setCurrentPage(currentIndex)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        initialScrollIndex={0}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Splash screen styles - exact match to design
  splashContainer: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noiseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    opacity: 0.8,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  fullLogoImage: {
    width: 240,
    height: 100,
    tintColor: 'white',
  },
  // Alternative styles if needed
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vLogoImage: {
    width: 60,
    height: 60,
    tintColor: 'white',
    marginRight: -8,
  },
  vistaraText: {
    fontSize: 36,
    fontWeight: '400',
    color: 'white',
    letterSpacing: 0.5,
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Onboarding slides styles
  slide: {
    width,
    height,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerLeft: {
    width: 40,
  },
  backButton: {
    padding: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.9,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "white",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  continueButton: {
    backgroundColor: "#1e40af",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})