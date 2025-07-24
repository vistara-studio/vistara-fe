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
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: -7.7956,
    longitude: 110.3695,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  // Bottom sheet animation - Start collapsed
  const BOTTOM_SHEET_COLLAPSED = height * 0.75; // 50% from top (50% visible)
  const BOTTOM_SHEET_EXPANDED = height * 0.1; // 10% from top (90% visible)

  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_COLLAPSED)).current;
  const [sheetPosition, setSheetPosition] = useState(BOTTOM_SHEET_COLLAPSED);
  const [isExpanded, setIsExpanded] = useState(false);

  const recommendations = [
    {
      id: 1,
      name: "Taman Sari",
      category: "History",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1555400082-8c5cd5b3c3b1?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Prambanan Temple",
      category: "History",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Malioboro Street",
      category: "Culture",
      rating: 4.3,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    },
    {
      id: 4,
      name: "Dieng Plateau",
      category: "Nature",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    },
  ];

  const bestDeals = [
    {
      id: 1,
      name: "Borobudur Temple",
      category: "History",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      name: "Parangtritis",
      category: "Beach",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    },
  ];

  const locations = [
    { id: 1, latitude: -6.2088, longitude: 106.8456, title: "Jakarta" },
    { id: 2, latitude: -7.2575, longitude: 112.7521, title: "Surabaya" },
    { id: 3, latitude: -7.7956, longitude: 110.3695, title: "Yogyakarta" },
    { id: 4, latitude: -8.4095, longitude: 115.1889, title: "Denpasar" },
    { id: 5, latitude: -6.9175, longitude: 107.6191, title: "Bandung" },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={14} color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color="#FFD700" />
        );
      }
    }
    return stars;
  };

  const onGestureEvent = useCallback(
    Animated.event([{ nativeEvent: { translationY: translateY } }], {
      useNativeDriver: false,
    }),
    []
  );

  const onHandlerStateChange = useCallback(
    (event) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationY, velocityY } = event.nativeEvent;
        let newPosition;
        let newExpanded;

        const currentPosition = sheetPosition + translationY;
        const midPoint = (BOTTOM_SHEET_COLLAPSED + BOTTOM_SHEET_EXPANDED) / 2;

        // Determine target position based on velocity and current position
        if (velocityY > 1000) {
          // Fast swipe down - collapse
          newPosition = BOTTOM_SHEET_COLLAPSED;
          newExpanded = false;
        } else if (velocityY < -1000) {
          // Fast swipe up - expand
          newPosition = BOTTOM_SHEET_EXPANDED;
          newExpanded = true;
        } else {
          // Slow gesture - snap to nearest
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

        Animated.spring(translateY, {
          toValue: newPosition,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
    [sheetPosition]
  );

  return (
    <View className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Full Screen Map Background */}
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
            <View className="w-3 h-3 bg-red-500 rounded-full border border-white" />
          </Marker>
        ))}
      </MapView>

      {/* Header Overlay - Only visible when collapsed */}
      {!isExpanded && (
        <View className="absolute top-0 left-0 right-0 z-10">
          <View style={{ height: StatusBar.currentHeight || 44 }} />

          {/* Vistara Logo */}
          <View className="px-4 py-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center mr-3">
                <Ionicons name="list-outline" size={18} color="#fff" />
              </View>
              <View>
                <Text className="text-white text-5xl font-bold">Vistara</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Bottom Sheet */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          className="absolute left-0 right-0 bg-white"
          style={{
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
          {/* Handle */}
          <View className="items-center py-3">
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Content */}
          <View className="flex-1 px-4">
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              {/* Featured Cards - Only show when expanded */}
              {isExpanded && (
                <View className="mb-6">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity className="mr-4">
                      <View
                        className="bg-black/80 rounded-2xl p-6 items-center justify-center"
                        style={{ width: width * 0.75, height: 140 }}
                      >
                        <Text className="text-white text-lg font-bold text-center mb-3">
                          CELEBRATE INDONESIAN{"\n"}DIVERSITY
                        </Text>
                        <TouchableOpacity className="px-6 py-2 border-2 border-white rounded-full">
                          <Text className="text-white text-sm font-semibold">
                            START EXPLORE
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <View
                        className="bg-black/80 rounded-2xl p-6 items-center justify-center"
                        style={{ width: width * 0.75, height: 140 }}
                      >
                        <Text className="text-white text-lg font-bold text-center">
                          EMBRACE{"\n"}CULTURE
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}

              {/* Recommendation Section */}
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Recommendation For You
              </Text>

              <View className="flex-row flex-wrap justify-between mb-6">
                {recommendations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="mb-4"
                    style={{ width: (width - 48) * 0.48 }}
                  >
                    <View className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: "100%", height: 100 }}
                        resizeMode="cover"
                      />
                      <View className="p-3">
                        <Text
                          className="font-bold text-sm text-gray-800"
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text className="text-gray-600 text-xs mt-1">
                          {item.category}
                        </Text>
                        <View className="flex-row mt-2">
                          {renderStars(item.rating)}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Best Deal Section */}
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Best Deal For You
              </Text>

              <View className="space-y-4">
                {bestDeals.map((item) => (
                  <TouchableOpacity key={item.id} className="mb-4">
                    <View className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                      <View className="relative">
                        <Image
                          source={{ uri: item.image }}
                          style={{ width: "100%", height: 160 }}
                          resizeMode="cover"
                        />
                        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                          <Text className="text-white font-bold text-lg">
                            {item.name}
                          </Text>
                          <Text className="text-white/90 text-sm mt-1">
                            {item.category}
                          </Text>
                          <View className="flex-row mt-2">
                            {renderStars(item.rating)}
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default HomeScreen;
