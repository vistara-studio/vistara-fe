import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { router, useFocusEffect } from "expo-router"
import { tokenManager, UserData } from "../../utils/tokenManager"
import { useCallback } from "react"

const accountMenuItems = [
  {
    id: "1",
    title: "Profile",
    icon: "person",
  },
  {
    id: "2",
    title: "Orders",
    icon: "receipt",
  },
  {
    id: "3",
    title: "Smart Planner",
    icon: "bulb",
  },
]

const supportMenuItems = [
  {
    id: "1",
    title: "Help and Support",
    icon: "help-circle",
  },
  {
    id: "2",
    title: "About",
    icon: "information-circle",
  },
  {
    id: "3",
    title: "Report bugs",
    icon: "bug",
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userData?.full_name ? userData.full_name.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>
            {userData?.full_name || userEmail.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>

        {/* Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.menuSection}>
            {accountMenuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.menuSection}>
            {supportMenuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
          <Ionicons name="exit-outline" size={20} color="#10367D" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  profileHeader: {
    backgroundColor: "white",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10367D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
  },
  menuSection: {
    backgroundColor: "white",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuTitle: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: "#10367D",
    fontWeight: "500",
    marginRight: 8,
  },
})