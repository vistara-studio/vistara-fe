import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { router, useFocusEffect } from "expo-router"
import { tokenManager, UserData } from "../../utils/tokenManager"
import { useCallback } from "react"

const menuItems = [
  {
    id: "1",
    title: "My Bookings",
    icon: "calendar",
  },
  {
    id: "2",
    title: "Saved Places",
    icon: "bookmark",
  },
  {
    id: "3",
    title: "Reviews",
    icon: "star",
  },
  {
    id: "4",
    title: "Settings",
    icon: "settings",
  },
  {
    id: "5",
    title: "Help Center",
    icon: "help-circle",
  },
  {
    id: "6",
    title: "About",
    icon: "information-circle",
  },
]

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Refresh auth status when screen is focused
  useFocusEffect(
    useCallback(() => {
      checkAuthStatus()
    }, [])
  )

  const checkAuthStatus = async () => {
    try {
      const token = await tokenManager.getToken()
      const email = await tokenManager.getEmail()
      const user = await tokenManager.getUserData()
      
      if (token && email) {
        setIsLoggedIn(true)
        setUserEmail(email)
        setUserData(user)
      } else {
        setIsLoggedIn(false)
      }
    } catch (error) {
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginPress = () => {
    router.push('/auth/login')
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await tokenManager.clearAuthData()
              setIsLoggedIn(false)
              setUserEmail("")
              setUserData(null)
              Alert.alert('Berhasil', 'Anda telah keluar dari aplikasi')
            } catch (error) {
              Alert.alert('Error', 'Gagal keluar dari aplikasi')
            }
          }
        }
      ]
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.notLoggedInContainer}>
          <View style={styles.notLoggedInContent}>
            <Ionicons name="person-circle-outline" size={80} color="#ccc" />
            <Text style={styles.notLoggedInTitle}>Belum Login</Text>
            <Text style={styles.notLoggedInMessage}>
              Silakan login untuk mengakses profil dan fitur lainnya
            </Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
              <Ionicons name="log-in" size={20} color="white" />
              <Text style={styles.loginButtonText}>Login Sekarang</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            {/* <Image
              source={{
                uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Local%20Connect-T8YuujmPybJqJtjlrjt3WkZCGPh2Bi.png",
              }}
              style={styles.profileImage}
            /> */}
            <View>
              <Text style={styles.profileName}>
                {userData?.full_name || userEmail.split('@')[0] || 'User'}
              </Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>36</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              {/* <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={20} color="#10367D" />
              </View> */}
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#10367D" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  notLoggedInContent: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  notLoggedInMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10367D",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#10367D",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "white",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 16,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10367D",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f0f0f0",
  },
  menuContainer: {
    backgroundColor: "white",
    marginTop: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  logoutText: {
    fontSize: 16,
    color: "#10367D",
    fontWeight: "500",
    marginLeft: 8,
  },
})