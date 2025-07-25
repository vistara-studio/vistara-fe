import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { smartPlannerService, SmartPlannerResponse } from '../../services/smartPlannerService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SmartHistory = () => {
  const insets = useSafeAreaInsets();
  const [historyData, setHistoryData] = useState<SmartPlannerResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      // Since we only have one API endpoint, we'll primarily use AsyncStorage for history
      // and just show the current trip if it exists
      const currentTrip = await AsyncStorage.getItem("tripPlan");
      if (currentTrip) {
        const parsedTrip: SmartPlannerResponse = JSON.parse(currentTrip);
        setHistoryData([parsedTrip]);
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.error('Error loading trip history:', error);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToGenerateNewPlan = () => {
    router.push({
      pathname: "/smartplanner/smartinput",
    });
  };

  const navigateToTripDetail = async (trip: SmartPlannerResponse) => {
    try {
      // Store the selected trip in AsyncStorage so it can be viewed
      await AsyncStorage.setItem("tripPlan", JSON.stringify(trip));
      router.push("/smartplanner/smartoutput");
    } catch (error) {
      console.error('Error storing trip data:', error);
      Alert.alert('Error', 'Failed to open trip details');
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10367D" />
          <Text style={styles.loadingText}>Loading trip history...</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#10367D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip History</Text>
        <TouchableOpacity style={styles.addButton} onPress={navigateToGenerateNewPlan}>
          <Ionicons name="add" size={24} color="#10367D" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {historyData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Trip History</Text>
            <Text style={styles.emptyMessage}>Start planning your first trip!</Text>
            <TouchableOpacity style={styles.generateButton} onPress={navigateToGenerateNewPlan}>
              <Text style={styles.generateButtonText}>Create New Plan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          historyData.map((trip, index) => (
            <TouchableOpacity 
              key={trip.id || index} 
              style={styles.cardContainer}
              onPress={() => navigateToTripDetail(trip)}
            >
              <Image
                source={{ 
                  uri: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=2069&auto=format&fit=crop' 
                }}
                style={styles.cardBackground}
              />
              <View style={styles.cardContent}>
                <Text style={styles.tripName}>{trip.destination} Trip</Text>
                <Text style={styles.tripDate}>
                  {formatDateRange(trip.start_date, trip.end_date)}
                </Text>
                
                <View style={styles.tagContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{trip.travel_style}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{trip.activity_intensity}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{formatCurrency(trip.budget)}</Text>
                  </View>
                </View>

                <Text style={styles.tripDays}>
                  {trip.itinerary.length} {trip.itinerary.length === 1 ? 'day' : 'days'} • {trip.itinerary.reduce((total, day) => total + day.activities.length, 0)} activities
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#10367D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 20,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  tripDate: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  tripDays: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10367D',
  },
  tagText: {
    fontSize: 12,
    color: '#10367D',
  },
  generateButton: {
    backgroundColor: '#10367D',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#10367D',
  },
});

export default SmartHistory;