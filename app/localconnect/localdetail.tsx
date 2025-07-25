import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import { localBusinessService, LocalBusiness, TouristAttraction, BusinessItem } from "../../services/localBusinessService"

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    name: "Nadya",
    date: "6 months ago",
    comment: "Bakpia Yang Paling Enak, Lembut, No Effort Makannya",
    rating: 5.0,
  },
  {
    id: 2,
    name: "Raihani",
    date: "6 months ago",
    comment: "Bakpianya Enak, Harganya Terjangkau Juga, Kalau Ke Jogja Pasti Beli",
    rating: 5.0,
  },
  {
    id: 3,
    name: "Echa",
    date: "6 months ago",
    comment: "Banyak Variasi Rasa, Tapi Paling Suka Original Nya",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Ghaniya",
    date: "6 months ago",
    comment: "Bakpianya Sangat Enak Nom Nom",
    rating: 5.0,
  },
]

// Sample overview texts
const overviewTexts = {
  "1": `Bakpia Pathok is a well-known traditional snack from Yogyakarta, Indonesia. These small, round pastries are typically filled with sweet mung bean paste and wrapped in a soft, flaky dough. The combination of the slightly crispy outer layer and the smooth, sweet filling makes Bakpia a favorite treat among locals and tourists alike. Originally influenced by Chinese pastry, it has become uniquely Javanese over the years.

Today, Bakpia Pathok comes in a variety of modern flavors such as chocolate, cheese, green tea, and even durian, appealing to a wider audience. It is often packed in boxes and brought home as a signature souvenir from Yogyakarta. Whether enjoyed with tea or given as a gift, Bakpia Pathok represents the warmth, creativity, and rich culinary heritage of Indonesia.`,
  "2": `Gudeg Yu Djum is one of Yogyakarta's most iconic culinary establishments, famous for its traditional Javanese dish called gudeg. This legendary restaurant has been serving authentic gudeg for generations, maintaining the original recipe that has captivated both locals and tourists.

The signature dish is made from young jackfruit (nangka muda) that is stewed for hours with palm sugar, coconut milk, and various traditional spices. The slow cooking process results in a sweet and savory flavor that is uniquely Javanese. Gudeg is typically served with rice, krecek (spicy cow skin), ayam suwir (shredded chicken), telur pindang (boiled egg in sweet sauce), and areh (thick coconut milk).

Yu Djum's gudeg stands out for its perfect balance of flavors and consistent quality that has been maintained for decades, making it a must-visit culinary destination in Yogyakarta.`,
  "3": `A Borobudur Tour takes you to the heart of Java's cultural and spiritual heritage. Standing tall since the 9th century, Borobudur Temple is the world's largest Buddhist monument, featuring stunning stone carvings and hundreds of stupas. The highlight of the trip is watching the sunrise from the top of the temple—an awe-inspiring moment as light slowly reveals the beauty of the surrounding mountains and misty forests.

Beyond its majestic architecture, a visit to Borobudur offers a deeper connection to Indonesia's past and traditions. Travelers can walk through the temple's levels, each telling a story through intricate reliefs, and learn about the philosophy and history behind it. Surrounded by peaceful countryside and friendly locals, the Borobudur Trip is both a cultural journey and a spiritual escape.`,
}

export default function LocalDetail() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [activeTab, setActiveTab] = useState("Overview")
  const [localBusiness, setLocalBusiness] = useState<BusinessItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract params
  const { id, name, description, hours, address, image, category, details, rating, reviews, type } = params

  useEffect(() => {
    if (id) {
      fetchLocalBusinessDetail(id as string)
    } else {
      setIsLoading(false)
      setError('No business ID provided')
    }
  }, [id])

  const fetchLocalBusinessDetail = async (businessId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔄 Fetching detail for ID:', businessId)
      
      // Determine if this is a tour guide or local business based on type param
      const itemType = type as string || 'business' // Default to business if no type provided
      
      let response
      
      if (itemType === 'tour') {
        console.log('📍 Fetching tourist attraction detail...')
        response = await localBusinessService.getTouristAttractionById(businessId)
      } else {
        console.log('📍 Fetching local business detail...')
        response = await localBusinessService.getLocalBusinessById(businessId)
      }
      
      if (response.message && response.payload) {
        setLocalBusiness(response.payload)
        console.log('✅ Detail loaded:', response.payload.name)
      } else {
        setError('Failed to load details')
      }
    } catch (error: any) {
      console.error('❌ Error fetching detail:', error)
      
      // If tourist attraction API fails, try local business API as fallback
      if (type === 'tour' && error.message.includes('HTTP 404')) {
        try {
          console.log('🔄 Fallback: Trying local business API...')
          const fallbackResponse = await localBusinessService.getLocalBusinessById(businessId)
          if (fallbackResponse.message && fallbackResponse.payload) {
            setLocalBusiness(fallbackResponse.payload)
            console.log('✅ Fallback successful:', fallbackResponse.payload.name)
            return
          }
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError)
        }
      }
      
      setError(error.message || 'Failed to load details')
    } finally {
      setIsLoading(false)
    }
  }

  // Use backend data if available, otherwise fallback to params
  const businessData = localBusiness || {
    id: id as string,
    name: name as string,
    description: description as string,
    address: address as string,
    hours: hours as string,
    rating: rating ? parseFloat(rating as string) : undefined,
    reviews: reviews ? parseInt(reviews as string) : undefined,
    image: image as string,
    category: category as string,
    type: (type as string) || 'business', // Use type from params or default to business
    city: 'Yogyakarta' // default city
  }

  // Determine if this is a tour that should show the booking button
  const showBookButton = businessData.id === "3" || 
    businessData.type === "tour" || 
    businessData.category === "tour" ||
    businessData.category === "Local Tour Guide"

  const locationText = (localBusiness?.address || localBusiness?.city) || 
    businessData.address || 
    "Kab. Bantul, D.I. Yogyakarta"

  // Handle the image - use static images based on category/type instead of backend images
  let imageSource
  
  // Determine category for image selection
  const itemCategory = businessData.category || businessData.type || 'business'
  
  if (businessData.type === 'tour' || businessData.category === 'Local Tour Guide') {
    // Tour Guide - use Borobudur image
    imageSource = require("../../assets/Borobudur.png")
  } else if (businessData.type === 'business' || 
             (localBusiness && 'is_business' in localBusiness && localBusiness.is_business === true)) {
    // Business - use appropriate business image
    imageSource = require("../../assets/Pia.png") // Default business image
  } else {
    // Culinary - use Gudeg image  
    imageSource = require("../../assets/Gudeg.png")
  }

  // Get overview text - prioritize backend description, then fallback to static texts
  const overviewText = localBusiness?.description || 
    overviewTexts[businessData.id as string] || 
    businessData.description || 
    "No description available."

  const handleBooking = () => {
    router.push({
      pathname: "/localconnect/localbooking",
      params: {
        name: businessData.name || "Tour Package",
        price: "100000", // Default price, could be dynamic from backend
        id: businessData.id,
      },
    })
  }

  const handleRetry = () => {
    if (businessData.id) {
      fetchLocalBusinessDetail(businessData.id)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10367D" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorTitle}>Error Loading Details</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.mainImage} />

          {/* Route Badge */}
          <View style={styles.routeBadge}>
            <Ionicons name="map" size={16} color="white" />
            <Text style={styles.routeText}>Route</Text>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title and Location */}
          <Text style={styles.title}>{businessData.name}</Text>
          <Text style={styles.location}>{locationText}</Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Overview" && styles.activeTab]}
              onPress={() => setActiveTab("Overview")}
            >
              <Text style={styles.tabText}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Reviews" && styles.activeTab]}
              onPress={() => setActiveTab("Reviews")}
            >
              <Text style={styles.tabText}>Reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "Overview" ? (
            <View style={styles.tabContent}>
              <Text style={styles.overviewText}>{overviewText}</Text>

              {/* Book Button - Only for tours */}
              {showBookButton && (
                <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
                  <Text style={styles.bookButtonText}>Book Ticket</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.tabContent}>
              <Text style={styles.reviewsCount}>Reviews (900)</Text>

              {/* Reviews List */}
              {sampleReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    
                    <View style={styles.reviewHeaderText}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons key={star} name="star" size={16} color="#FFD700" />
                    ))}
                    <Text style={styles.ratingText}> {review.rating}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
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
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 280, // Increased height for better proportion
    marginBottom: 10, // Add bottom margin for spacing
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 0, // Remove border radius to avoid cropping issues
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  routeBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#C22121",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  routeText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 4,
  },
  contentCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -25, // Slightly increased overlap for better visual connection
    paddingHorizontal: 20,
    paddingTop: 25, // Increased top padding to prevent text overlap
    paddingBottom: 40,
    elevation: 3, // Add shadow for better separation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6, // Slightly increased for better spacing
    lineHeight: 30, // Add line height for better text readability
    color: "#1a1a1a", // Darker color for better contrast
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24, // Increased margin for better separation
    lineHeight: 20, // Add line height
    paddingBottom: 4, // Add padding for extra space
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 20, // Increased margin for better spacing
    marginTop: 8, // Add top margin for separation from location text
  },
  tab: {
    paddingVertical: 14, // Increased padding for better touch target
    paddingHorizontal: 50, // Slightly reduced to prevent overflow
    marginRight: 16,
    minWidth: 100, // Ensure minimum width for consistency
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#10367D",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center", // Center align text in tabs
    color: "#333", // Default text color
  },
  tabContent: {
    paddingVertical: 12, // Increased padding for better content spacing
    paddingHorizontal: 4, // Add horizontal padding
  },
  overviewText: {
    fontSize: 14,
    lineHeight: 24, // Increased line height for better readability
    color: "#333",
    textAlign: "justify",
    marginBottom: 8, // Add margin for separation from button
    paddingHorizontal: 2, // Add slight horizontal padding
  },
  bookButton: {
    backgroundColor: "#10367D",
    paddingVertical: 16, // Slightly increased padding
    borderRadius: 8,
    alignItems: "center",
    marginTop: 28, // Increased margin for better separation
    marginHorizontal: 4, // Add horizontal margin
    elevation: 2, // Add shadow for button
    shadowColor: "#10367D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5, // Add letter spacing for better readability
  },
  reviewsCount: {
    fontSize: 18, // Slightly larger for better hierarchy
    fontWeight: "bold",
    marginBottom: 20, // Increased margin
    color: "#1a1a1a", // Darker color
    paddingBottom: 4, // Add padding
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18, // Increased padding for better spacing
    marginBottom: 16,
    marginHorizontal: 2, // Add horizontal margin
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // Improved shadow
    shadowOpacity: 0.1,
    shadowRadius: 4, // Increased shadow radius
    elevation: 3, // Increased elevation
    borderWidth: 1, // Add subtle border
    borderColor: "#f0f0f0",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12, // Increased margin
    paddingBottom: 4, // Add padding
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a", // Darker color for better readability
    marginBottom: 2, // Add margin
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
    lineHeight: 16, // Add line height
  },
  reviewComment: {
    fontSize: 14,
    marginBottom: 12, // Increased margin
    lineHeight: 22, // Increased line height for better readability
    color: "#333", // Darker color
    paddingHorizontal: 2, // Add slight padding
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4, // Add top margin for separation
    paddingTop: 4, // Add padding
  },
  ratingText: {
    marginLeft: 6, // Increased margin
    fontSize: 14,
    color: "#333",
    fontWeight: "500", // Add font weight
  },
})