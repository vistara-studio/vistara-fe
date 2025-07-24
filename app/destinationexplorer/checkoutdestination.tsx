import { useState } from "react"
import { ScrollView, View, Text, TouchableOpacity, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"

export default function CheckoutDestination() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentMonth, setCurrentMonth] = useState("Maret 2025")
  const params = useLocalSearchParams()

  const ticketPrice = 30000
  const subtotal = ticketPrice * quantity
  const discount = 0
  const total = subtotal - discount

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity((prev) => prev + 1)
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }

  return (
    <View className="flex-1 bg-white py-10">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View className="flex-row items-center p-5 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold">Checkout</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Event Info */}
        <View className="p-5 bg-gray-50 mx-5 mt-5 rounded-lg">
          <Text className="font-semibold text-base mb-1">Entrance Ticket {params.eventName}</Text>
          <Text className="text-sm font-medium text-gray-700">Non-refundable</Text>
          <Text className="text-xs text-gray-500 mt-1">You can not refund your payment when you cancel</Text>
        </View>

        {/* Travel Dates */}
        <View className="p-5">
          <Text className="text-base font-semibold mb-4">Travel Dates</Text>

          {/* Month Navigation */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={20} color="#666" />
            </TouchableOpacity>
            <Text className="font-medium">{currentMonth}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Week Days Header */}
          <View className="flex-row justify-between mb-2">
            {weekDays.map((day) => (
              <Text key={day} className="text-xs text-gray-500 w-10 text-center">
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="flex-row flex-wrap">
            {daysInMonth.map((day) => {
              const isSelected = selectedDate === day
              const isHighlighted = [11, 12, 13, 14].includes(day)

              return (
                <TouchableOpacity
                  key={day}
                  className={`w-10 h-10 items-center justify-center m-1 rounded ${
                    isSelected ? "bg-[#10367D]" : isHighlighted ? "bg-red-100" : ""
                  }`}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text
                    className={`text-sm ${
                      isSelected
                        ? "text-white font-semibold"
                        : isHighlighted
                          ? "text-red-600 font-medium"
                          : "text-gray-700"
                    }`}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Quantity Selector */}
        <View className="px-5 py-3">
          <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-lg">
            <View>
              <Text className="text-sm text-gray-600">Pax</Text>
              <Text className="font-semibold">{formatCurrency(ticketPrice)}</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-8 h-8 bg-[#10367D] rounded-full items-center justify-center"
                onPress={() => handleQuantityChange(false)}
              >
                <Ionicons name="remove" size={16} color="white" />
              </TouchableOpacity>
              <Text className="mx-4 font-semibold text-base">{quantity}</Text>
              <TouchableOpacity
                className="w-8 h-8 bg-[#10367D] rounded-full items-center justify-center"
                onPress={() => handleQuantityChange(true)}
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View className="p-5">
          <Text className="text-base font-semibold mb-4">Payment Summary</Text>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Subtotal</Text>
              <Text className="font-medium">{formatCurrency(subtotal)}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-700">Discount Total</Text>
              <Text className="font-medium">{formatCurrency(discount)}</Text>
            </View>

            <View className="border-t border-gray-200 pt-3">
              <View className="flex-row justify-between">
                <Text className="font-semibold">Total Payment</Text>
                <Text className="font-semibold">{formatCurrency(total)}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Buy Ticket Button */}
      <View className="py-2 mb-10 border-[1px] bg-[#10367D] ">
        <TouchableOpacity
          className="bg-primary py-4 rounded-lg items-center"
          onPress={() =>
            router.push({
              pathname: "/destinationexplorer/successdestination",
              params: {
                eventName: params.eventName,
                quantity: quantity.toString(),
                total: total.toString(),
                date: selectedDate ? `${selectedDate} September 2025` : "19 September 2025",
              },
            })
          }
        >
          <Text className="text-white font-semibold text-base">Buy Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
