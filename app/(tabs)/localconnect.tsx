"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  type ImageSourcePropType,
} from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { localBusinessService, LocalBusiness } from "../../services/localBusinessService"
import { tokenManager } from "../../utils/tokenManager"
import { useCallback } from "react"

// Import local images
// Note: These paths should match your actual project structure
const images = {
  headerImage: require("../../assets/LocalHeader.png"),
  bakpia: require("../../assets/Pia.png"),
  gudeg: require("../../assets/Gudeg.png"),
  borobudur: require("../../assets/Borobudur.png"),
}

// Define the item type
type ItemType = {
  id: string
  name: string
  description: string
  hours: string
  address: string
  image: ImageSourcePropType
  category: string
  details: string
  rating: number
  reviews: number
  location: {
    latitude: number
    longitude: number
  }
}

export default function LocalConnect() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState("Yogyakarta")
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [localBusinesses, setLocalBusinesses] = useState<LocalBusiness[]>([])
  const [localTours, setLocalTours] = useState<LocalBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const locations = ["Yogyakarta", "Jakarta", "Bali", "Bandung", "Surabaya"]

  useEffect(() => {
    checkAuthStatus()
    fetchLocalBusinesses()
  }, [selectedLocation])

  // Refresh auth status when screen is focused (only if not already logged in)
  useFocusEffect(
    useCallback(() => {
      // Only check auth if we're not already authenticated to reduce unnecessary calls
      if (!isLoggedIn) {
        checkAuthStatus()
      }
    }, [isLoggedIn])
  )

  const checkAuthStatus = useCallback(async () => {
    try {
      // Use single call to get all auth data instead of multiple calls
      const authStatus = await tokenManager.getAuthStatus()
      
      setIsLoggedIn(authStatus.isAuthenticated)
      setUserEmail(authStatus.email || "")
    } catch (error) {
      setIsLoggedIn(false)
      setUserEmail("")
    }
  }, [])

  const fetchLocalBusinesses = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      console.log('🔄 Fetching local businesses for:', selectedLocation)
      
      // Fetch businesses
      const businessResponse = await localBusinessService.getLocalBusinesses({
        city: selectedLocation,
        type: 'business'
      })

      // Fetch tours  
      const tourResponse = await localBusinessService.getLocalBusinesses({
        city: selectedLocation,
        type: 'tour'
      })

      if (businessResponse.message && businessResponse.payload) {
        setLocalBusinesses(businessResponse.payload || [])
        console.log('✅ Businesses loaded:', businessResponse.payload?.length || 0)
      }

      if (tourResponse.message && tourResponse.payload) {
        setLocalTours(tourResponse.payload || [])
        console.log('✅ Tours loaded:', tourResponse.payload?.length || 0)
      }

      // If no data from backend, show empty state
      if (!businessResponse.payload?.length && !tourResponse.payload?.length) {
        console.log('📝 No data available from backend')
        setLocalBusinesses([])
        setLocalTours([])
      }

    } catch (error: any) {
      console.error('❌ Error fetching local businesses:', error)
      setError(error.message || 'Failed to load local businesses')
      
      // Set empty arrays on error - no static fallback
      setLocalBusinesses([])
      setLocalTours([])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchLocalBusinesses(true)
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
    setShowLocationDropdown(false)
  }

  const navigateToDetail = (item: LocalBusiness) => {
    // Check if this is a tour guide and user is not logged in
    if ((item.type === "tour" || item.category === "Local Tour Guide") && !isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Anda harus login terlebih dahulu untuk mengakses Local Tour Guide.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Login',
            onPress: () => router.push('/auth/login')
          }
        ]
      )
      return
    }

    router.push({
      pathname: "/localconnect/localdetail",
      params: { 
        id: item.id,
        name: item.name,
        description: item.description,
        address: item.address,
        hours: item.hours || 'Not specified',
        category: item.category || item.type,
        rating: item.rating?.toString() || '0',
        reviews: item.reviews?.toString() || '0'
      },
    })
  }

  const renderListingItem = (item: LocalBusiness) => {
    // Handle image source - prioritize backend image, fallback to local assets
    let imageSource: ImageSourcePropType
    if (item.image && item.image.startsWith('http')) {
      imageSource = { uri: item.image }
    } else {
      // Fallback to local images based on id
      switch (item.id) {
        case "1":
          imageSource = images.bakpia
          break
        case "2":
          imageSource = images.gudeg
          break
        case "3":
          imageSource = images.borobudur
          break
        default:
          imageSource = images.headerImage
      }
    }

    // Check if this is a tour that requires login
    const isTourGuide = item.type === "tour" || item.category === "Local Tour Guide"
    const isLocked = isTourGuide && !isLoggedIn

    return (
      <View key={item.id} style={[styles.listingItem, isLocked && styles.lockedItem]}>
        <View style={styles.imageContainer}>
          <Image 
            source={imageSource} 
            style={{
              width: 100,
              height: 110,
              resizeMode: "cover",
              opacity: isLocked ? 0.5 : 1
            }}
          />
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={24} color="white" />
            </View>
          )}
        </View>
        <View style={styles.listingContent}>
          <Text style={[styles.listingTitle, isLocked && styles.lockedText]}>{item.name}</Text>
          <Text style={[styles.listingDescription, isLocked && styles.lockedText]}>
            {isLocked ? "Login required to access tour guide" : item.description}
          </Text>
          <Text style={[styles.listingHours, isLocked && styles.lockedText]}>
            {item.hours || 'Hours not specified'}
          </Text>
          <Text style={[styles.listingAddress, isLocked && styles.lockedText]}>{item.address}</Text>
          {item.rating && !isLocked && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviewText}>({item.reviews || 0} reviews)</Text>
            </View>
          )}
          {isLocked && (
            <View style={styles.loginPrompt}>
              <Ionicons name="information-circle" size={16} color="#10367D" />
              <Text style={styles.loginPromptText}>Login to unlock this feature</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.detailButton, isLocked && styles.lockedButton]} 
          onPress={() => navigateToDetail(item)}
        >
          <Text style={[styles.detailButtonText, isLocked && styles.lockedButtonText]}>
            {isLocked ? "Login" : "Detail"}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#10367D']}
          />
        }
      >
        {/* Header Image - now using local image */}
        <Image 
          source={images.headerImage} 
          style={{
            width: "100%",
            height: 280,
            resizeMode: "cover"
          }} 
        />

        {/* Location Selector */}
        <View style={styles.locationContainer}>
          <Pressable style={styles.locationSelector} onPress={() => setShowLocationDropdown(!showLocationDropdown)}>
            <Ionicons name="location" size={20} color="#10367D" />
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <Ionicons name={showLocationDropdown ? "chevron-up" : "chevron-down"} size={20} color="#10367D" />
          </Pressable>

          {showLocationDropdown && (
            <View style={styles.dropdown}>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedLocation(location)
                    setShowLocationDropdown(false)
                  }}
                >
                  <Text style={[styles.dropdownItemText, location === selectedLocation && styles.selectedLocation]}>
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Local Business Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Business</Text>
          {localBusinesses.map(renderListingItem)}
        </View>

        {/* Local Tour Guide Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Tour Guide</Text>
          {localTours.map(renderListingItem)}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  headerImage: {
    // Style moved to inline due to TypeScript compatibility
  },
  locationContainer: {
    position: "relative",
    zIndex: 10,
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedLocation: {
    color: "#10367D",
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#10367D",
    marginBottom: 12,
  },
  listingItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  listingImage: {
    // Style moved to inline due to TypeScript compatibility
  },
  listingContent: {
    flex: 1,
    padding: 10,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  listingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  listingHours: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  listingAddress: {
    fontSize: 12,
    color: "#888",
  },
  detailButton: {
    backgroundColor: "#10367D",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginRight: 10,
  },
  detailButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
    color: "#333",
  },
  reviewText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#10367D",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    paddingVertical: 20,
    fontStyle: "italic",
  },
  // Authentication and lock styles
  lockedItem: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative' as const,
    width: 80,
    height: 80,
  },
  lockOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 2,
  },
  lockedText: {
    color: '#999',
  },
  loginPrompt: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
  },
  loginPromptText: {
    fontSize: 12,
    color: '#10367D',
    marginLeft: 4,
    fontWeight: '500' as const,
  },
  lockedButton: {
    backgroundColor: '#10367D',
  },
  lockedButtonText: {
    color: 'white',
  },
})