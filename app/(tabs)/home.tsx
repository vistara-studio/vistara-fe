import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { router, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: -7.7956,
    longitude: 110.3695,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  const BOTTOM_SHEET_COLLAPSED = height * 0.75;
  const BOTTOM_SHEET_EXPANDED = height * 0.1;
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_COLLAPSED)).current;
  const [sheetPosition, setSheetPosition] = useState(BOTTOM_SHEET_COLLAPSED);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const locations = [
    { id: 1, latitude: -6.2088, longitude: 106.8456, title: "Jakarta" },
    { id: 2, latitude: -7.2575, longitude: 112.7521, title: "Surabaya" },
    { id: 3, latitude: -7.7956, longitude: 110.3695, title: "Yogyakarta" },
    { id: 4, latitude: -8.4095, longitude: 115.1889, title: "Denpasar" },
    { id: 5, latitude: -6.9175, longitude: 107.6191, title: "Bandung" },
  ];

  // Handle gesture events for the handle
  const onHandleGestureEvent = useCallback(
    Animated.event([{ nativeEvent: { translationY: translateY } }], {
      useNativeDriver: false,
    }),
    []
  );

  const onHandleStateChange = useCallback(
    (event) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationY, velocityY } = event.nativeEvent;
        let newPosition;
        let newExpanded;
        const currentPosition = sheetPosition + translationY;
        const midPoint = (BOTTOM_SHEET_COLLAPSED + BOTTOM_SHEET_EXPANDED) / 2;

        if (velocityY > 1000) {
          newPosition = BOTTOM_SHEET_COLLAPSED;
          newExpanded = false;
        } else if (velocityY < -1000) {
          newPosition = BOTTOM_SHEET_EXPANDED;
          newExpanded = true;
        } else {
          if (currentPosition > midPoint) {
            newPosition = BOTTOM_SHEET_COLLAPSED;
            newExpanded = false;
          } else {
            newPosition = BOTTOM_SHEET_EXPANDED;
            newExpanded = true;
          }
        }

        setSheetPosition(newPosition);
        setIsExpanded(newExpanded);

        if (!newExpanded && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }

        Animated.spring(translateY, {
          toValue: newPosition,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
    [sheetPosition, BOTTOM_SHEET_COLLAPSED, BOTTOM_SHEET_EXPANDED]
  );

  const toggleBottomSheet = useCallback(() => {
    const newPosition = isExpanded ? BOTTOM_SHEET_COLLAPSED : BOTTOM_SHEET_EXPANDED;
    const newExpanded = !isExpanded;

    setSheetPosition(newPosition);
    setIsExpanded(newExpanded);

    if (isExpanded && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }

    Animated.spring(translateY, {
      toValue: newPosition,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [isExpanded, BOTTOM_SHEET_COLLAPSED, BOTTOM_SHEET_EXPANDED]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNavigation = (route) => {
    setShowDropdown(false);
    router.push(route);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={setRegion}
        mapType="satellite"
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#ef4444",
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "white",
              }}
            />
          </Marker>
        ))}
      </MapView>

      {!isExpanded && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <View style={{ height: StatusBar.currentHeight || 44 }} />
          <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap:8 }}>
                   <TouchableOpacity
                onPress={toggleDropdown}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#10367D",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="menu" size={18} color="white" />
              </TouchableOpacity>
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 36,
                      fontWeight: "bold",
                    }}
                  >
                    Vistara
                  </Text>
                </View>
              </View>

            </View>
          </View>
        </View>
      )}

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  position: "absolute",
                  top: (StatusBar.currentHeight || 44) + 80,
                  left: 16,
                  backgroundColor: "white",
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 8,
                  minWidth: 150,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleNavigation("/auth/login")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f3f4f6",
                  }}
                >
                  <Ionicons name="log-in-outline" size={20} color="#374151" />
                  <Text
                    style={{
                      marginLeft: 12,
                      fontSize: 16,
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleNavigation("/auth/register")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Ionicons name="person-add-outline" size={20} color="#374151" />
                  <Text
                    style={{
                      marginLeft: 12,
                      fontSize: 16,
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          backgroundColor: "white",
          height: height,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          transform: [{ translateY: translateY }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <PanGestureHandler
          onGestureEvent={onHandleGestureEvent}
          onHandlerStateChange={onHandleStateChange}
        >
          <Animated.View>
            <TouchableOpacity
              onPress={toggleBottomSheet}
              style={{
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 20,
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: "#d1d5db",
                  borderRadius: 2,
                  marginBottom: 8,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={isExpanded ? "chevron-down" : "chevron-up"}
                  size={16}
                  color="#9ca3af"
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    marginHorizontal: 8,
                    textAlign: "center",
                  }}
                >
                  {isExpanded
                    ? "Swipe down or tap to close"
                    : "Swipe up or tap to open"}
                </Text>
                <Ionicons
                  name={isExpanded ? "chevron-down" : "chevron-up"}
                  size={16}
                  color="#9ca3af"
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          scrollEventThrottle={16}
          bounces={false}
          scrollEnabled={isExpanded}
        >
          <FeaturedCards />
          <SectionHeader title="Recommendation For You" />
          <RecommendationCards />
          <SectionHeader title="Best Deal For You" />
          <BestDealCards />
          <SectionHeader title="Popular Destinations" />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const images = {
  slide1: require("../../assets/Celebrate.png"),
  slide2: require("../../assets/Embrace.png"),
  slide3: require("../../assets/Borobudur.png"),
};

const FeaturedCards = () => {
  const featuredData = [
    {
      id: "1",
      title: "CELEBRATE INDONESIAN\nDIVERSITY",
      buttonText: "START EXPLORE",
      image: images.slide1,
    },
    {
      id: "2",
      title: "EMBRACE\nCULTURE",
      buttonText: "DISCOVER NOW",
      image: images.slide2,
    },
    {
      id: "3",
      title: "NATURAL\nWONDERS",
      buttonText: "EXPLORE",
      image: images.slide3,
    },
  ];

  return (
    <View style={{ marginBottom: 32 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featuredData.map((item) => (
          <TouchableOpacity key={item.id} style={{ marginRight: 16 }}>
            <ImageBackground
              source={item.image}
              imageStyle={{ borderRadius: 16 }}
              style={{
                borderRadius: 16,
                padding: 24,
                alignItems: "center",
                justifyContent: "center",
                width: width * 0.75,
                height: 140,
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {item.title}
              </Text>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {item.buttonText}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const SectionHeader = ({ title }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        marginTop: 8,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#1f2937",
        }}
      >
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/destinationexplorer/recommendation")}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#2563eb",
          }}
        >
          View All
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Helper function to render stars
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Ionicons key={i} name="star" size={12} color="#FFD700" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<Ionicons key={i} name="star-half" size={12} color="#FFD700" />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={12} color="#FFD700" />);
    }
  }
  return stars;
};

// Updated Destination Card Component with navigation
const DestinationCard = ({
  name,
  category,
  rating,
  image,
  cardWidth,
  cardHeight,
  style,
  destinationId,
}) => {
  const handleCardPress = () => {
    // Navigate to your existing integrated destination detail page
    router.push({
      pathname: "/destinationexplorer/detaildestination", // Your existing route
      params: {
        id: destinationId,
        name: name,
        location: category, // or pass actual location data
        image: image,
        rating: rating
      }
    });
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={[
        {
          width: cardWidth || 150,
          marginBottom: 16,
        },
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: cardHeight || 100 }}
          resizeMode="cover"
        />
        <View style={{ padding: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#1f2937",
            }}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 2,
            }}
          >
            {category}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 6,
            }}
          >
            {renderStars(rating)}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RecommendationCards = () => {
  const recommendationData = [
    {
      id: "1",
      name: "Taman Sari",
      category: "History",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Prambanan Temple",
      category: "History",
      rating: 5,
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Borobudur",
      category: "History",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "Malioboro Street",
      category: "Culture",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 32,
      }}
    >
      {recommendationData.map((item) => (
        <DestinationCard
          key={item.id}
          destinationId={item.id}
          name={item.name}
          category={item.category}
          rating={item.rating}
          image={item.image}
          cardWidth={(width - 48) * 0.48}
          cardHeight={120}
          style={{ marginBottom: 16 }}
        />
      ))}
    </View>
  );
};

const BestDealCards = () => {
  const bestDealData = [
    {
      id: "1",
      name: "Bali Beach",
      category: "Beach",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Raja Ampat",
      category: "Marine",
      rating: 5,
      image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Komodo Island",
      category: "Nature",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <View style={{ marginBottom: 32 }}>
      {bestDealData.map((item) => (
        <TouchableOpacity 
          key={item.id} 
          style={{ marginBottom: 16 }}
          onPress={() => router.push({
            pathname: "/destinationexplorer/detaildestination",
            params: {
              id: item.id,
              name: item.name,
              location: item.category,
              image: item.image,
              rating: item.rating
            }
          })}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: 160 }}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {item.category}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 8,
                  }}
                >
                  {renderStars(item.rating)}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HomeScreen;