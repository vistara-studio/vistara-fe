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
import { localBusinessService, LocalBusiness, TouristAttraction, BusinessItem } from "../../services/localBusinessService"
import { tokenManager } from "../../utils/tokenManager"
import { useCallback } from "react"

const images = {
  headerImage: require("../../assets/LocalHeader.png"),
  bakpia: require("../../assets/Pia.png"),
  gudeg: require("../../assets/Gudeg.png"),
  borobudur: require("../../assets/Borobudur.png"),
}

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
  const [localCulinary, setLocalCulinary] = useState<LocalBusiness[]>([])
  const [localTours, setLocalTours] = useState<TouristAttraction[]>([])
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
      if (!isLoggedIn) {
        checkAuthStatus()
      }
    }, [isLoggedIn])
  )

  const checkAuthStatus = useCallback(async () => {
    try {
    
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
      
      const localsResponse = await localBusinessService.getLocalBusinesses({
        city: selectedLocation
      })

      const tourResponse = await localBusinessService.getTouristAttractions(selectedLocation)

      if (localsResponse.message && localsResponse.payload) {
        const businesses = localsResponse.payload.filter(item => item.is_business === true)
        const culinary = localsResponse.payload.filter(item => item.is_business === false)
        
        setLocalBusinesses(businesses)
        setLocalCulinary(culinary)
        console.log('✅ Businesses loaded:', businesses.length)
        console.log('✅ Culinary loaded:', culinary.length)
      }

      if (tourResponse.message && tourResponse.payload) {
        setLocalTours(tourResponse.payload || [])
        console.log('✅ Tours loaded:', tourResponse.payload?.length || 0)
      }

      if (!localsResponse.payload?.length && !tourResponse.payload?.length) {
        console.log('📝 No data available from backend')
        setLocalBusinesses([])
        setLocalCulinary([])
        setLocalTours([])
      }

    } catch (error: any) {
      console.error('❌ Error fetching local businesses:', error)
      setError(error.message || 'Failed to load local businesses')
      
      setLocalBusinesses([])
      setLocalCulinary([])
      setLocalTours([])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchLocalBusinesses(true)
  }

  const navigateToDetail = (item: BusinessItem) => {
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
        reviews: item.reviews?.toString() || '0',
        type: item.type || 'business' // Add type parameter to determine API endpoint
      },
    })
  }

  const renderListingItem = (item: BusinessItem) => {
    let imageSource: ImageSourcePropType
    
    if (item.type === 'tour' || item.category === 'Local Tour Guide') {
      // Tour Guide - use Borobudur image
      imageSource = images.borobudur
    } else if (item.type === 'business' || 
               ('is_business' in item && item.is_business === true)) {
      // Business - use Bakpia image
      imageSource = images.bakpia
    } else {
      // Culinary - use Gudeg image  
      imageSource = images.gudeg
    }

    const isTourGuide = item.type === "tour" || item.category === "Local Tour Guide"
    const isLocked = isTourGuide && !isLoggedIn

    return (
      <View key={item.id} style={[styles.listingItem, isLocked && styles.lockedItem]}>
        <View style={styles.imageContainer}>
          <Image 
            source={imageSource} 
            style={{
              width: 110,
              height: 130,
              resizeMode: "cover",
              opacity: isLocked ? 0.5 : 1,
            }}
          />
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={20} color="white" />
            </View>
          )}
        </View>
        
        {/* Content and Button Container */}
        <View style={styles.cardContent}>
          {/* Text Content Area */}
          <View style={styles.textContent}>
            <Text style={[styles.listingTitle, isLocked && styles.lockedText]} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={[styles.listingDescription, isLocked && styles.lockedText]} numberOfLines={1}>
              {isLocked ? "Login required to access tour guide" : item.label}
            </Text>
            <Text style={[styles.listingHours, isLocked && styles.lockedText]} numberOfLines={1}>
              {item.hours || 'Hours not specified'}
            </Text>
            <Text style={[styles.listingAddress, isLocked && styles.lockedText]} numberOfLines={1}>
              {item.address}
            </Text>
            {item.rating && !isLocked && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewText}>({item.reviews || 0} reviews)</Text>
              </View>
            )}
            {isLocked && (
              <View style={styles.loginPrompt}>
                <Ionicons name="information-circle" size={14} color="#10367D" />
                <Text style={styles.loginPromptText}>Login to unlock</Text>
              </View>
            )}
          </View>
          
          {/* Button Area */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.detailButton, isLocked && styles.lockedButton]} 
              onPress={() => navigateToDetail(item)}
            >
              <Text style={[styles.detailButtonText, isLocked && styles.lockedButtonText]}>
                {isLocked ? "Login" : "Detail"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

        {/* Login Notice for Non-authenticated Users */}
        {!isLoggedIn && (
          <View style={styles.loginNotice}>
            <Ionicons name="information-circle-outline" size={20} color="#10367D" />
            <Text style={styles.loginNoticeText}>
              Please log in to access full features and tour guide services
            </Text>
          </View>
        )}

        {/* Local Business Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Business</Text>
          {localBusinesses.length > 0 ? (
            localBusinesses.map(renderListingItem)
          ) : (
            <Text style={styles.emptyText}>No local businesses available</Text>
          )}
        </View>

        {/* Local Culinary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Culinary</Text>
          {localCulinary.length > 0 ? (
            localCulinary.map(renderListingItem)
          ) : (
            <Text style={styles.emptyText}>No local culinary available</Text>
          )}
        </View>

        {/* Local Tour Guide Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Tour Guide</Text>
          {localTours.length > 0 ? (
            localTours.map(renderListingItem)
          ) : (
            <Text style={styles.emptyText}>No tour guides available</Text>
          )}
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
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    height: 130, 
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch", 
    height: 130, 
  },
  textContent: {
    flex: 1,
    padding: 12,
    paddingRight: 4, 
    justifyContent: "space-between",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10, 
    paddingLeft: 2, 
    width: 70, 
    alignSelf: "stretch", 
  },
  listingTitle: {
    fontSize: 15, 
    fontWeight: "600",
    marginBottom: 3, 
    lineHeight: 18, 
    color: "#1a1a1a",
  },
  listingDescription: {
    fontSize: 12, 
    color: "#666",
    marginBottom: 2, 
    lineHeight: 16, 
  },
  listingHours: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2, 
    lineHeight: 14, 
  },
  listingAddress: {
    fontSize: 11, 
    color: "#888",
    marginBottom: 3, 
    lineHeight: 14, 
  },
  detailButton: {
    backgroundColor: "#10367D",
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 6, 
    justifyContent: "center",
    alignItems: "center",
    minWidth: 55, 
    maxWidth: 65, 
    elevation: 2,
    shadowColor: "#10367D",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12, 
    textAlign: "center",
    letterSpacing: 0.3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3, 
    marginBottom: 0, 
  },
  ratingText: {
    fontSize: 11, 
    fontWeight: "500",
    marginLeft: 3, 
    color: "#333",
  },
  reviewText: {
    fontSize: 10,
    color: "#888",
    marginLeft: 3, 
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
  loginNotice: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#f8f9ff',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10367D',
  },
  loginNoticeText: {
    fontSize: 14,
    color: '#10367D',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  lockedItem: {
    opacity: 0.8,
  },
  imageContainer: {
    position: 'relative' as const,
    width: 110, 
    height: 130, 
    overflow: 'hidden',
  },
  lockOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 6,
    elevation: 2,
  },
  lockedText: {
    color: '#999',
  },
  loginPrompt: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 2, 
    paddingHorizontal: 6, 
    paddingVertical: 3, 
    backgroundColor: '#f0f4ff',
    borderRadius: 6, 
    borderLeftWidth: 2,
    borderLeftColor: '#10367D',
  },
  loginPromptText: {
    fontSize: 10, 
    color: '#10367D',
    marginLeft: 4, 
    fontWeight: '600' as const,
    flex: 1,
  },
  lockedButton: {
    backgroundColor: '#10367D',
    borderWidth: 1,
    borderColor: '#0d2d5f',
    opacity: 0.9, 
  },
  lockedButtonText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 12, 
  },
})