"use client"
import { useState } from "react"
import { ScrollView, View, Text, Image, TouchableOpacity, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
interface Review {
  id: string
  name: string
  avatar: string
  rating: number
  comment: string
  timeAgo: string
}

export default function DetailDestination() {
  const [activeTab, setActiveTab] = useState("Overview")
  const params = useLocalSearchParams()

  // Helper function to get local image source
  const getImageSource = (imagePath: string | string[]) => {
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    
    switch (path) {
      case "PopularEvent1":
        return require("../../assets/PopularEvent1.png");
      case "PopularEvent2":
        return require("../../assets/PopularEvent2.png");
      case "Culture1":
        return require("../../assets/Culture1.png");
      case "Culture2":
        return require("../../assets/Culture2.png");
      default:
        // Fallback to URL if it's not a local image path
        return { uri: path };
    }
  }

  const reviews: Review[] = [
    {
      id: "1",
      name: "Nadya",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5.0,
      comment: "Pertunjukannya Sangat Cantik Dan Seru, Memperkenalkan Anak Saya Dengan Budaya",
      timeAgo: "6 months ago",
    },
    {
      id: "2",
      name: "Raihani",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5.0,
      comment: "Suasananya Sangat Nyaman, Tempatnya Sangat Bersih Dan Indah",
      timeAgo: "6 months ago",
    },
    {
      id: "3",
      name: "Echa",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5.0,
      comment: "Pentas Di Rencanakan Dengan Baik Sehingga Eksekusinya Sangat Baik",
      timeAgo: "6 months ago",
    },
    {
      id: "4",
      name: "Ghaniya",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5.0,
      comment: "Pertunjukan Yang Sangat Luar Biasa",
      timeAgo: "6 months ago",
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons key={index} name="star" size={12} color={index < rating ? "#FFD700" : "#E5E5E5"} />
    ))
  }

  const renderOverview = () => (
    <View className="p-5">
      <Text className="text-sm text-gray-700 leading-6">
        is a grand celebration that showcases the rich cultural diversity of Indonesia, from Sabang to Merauke. The
        event features a wide variety of traditional performances, including regional dances, ethnic music, and folk
        theater. It also highlights exhibitions of handicrafts, traditional culinary delights, and indigenous clothing
        from various regions across the archipelago.
        {"\n\n"}
        The festival aims to preserve Indonesia's cultural heritage, introduce the nation's diverse traditions to
        younger generations, and strengthen national unity in the spirit of Bhinneka Tunggal Ika (Unity in Diversity).
        With its vibrant atmosphere and spirit of togetherness, the Nusantara Cultural Festival serves as a source of
        inspiration for all who wish to experience the beauty and richness of Indonesia's cultural treasures in one
        place.
      </Text>
    </View>
  )

  const renderReviews = () => (
    <View className="p-5">
      <Text className="text-base font-semibold mb-4">Reviews (900)</Text>
      {reviews.map((review) => (
        <View key={review.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <View className="flex-row items-center mb-3">
            <Image source={{ uri: review.avatar }} className="w-10 h-10 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">{review.name}</Text>
              <Text className="text-xs text-gray-500">{review.timeAgo}</Text>
            </View>
          </View>
          <Text className="text-sm text-gray-700 mb-2">{review.comment}</Text>
          <View className="flex-row">
            {renderStars(review.rating)}
            <Text className="ml-2 text-xs font-semibold">{review.rating}</Text>
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <View className="flex-1 ">
      <StatusBar barStyle="light-content" backgroundColor="#762727" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative">
          <Image source={getImageSource(params.image)} className="w-full h-80" resizeMode="cover" />
          <TouchableOpacity
            className="absolute top-12 left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="absolute bottom-10 right-6 bg-[#10367D] px-6 py-3 rounded-lg">
            <Text className="text-white text-xs font-medium">Route</Text>
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
            className={`flex-1 py-4 items-center ${activeTab === "Overview" ? "border-b-2 border-primary" : ""}`}
            onPress={() => setActiveTab("Overview")}
          >
            <Text className={`font-medium ${activeTab === "Overview" ? "text-primary" : "text-gray-600"}`}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-4 items-center ${activeTab === "Reviews" ? "border-b-2 border-primary" : ""}`}
            onPress={() => setActiveTab("Reviews")}
          >
            <Text className={`font-medium ${activeTab === "Reviews" ? "text-primary" : "text-gray-600"}`}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "Overview" ? renderOverview() : renderReviews()}
      </ScrollView>

      {/* Book Ticket Button */}
      <View className="py-2 mb-10 border-[1px]  bg-[#10367D] px-20">
        <TouchableOpacity
          className=" py-4  rounded-lg items-center"
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