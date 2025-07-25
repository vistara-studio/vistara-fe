"use client"
import { useState } from "react"
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { smartPlannerService, SmartPlannerRequest } from "../../services/smartPlannerService"

export default function SmartInput() {
  const router = useRouter()
  const [destination, setDestination] = useState("Yogyakarta")
  const [selectedDates, setSelectedDates] = useState([19, 20])
  const [selectedActivities, setSelectedActivities] = useState(["Family"])
  const [budget, setBudget] = useState("Rp 500,000")
  const [selectedTravelStyle, setSelectedTravelStyle] = useState(["Family with children"])
  const [selectedIntensity, setSelectedIntensity] = useState(["Balanced"])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Generating your plan...")
  const [loadingStage, setLoadingStage] = useState(0)
  
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const loadingMessages = [
    "Generating your plan...",
    "Finding the best attractions...",
    "Planning your itinerary...",
    "Calculating costs...",
    "Finalizing your perfect trip...",
  ]

  const toggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((item) => item !== activity))
    } else {
      setSelectedActivities([...selectedActivities, activity])
    }
  }

  const toggleTravelStyle = (style) => {
    if (selectedTravelStyle.includes(style)) {
      setSelectedTravelStyle(selectedTravelStyle.filter((item) => item !== style))
    } else {
      setSelectedTravelStyle([...selectedTravelStyle, style])
    }
  }

  const toggleIntensity = (intensity) => {
    if (selectedIntensity.includes(intensity)) {
      setSelectedIntensity(selectedIntensity.filter((item) => item !== intensity))
    } else {
      setSelectedIntensity([...selectedIntensity, intensity])
    }
  }

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
    // Clear selected dates when changing months
    setSelectedDates([])
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
    // Clear selected dates when changing months
    setSelectedDates([])
  }

  // Get days in current month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // Simulate API call with loading stages
  const generatePlan = async () => {
    // Validate form
    if (!destination) {
      Alert.alert("Missing Information", "Please enter a travel destination")
      return
    }

    if (selectedDates.length === 0) {
      Alert.alert("Missing Information", "Please select travel dates")
      return
    }

    if (selectedActivities.length === 0) {
      Alert.alert("Missing Information", "Please select at least one activity preference")
      return
    }

    if (!budget || budget === "Rp 500,000") {
      Alert.alert("Missing Information", "Please enter your travel budget")
      return
    }

    setIsLoading(true)
    setLoadingStage(0)
    setLoadingMessage(loadingMessages[0])

    try {
      // Show loading stages
      const loadingInterval = setInterval(() => {
        setLoadingStage(prev => {
          if (prev < loadingMessages.length - 1) {
            const next = prev + 1
            setLoadingMessage(loadingMessages[next])
            return next
          }
          return prev
        })
      }, 1500)

      // Prepare dates
      const sortedDates = [...selectedDates].sort((a, b) => a - b)
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      
      console.log('=== REQUEST BODY DEBUG ===')
      console.log('1. RAW FORM DATA:')
      console.log('   Destination:', destination)
      console.log('   Selected dates array:', selectedDates)
      console.log('   Sorted dates:', sortedDates)
      console.log('   Current month:', currentMonth, '(', monthNames[currentMonth], ')')
      console.log('   Current year:', currentYear)
      console.log('   Selected activities:', selectedActivities)
      console.log('   Budget input:', budget)
      console.log('   Travel style:', selectedTravelStyle)
      console.log('   Intensity:', selectedIntensity)
      
      const startDate = new Date(currentYear, currentMonth, sortedDates[0])
      const endDate = new Date(currentYear, currentMonth, sortedDates[sortedDates.length - 1])
      
      console.log('2. DATE PROCESSING:')
      console.log('   Start date object:', startDate)
      console.log('   End date object:', endDate)
      
      // Format dates for API (ensure they're in the correct timezone)
      const formatDateForAPI = (date: Date) => {
        // Create a new date to avoid timezone issues
        const utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const formatted = utcDate.toISOString()
        console.log('   Formatting date:', date, '-> ISO:', formatted)
        return formatted
      }

      const formattedStartDate = formatDateForAPI(startDate)
      const formattedEndDate = formatDateForAPI(endDate)
      
      console.log('   Final start date:', formattedStartDate)
      console.log('   Final end date:', formattedEndDate)

      // Parse budget (remove "Rp", dots, commas and convert to number)
      const budgetNumber = parseFloat(budget.replace(/[^\d]/g, ''))
      console.log('3. BUDGET PROCESSING:')
      console.log('   Budget input:', budget)
      console.log('   Budget cleaned:', budget.replace(/[^\d]/g, ''))
      console.log('   Budget number:', budgetNumber)

      // Map activity preferences to API format (keep original values)
      const activityPreferencesMap = {
        "Nature Exploration": "Nature Exploration",
        "History & culture": "History & culture", 
        "Culinary": "Culinary",
        "Shopping": "Shopping",
        "Family": "Family"
      }

      const mappedActivities = selectedActivities.map(activity => 
        activityPreferencesMap[activity] || activity
      )
      console.log('4. ACTIVITY MAPPING:')
      console.log('   Original activities:', selectedActivities)
      console.log('   Mapped activities:', mappedActivities)

      // Map travel style to API format
      const travelStyleMap = {
        "Solo Traveler": "solo_traveler",
        "Romantic couple": "romantic_couple",
        "Family with children": "family_with_children",
        "Backpacker": "backpacker",
        "Luxury Traveler": "luxury_traveler"
      }

      const mappedTravelStyle = travelStyleMap[selectedTravelStyle[0]] || "solo_traveler"
      console.log('5. TRAVEL STYLE MAPPING:')
      console.log('   Original style:', selectedTravelStyle[0])
      console.log('   Mapped style:', mappedTravelStyle)

      // Map intensity to API format
      const intensityMap = {
        "Relaxed": "relaxed",
        "Balanced": "balanced",
        "Full": "full"
      }

      const mappedIntensity = intensityMap[selectedIntensity[0]] || "balanced"
      console.log('6. INTENSITY MAPPING:')
      console.log('   Original intensity:', selectedIntensity[0])
      console.log('   Mapped intensity:', mappedIntensity)

      const apiRequest: SmartPlannerRequest = {
        destination: destination,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        budget: budgetNumber,
        activity_preferences: mappedActivities,
        travel_style: mappedTravelStyle,
        activity_intensity: mappedIntensity
      }

      console.log('7. FINAL API REQUEST:')
      console.log('   Complete request object:', JSON.stringify(apiRequest, null, 2))
      console.log('   Request size:', JSON.stringify(apiRequest).length, 'characters')
      console.log('=== END REQUEST DEBUG ===')

      // Call the real API
      const response = await smartPlannerService.generatePlan(apiRequest)
      
      console.log('Received API response:', JSON.stringify(response, null, 2))
      
      clearInterval(loadingInterval)

      // Store the API response in AsyncStorage
      await AsyncStorage.setItem("tripPlan", JSON.stringify(response))

      // Navigate to the results screen
      router.push("/smartplanner/smartoutput")
    } catch (error) {
      console.error('Error generating plan:', error)
      
      // Show specific error message based on error type
      let errorMessage = "Failed to generate plan. Please try again."
      
      if (error.message.includes('400')) {
        errorMessage = "Invalid request data. Please check your inputs and try again."
      } else if (error.message.includes('401')) {
        errorMessage = "Authentication required. Please login and try again."
      } else if (error.message.includes('500')) {
        errorMessage = "Server error. Please try again later."
      } else if (error.message.includes('Network')) {
        errorMessage = "Network error. Please check your internet connection."
      }
      
      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const renderCalendar = () => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const daysInMonth = getDaysInMonth(currentDate)
    const startDayOfWeek = getFirstDayOfMonth(currentDate)
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    // Get current date for highlighting today
    const today = new Date()
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear
    const todayDate = today.getDate()

    // Create array for empty cells before the first day of the month
    const emptyCells = Array(startDayOfWeek).fill(null)

    // Create array for all days in the month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Combine empty cells and days
    const calendarCells = [...emptyCells, ...daysArray]

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back" size={24} color="#555555" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#555555" />
          </TouchableOpacity>
        </View>

        <View style={styles.daysHeader}>
          {days.map((day) => (
            <Text key={day} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.datesContainer}>
          {calendarCells.map((date, index) => {
            if (date === null) {
              // Empty cell
              return <View key={`empty-${index}`} style={styles.dateCell} />
            }

            const isSelected = selectedDates.includes(date)
            const isToday = isCurrentMonth && date === todayDate
            
            // Disable past dates
            const currentDateObj = new Date(currentYear, currentMonth, date)
            const todayObj = new Date()
            todayObj.setHours(0, 0, 0, 0)
            const isPastDate = currentDateObj < todayObj

            return (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateCell, 
                  isSelected && styles.selectedDateCell,
                  isToday && !isSelected && styles.todayDateCell,
                  isPastDate && styles.disabledDateCell
                ]}
                onPress={() => {
                  if (!isPastDate) {
                    if (isSelected) {
                      console.log(`📅 CALENDAR: Removing date ${date} from selection`)
                      setSelectedDates(selectedDates.filter((d) => d !== date))
                    } else {
                      console.log(`📅 CALENDAR: Adding date ${date} to selection`)
                      setSelectedDates([...selectedDates, date])
                    }
                    console.log(`📅 CALENDAR: Current selection:`, selectedDates)
                  }
                }}
                disabled={isPastDate}
              >
                <Text style={[
                  styles.dateText, 
                  isSelected && styles.selectedDateText,
                  isToday && !isSelected && styles.todayDateText,
                  isPastDate && styles.disabledDateText
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Travel Destination</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex. Malang, Bali"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <Text style={styles.sectionTitle}>Travel Dates</Text>
        {renderCalendar()}

        <Text style={styles.sectionTitle}>Activity Preferences</Text>
        <View style={styles.chipsContainer}>
          {["Nature Exploration", "History & culture", "Culinary", "Shopping", "Family"].map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[styles.chip, selectedActivities.includes(activity) && styles.selectedChip]}
              onPress={() => toggleActivity(activity)}
            >
              <Text style={[styles.chipText, selectedActivities.includes(activity) && styles.selectedChipText]}>
                {activity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Travel Budget</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex. Rp 250,000"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
        </View>

        <Text style={styles.sectionTitle}>Travel Style</Text>
        <View style={styles.chipsContainer}>
          {["Solo Traveler", "Romantic couple", "Family with children", "Backpacker", "Luxury Traveler"].map(
            (style) => (
              <TouchableOpacity
                key={style}
                style={[styles.chip, selectedTravelStyle.includes(style) && styles.selectedChip]}
                onPress={() => toggleTravelStyle(style)}
              >
                <Text style={[styles.chipText, selectedTravelStyle.includes(style) && styles.selectedChipText]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        <Text style={styles.sectionTitle}>Activity Intensity</Text>
        <View style={styles.chipsContainer}>
          {["Relaxed", "Balanced", "Full"].map((intensity) => (
            <TouchableOpacity
              key={intensity}
              style={[styles.chip, selectedIntensity.includes(intensity) && styles.selectedChip]}
              onPress={() => toggleIntensity(intensity)}
            >
              <Text style={[styles.chipText, selectedIntensity.includes(intensity) && styles.selectedChipText]}>
                {intensity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={generatePlan} disabled={isLoading}>
          <Text style={styles.generateButtonText}>Generate Plan</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      {/* <LoadingOverlay visible={isLoading} message={loadingMessage} type="custom" /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#10367D",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555555",
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
    position: "relative",
  },
  input: {
    fontSize: 16,
    color: "#333333",
  },
  inputIcon: {
    position: "absolute",
    right: 16,
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayLabel: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    color: "#999999",
  },
  datesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateCell: {
    width: "14.28%",
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  selectedDateCell: {
    backgroundColor: "#FFF",
    borderRadius: 18,
  },
  dateText: {
    fontSize: 14,
    color: "#333333",
  },
  selectedDateText: {
    color: "#10367D",
    fontWeight: "600",
  },
  todayDateCell: {
    backgroundColor: "#E3F2FD",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#10367D",
  },
  todayDateText: {
    color: "#10367D",
    fontWeight: "500",
  },
  disabledDateCell: {
    opacity: 0.3,
  },
  disabledDateText: {
    color: "#CCCCCC",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    borderColor: "#10367D",
    backgroundColor: "#F5F9FF",
  },
  chipText: {
    fontSize: 14,
    color: "#555555",
  },
  selectedChipText: {
    color: "#10367D",
  },
  generateButton: {
    backgroundColor: "#10367D",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})