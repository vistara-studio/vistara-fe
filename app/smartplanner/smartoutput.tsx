"use client"

import { useEffect, useState } from "react"
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SmartPlannerResponse } from "../../services/smartPlannerService"

// Types for our itinerary data (now using API response format)
interface Activity {
  id: string
  time: string
  name: string
  description: string
  notes?: string
  duration: string
  price_range: {
    min: number
    max: number
  }
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  type: 'attraction' | 'local_business' | 'activity'
}

interface ItineraryDay {
  day: number
  date: string
  activities: Activity[]
}

// Helper component for rendering a day's activities
const ActivityItem = ({ activity }: { activity: Activity }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPriceRange = (priceRange: { min: number; max: number }) => {
    if (priceRange.min === priceRange.max) {
      return formatCurrency(priceRange.min)
    }
    return `${formatCurrency(priceRange.min)} - ${formatCurrency(priceRange.max)}`
  }

  return (
    <View style={styles.activityItem}>
      <View style={styles.activityTimeContainer}>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.name}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        {activity.notes && (
          <Text style={styles.activityNotes}>💡 {activity.notes}</Text>
        )}

        <View style={styles.activityDetails}>
          <View style={styles.activityDetail}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.activityDetailText}>{activity.duration}</Text>
          </View>
          <View style={styles.activityDetail}>
            <Ionicons name="wallet-outline" size={14} color="#666" />
            <Text style={styles.activityDetailText}>{formatPriceRange(activity.price_range)}</Text>
          </View>
          {activity.location && (
            <View style={styles.activityDetail}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.activityDetailText}>{activity.location.address}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

// Helper component for rendering a day's activities
const DayActivities = ({ day }: { day: ItineraryDay }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "long", 
      day: "numeric" 
    })
  }

  return (
    <View style={styles.dayContainer}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>Day {day.day}</Text>
        <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
      </View>

      <View style={styles.activitiesContainer}>
        {day.activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </View>
    </View>
  )
}

const SmartOutput = () => {
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SmartPlannerResponse | null>(null)

  const navigateToHistory = () => {
    router.push({
      pathname: "/smartplanner/smarthistory",
    })
  }

  // Load data from AsyncStorage
  useEffect(() => {
    const loadTripPlan = async () => {
      try {
        const tripPlanData = await AsyncStorage.getItem("tripPlan")
        if (tripPlanData) {
          const parsedData: SmartPlannerResponse = JSON.parse(tripPlanData)
          setData(parsedData)
        }
      } catch (error) {
        console.error("Error loading trip plan:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTripPlan()
  }, [])

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  // Calculate total budget from activities
  const calculateTotalBudget = () => {
    if (!data) return 0
    
    let total = 0
    data.itinerary.forEach(day => {
      day.activities.forEach(activity => {
        total += activity.price_range.max
      })
    })
    return total
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10367D" />
          <Text style={styles.loadingText}>Loading your itinerary...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!data) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Ionicons name="map-outline" size={80} color="#ccc" />
          <Text style={styles.loadingText}>No trip plan available</Text>
          <TouchableOpacity style={styles.generateButton} onPress={() => router.push("/smartplanner/smartinput")}>
            <Text style={styles.generateButtonText}>Create New Plan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#10367D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Trip Plan</Text>
        <TouchableOpacity style={styles.shareButton} onPress={navigateToHistory}>
          <Ionicons name="bookmark-outline" size={24} color="#10367D" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Trip Card */}
        <View style={styles.cardContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=2069&auto=format&fit=crop",
            }}
            style={styles.cardBackground}
          />
          <View style={styles.cardContent}>
            <Text style={styles.tripName}>{data?.destination} Trip</Text>
            <Text style={styles.tripDate}>{data ? formatDateRange(data.start_date, data.end_date) : ""}</Text>

            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{data?.travel_style}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{data?.activity_intensity}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{formatCurrency(data?.budget || 0)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Itinerary */}
        <View style={styles.itineraryContainer}>
          <Text style={styles.itineraryTitle}>Your Itinerary</Text>

          {data?.itinerary.map((day, index) => (
            <DayActivities key={`day-${index}`} day={day} />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.generateButton} onPress={navigateToHistory}>
            <Ionicons name="bookmark" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.generateButtonText}>View History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/smartplanner/smartinput")}>
            <Ionicons name="add" size={20} color="#10367D" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryButtonText}>Plan New Trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#10367D",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 20,
  },
  cardBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardContent: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  tripDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
    marginTop: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#10367D",
  },
  tagText: {
    fontSize: 12,
    color: "#10367D",
  },
  itineraryContainer: {
    marginBottom: 20,
  },
  itineraryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  dayContainer: {
    marginBottom: 24,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
  },
  dayHeader: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dayDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  activitiesContainer: {
    gap: 12,
  },
  timeSection: {
    marginTop: 16,
  },
  timeSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10367D",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activityTimeContainer: {
    width: 50,
    alignItems: "center",
  },
  activityTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#10367D",
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  activityDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  activityDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  activityDetailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  activityNotes: {
    fontSize: 12,
    color: "#8B5A00",
    backgroundColor: "#FFF8E1",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    fontStyle: "italic",
  },
  notesContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 6,
    padding: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#DDD",
  },
  notesText: {
    fontSize: 11,
    color: "#777",
    fontStyle: "italic",
  },
  generateButton: {
    backgroundColor: "#10367D",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 8,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#10367D",
    flex: 1,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: "#10367D",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SmartOutput