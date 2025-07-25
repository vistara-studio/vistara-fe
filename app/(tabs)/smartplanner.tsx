import { useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SmartPlanner() {
  const flatListRef = useRef(null);

  const slides = [
    {
      id: "1",
      image: require("../../assets/SmarPlannerImage.png"),
    },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground source={item.image} className="flex-1 bg-cover">
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text className="text-white font-bold text-4xl text-center mb-2">
                  Smart Planner
                </Text>
                <Text className="text-center text-white text-md px-6 shadow-xl ">
                  Smart Trip-AI Planner creates a personalized itinerary using your preferences and real-time data, making travel planning effortless
                </Text>
              </View>

              <TouchableOpacity className="bg-[#10367D] py-[15px] rounded-xl items-center mx-[10px] " onPress={() => router.push("/smartplanner/smartinput")}>
                <Text style={styles.continueButtonText}>Generate Plan</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        initialScrollIndex={0}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
  },
  skipText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 200,
    paddingHorizontal: 20,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.9,
  },
  continueButton: {
    backgroundColor: "#762727",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    padding: 20,
  },
});