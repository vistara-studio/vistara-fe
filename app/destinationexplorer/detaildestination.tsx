"use client"
import { useState } from "react"
import { ScrollView, View, Text, Image, TouchableOpacity, StatusBar, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"

const { width } = Dimensions.get('window');

const Review = {
  id: "",
  name: "",
  avatar: "",
  rating: 0,
  comment: "",
  timeAgo: ""
}

export default function DetailDestination() {
  const [activeTab, setActiveTab] = useState("Overview")
  const params = useLocalSearchParams()

  // Enhanced destination data - this could come from API based on params.id
  const getDestinationData = () => {
    // Default data structure
    const defaultData = {
      culturalStory: "Nestled in East Java, this destination is a historically rich archaeological site believed to be the former capital of the great Majapahit Empire, one of the largest and most influential kingdoms in Southeast Asia during the 13th to 15th centuries. Scattered across the area are remnants of red-brick temples, bathing pools, royal tombs, and canals, offering a glimpse into the advanced urban planning and cultural sophistication of the time.",
      extendedStory: "More than just a tourist destination, this place tells the enduring story of a golden age in Indonesian history. It reflects the Majapahit Empire's legacy of unity, tolerance, and cultural brilliance, which laid the foundation for the archipelago's identity today. Walking through this ancient city evokes a sense of pride and wonder, reminding modern Indonesians of their ancestors' intellectual and artistic achievements.",
      bestTimeToVisit: "Early morning (07:00-10:00) offers the best natural lighting and pleasantly cool weather conditions.",
      photos: [
        "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      ],
      manuscriptImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
      manuscriptQuote: "I bhumi Nusantara ika nata rakawi sang amukti palapa Sang Maha Patih Gajah Mada.",
      manuscriptTranslation: "Seluruh wilayah Nusantara itu diperintahkan oleh sang penyair agung dan pelaksana Sumpah Palapa, Patih Gajah Mada."
    };

    // You can customize data based on params.id or params.name
    return defaultData;
  };

  const destinationData = getDestinationData();

  const reviews = [
    {
      id: "1",
      name: "Nadya",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      rating: 5.0,
      comment: "Pertunjukannya Sangat Cantik Dan Seru, Memperkenalkan Anak Saya Dengan Budaya",
      timeAgo: "6 months ago",
    },
    {
      id: "2",
      name: "Raihani",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      rating: 5.0,
      comment: "Suasananya Sangat Nyaman, Tempatnya Sangat Bersih Dan Indah",
      timeAgo: "6 months ago",
    },
    {
      id: "3",
      name: "Echa",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      rating: 5.0,
      comment: "Pentas Di Rencanakan Dengan Baik Sehingga Eksekusinya Sangat Baik",
      timeAgo: "6 months ago",
    },
    {
      id: "4",
      name: "Ghaniya",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop&crop=face",
      rating: 5.0,
      comment: "Pertunjukan Yang Sangat Luar Biasa",
      timeAgo: "6 months ago",
    },
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons key={index} name="star" size={12} color={index < rating ? "#FFD700" : "#E5E5E5"} />
    ))
  }

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Action Buttons */}
      <View className="flex-row px-4 py-4 gap-3">
        <TouchableOpacity className="px-4 py-2 border border-blue-600 rounded-full bg-white">
          <Text className="text-blue-600 text-sm font-medium">Cultural Story</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="px-4 py-2 border border-blue-600 rounded-full bg-white">
          <Text className="text-blue-600 text-sm font-medium">Manuscript</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="px-4 py-2 border border-blue-600 rounded-full bg-white">
          <Text className="text-blue-600 text-sm font-medium">Plan your visit</Text>
        </TouchableOpacity>
      </View>

      {/* Cultural Story Section */}
      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-3">Cultural Story</Text>
        <Text className="text-sm text-gray-700 leading-6 text-justify mb-3">
          {destinationData.culturalStory}
        </Text>
        <Text className="text-sm text-gray-700 leading-6 text-justify">
          {destinationData.extendedStory}
        </Text>
      </View>

      {/* Manuscript Section */}
      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-3">Manuscript</Text>
        
        <View className="bg-gray-100 rounded-xl p-4 mb-4">
          <Image
            source={{ uri: destinationData.manuscriptImage }}
            className="w-full h-32 rounded-lg mb-3"
            resizeMode="cover"
          />
          
          <View className="border-l-4 border-blue-400 pl-3 bg-blue-50 p-3 rounded-lg">
            <Text className="text-sm italic text-blue-800 leading-5">
              "{destinationData.manuscriptQuote}"
            </Text>
            <Text className="text-xs text-gray-600 mt-2 leading-4">
              {destinationData.manuscriptTranslation}
            </Text>
          </View>
        </View>

        <TouchableOpacity className="bg-blue-600 py-3 rounded-lg items-center">
          <Text className="text-white text-base font-semibold">Full Manuscript</Text>
        </TouchableOpacity>
      </View>

      {/* Plan your Visit Section */}
      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Plan your Visit</Text>
        
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-lg items-center">
            <Text className="text-white text-base font-semibold">Add to Itinerary</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-1 bg-sky-300 py-3 rounded-lg items-center">
            <Text className="text-white text-base font-semibold">Book Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* Best time to visit */}
        <View className="flex-row items-center bg-slate-50 p-3 rounded-lg mb-4">
          <Ionicons name="time-outline" size={20} color="#2563eb" />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-semibold text-gray-800 mb-1">Best time to visit</Text>
            <Text className="text-xs text-gray-600 leading-4">
              {destinationData.bestTimeToVisit}
            </Text>
          </View>
        </View>
      </View>

      {/* Photos Section */}
      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-3">Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {destinationData.photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              className="mr-3 rounded-lg overflow-hidden"
            >
              <Image
                source={{ uri: photo }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Original Overview Content */}
      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-3">About This Place</Text>
        <Text className="text-sm text-gray-700 leading-6">
          is a grand celebration that showcases the rich cultural diversity of Indonesia, from Sabang to Merauke. The
          event features a wide variety of traditional performances, including regional dances, ethnic music, and folk
          theater. It also highlights exhibitions of handicrafts, traditional culinary delights, and indigenous clothing
          from various regions across the archipelago.{"\n\n"}
          The festival aims to preserve Indonesia's cultural heritage, introduce the nation's diverse traditions to
          younger generations, and strengthen national unity in the spirit of Bhinneka Tunggal Ika (Unity in Diversity).
          With its vibrant atmosphere and spirit of togetherness, the Nusantara Cultural Festival serves as a source of
          inspiration for all who wish to experience the beauty and richness of Indonesia's cultural treasures in one
          place.
        </Text>
      </View>
    </ScrollView>
  )

  const renderReviews = () => (
    <View className="p-5">
      <Text className="text-base font-semibold mb-4">Reviews (900)</Text>
      {reviews.map((review) => (
        <View key={review.id} className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-3">
            <Image source={{ uri: review.avatar }} className="w-10 h-10 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">{review.name}</Text>
            </View>
            <Text className="text-xs text-gray-500">{review.timeAgo}</Text>
          </View>
          <Text className="text-sm text-gray-700 mb-3 leading-5">{review.comment}</Text>
          <View className="flex-row items-center">
            {renderStars(review.rating)}
            <Text className="ml-2 text-sm font-semibold text-gray-800">{review.rating}</Text>
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#762727" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative">
          <Image
            source={{ uri: Array.isArray(params.image) ? params.image[0] : params.image }}
            className="w-full h-80"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-12 left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          
          {/* 360° Button */}
          <TouchableOpacity className="absolute bottom-4 right-4 bg-blue-600 px-3 py-1 rounded-2xl flex-row items-center">
            <Ionicons name="camera-outline" size={14} color="white" />
            <Text className="text-white text-xs font-medium ml-1">360°</Text>
          </TouchableOpacity>
        </View>

        {/* Event Info */}
        <View className="p-5 bg-white">
          <Text className="text-xl font-bold text-gray-800 mb-1">{params.name}</Text>
          <Text className="text-sm text-gray-600">{params.location}</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 py-4 items-center ${activeTab === "Overview" ? "border-b-2 border-blue-600" : ""}`}
            onPress={() => setActiveTab("Overview")}
          >
            <Text className={`font-medium ${activeTab === "Overview" ? "text-blue-600" : "text-gray-600"}`}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-4 items-center ${activeTab === "Reviews" ? "border-b-2 border-blue-600" : ""}`}
            onPress={() => setActiveTab("Reviews")}
          >
            <Text className={`font-medium ${activeTab === "Reviews" ? "text-blue-600" : "text-gray-600"}`}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="bg-gray-50 min-h-screen">
          {activeTab === "Overview" ? renderOverview() : renderReviews()}
        </View>
      </ScrollView>

      {/* Book Ticket Button */}
      <View className="py-2 mb-10 border-[1px] bg-[#10367D] px-20">
        <TouchableOpacity
          className="py-4 rounded-lg items-center"
          onPress={() =>
            router.push({
              pathname: "/destinationexplorer/checkoutdestination",
              params: {
                eventName: params.name,
                eventLocation: params.location,
              },
            })
          }
        >
          <Text className="text-white font-semibold text-base">Book Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}