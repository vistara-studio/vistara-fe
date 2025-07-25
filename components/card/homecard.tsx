import { TouchableOpacity, View, Text, Image } from "react-native";
import { router } from "expo-router"; // Using expo-router for React Native navigation
import { Ionicons } from "@expo/vector-icons"; // For star icons

// Render star rating function
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Ionicons key={i} name="star" size={14} color="#FFD700" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<Ionicons key={i} name="star-half" size={14} color="#FFD700" />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={14} color="#FFD700" />);
    }
  }
  return stars;
};

// Define prop types
interface DestinationCardProps {
  name: string;
  category: string;
  rating: number;
  image: string;
  cardWidth?: number;
  cardHeight?: number;
  style?: any;
  destinationId: string;
}

// Update your DestinationCard component in the homepage
const DestinationCard = ({
  name,
  category,
  rating,
  image,
  cardWidth,
  cardHeight,
  style,
  destinationId,
}: DestinationCardProps) => {
  const handleCardPress = () => {
    // Navigate to the integrated destination detail page using expo-router
    router.push({
      pathname: "/destinationexplorer/detaildestination",
      params: {
        id: destinationId,
        name: name,
        location: category, // or pass actual location
        image: image,
        rating: rating.toString()
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
      {/* Rest of your card component remains the same */}
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

export default DestinationCard;