"use client";
import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { ImageSourcePropType } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

const { width } = Dimensions.get("window");

interface Attraction {
  id: string;
  name: string;
  location: string;
  description: string;
  image: any | ImageSourcePropType;
  rating: number;
}

interface CulturalEvent {
  id: string;
  image: any | string | number;
  type: "Event" | "Workshop";
}

export default function Recommendation({ navigation }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const attractions: Attraction[] = [
    {
      id: "1",
      name: "Taman Sari",
      location: "Kota Yogyakarta, D.I. Yogyakarta",
      description:
        "Taman Sari, also known as the Water Castle, is a historical site located in Yogyakarta, Indonesia. Built in the mid-18...",
      image: require("../../assets/TamanSari.png"),
      rating: 4.8,
    },
    {
      id: "2",
      name: "Prambanan Temple",
      location: "Kota Yogyakarta, D.I. Yogyakarta",
      description:
        "Prambanan Temple is a majestic 9th-century Hindu temple complex located in Yogyakarta, Indonesia. Dedicated to the...",
      image: require("../../assets/Prambanan.png"),
      rating: 4.8,
    },
    {
      id: "3",
      name: "Parangtritis Beach",
      location: "Kab. Bantul, D.I. Yogyakarta",
      description:
        "Parangtritis Beach is a popular coastal destination in Yogyakarta, Indonesia, known for its stunning sunset views, rollin...",
      image: require("../../assets/Parangtritis.png"),
      rating: 4.8,
    },
    {
      id: "4",
      name: "Siung Beach",
      location: "Kab. Gunungkidul, D.I. Yogyakarta",
      description:
        "Siung Beach is a popular coastal destination in Yogyakarta, Indonesia, known for its stunning sunset views, rollin... See",
      image: require("../../assets/BeachLanding.png"),
      rating: 4.8,
    },
  ];

  const culturalEvents: CulturalEvent[] = [
    {
      id: "1",
      image: require("../../assets/PopularEvent1.png"),
      type: "Event",
    },
    {
      id: "2",
      image: require("../../assets/PopularEvent2.png"),
      type: "Event",
    },
    {
      id: "3",
      image: require("../../assets/Culture1.png"),
      type: "Workshop",
    },
    {
      id: "4",
      image: require("../../assets/Culture2.png"),
      type: "Workshop",
    },
  ];

  const handleEventPress = (event: CulturalEvent) => {
    // Tentukan nama dan lokasi berdasarkan tipe event
    const eventInfo = getEventInfo(event);
    
    router.push({
      pathname: "/culture/culturedetail",
      params: {
        id: event.id,
        image: eventInfo.imageUrl, // Menggunakan path gambar lokal dari mapping
        localImage: getLocalImageId(event.id), // Tambahan: ID untuk gambar lokal sebagai fallback
        type: event.type,
        name: eventInfo.name,
        location: eventInfo.location,
      },
    })
  }

  // Fungsi helper untuk mendapatkan ID gambar lokal
  const getLocalImageId = (eventId: string) => {
    switch (eventId) {
      case "1": return "PopularEvent1";
      case "2": return "PopularEvent2"; 
      case "3": return "Culture1";
      case "4": return "Culture2";
      default: return "PopularEvent1";
    }
  }

  const getEventInfo = (event: CulturalEvent) => {
    if (event.type === "Event") {
      switch (event.id) {
        case "1":
          return {
            name: "Festival Budaya Nusantara",
            location: "Taman Budaya Yogyakarta",
            imageUrl: "PopularEvent1" // Festival image path
          };
        case "2":
          return {
            name: "Pameran Warisan Budaya",
            location: "Museum Sonobudoyo",
            imageUrl: "PopularEvent2" // Museum exhibition path
          };
        default:
          return {
            name: "Cultural Event",
            location: "Yogyakarta",
            imageUrl: "PopularEvent1"
          };
      }
    } else { // Workshop
      switch (event.id) {
        case "3":
          return {
            name: "Workshop Batik Traditional",
            location: "Kampung Batik Laweyan",
            imageUrl: "Culture1" // Batik workshop path
          };
        case "4":
          return {
            name: "Kelas Tari Tradisional",
            location: "Sanggar Tari Yogyakarta",
            imageUrl: "Culture2" // Traditional dance path
          };
        default:
          return {
            name: "Cultural Workshop",
            location: "Yogyakarta",
            imageUrl: "Culture1"
          };
      }
    }
  }


  const renderAttractions = () => (
    <>
      {attractions.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.attractionCard}
          onPress={() => {
            // Navigate to detail screen
            router.push({
              pathname: "/destinationexplorer/detaildestination",
              params: {
                id: item.id,
                name: item.name,
                location: item.location,
                rating: item.rating.toString(),
                description: item.description,
              },
            });
          }}
        >
          <Image
            source={item.image}
            style={styles.attractionImage}
            resizeMode="cover"
          />
          <View style={styles.attractionInfo}>
            <View>
              <Text style={styles.attractionName}>{item.name}</Text>
              <Text style={styles.attractionLocation}>{item.location}</Text>
              <Text style={styles.attractionDescription}>
                {item.description}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#C93C3C" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );

  const renderCultureSync = () => (
    <>
      {/* Popular Event Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Event</Text>
      </View>

      <View style={styles.eventsGrid}>
        {culturalEvents
          .filter((event) => event.type === "Event")
          .map((event) => (
            <TouchableOpacity 
              key={event.id} 
              onPress={() => handleEventPress(event)}
              style={styles.eventCard}
              activeOpacity={0.8}
            >
              <Image
                source={
                  typeof event.image === "string"
                    ? { uri: event.image }
                    : event.image
                }
                style={styles.eventImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
      </View>

      {/* Learn Our Culture Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Learn Our Culture</Text>
      </View>

      <View style={styles.workshopsGrid}>
        {culturalEvents
          .filter((event) => event.type === "Workshop")
          .map((event) => (
            <TouchableOpacity 
              key={event.id} 
              onPress={() => handleEventPress(event)}
              style={styles.workshopCard}
              activeOpacity={0.8}
            >
              <Image
                source={
                  typeof event.image === "string"
                    ? { uri: event.image }
                    : event.image
                }
                style={styles.workshopImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#762727" />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "All" && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter("All")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "All" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "Culture Sync" && styles.activeFilterTab,
            activeFilter !== "Culture Sync" && styles.outlineFilterTab,
          ]}
          onPress={() => setActiveFilter("Culture Sync")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "Culture Sync" && styles.activeFilterText,
              activeFilter !== "Culture Sync" && { color: "#10367D" },
            ]}
          >
            Culture Sync
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {activeFilter === "All" ? renderAttractions() : renderCultureSync()}

        {/* Add some bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#762727",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterTab: {
    backgroundColor: "#10367D",
  },
  outlineFilterTab: {
    borderWidth: 1,
    borderColor: "#10367D",
  },
  filterText: {
    fontWeight: "500",
  },
  activeFilterText: {
    color: "white",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Original attraction styles
  attractionCard: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  attractionImage: {
    width: "100%",
    height: 150,
  },
  attractionInfo: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attractionName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  attractionLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  attractionDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    width: width - 100,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: "bold",
    color: "#C93C3C",
  },

  // Culture Sync styles
  sectionHeader: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  eventsGrid: {
    flexDirection: "row",
    justifyContent:"center",
    marginBottom: 20,
    gap: 10,
  },
  eventCard: {
    width: 175,
    height: 300,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  eventOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
  },
  eventTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  eventSubtitle: {
    color: "white",
    fontSize: 12,
    marginBottom: 5,
  },
  eventDetails: {
    marginTop: 5,
  },
  eventDate: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  eventTime: {
    color: "white",
    fontSize: 10,
  },
  eventLocation: {
    color: "white",
    fontSize: 9,
    marginTop: 2,
  },
  workshopsGrid: {
    flexDirection: "row",
    justifyContent:"center",
    marginBottom: 20,
    gap: 10,
  },
  workshopCard: {
    width: 175,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workshopImage: {
    width: "100%",
    height: "100%",
  },
  workshopOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(118, 39, 39, 0.9)",
    padding: 10,
  },
  workshopTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  workshopSubtitle: {
    color: "white",
    fontSize: 11,
    marginBottom: 5,
  },
  workshopDetails: {
    marginTop: 5,
  },
  workshopDate: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  workshopTime: {
    color: "white",
    fontSize: 10,
  },
  workshopPrice: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
  workshopLocation: {
    color: "white",
    fontSize: 9,
    marginTop: 2,
  },
});
