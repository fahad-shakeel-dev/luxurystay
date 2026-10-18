"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { UtensilsCrossed } from "lucide-react"
import Swal from "sweetalert2"


export default function FoodOrderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [foodItems, setFoodItems] = useState([])
  const [cart, setCart] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.replace("/auth/login")
      return
    }
    fetchData()
  }, [session, status])

  const fetchData = async () => {
    try {
      const [foodRes, bookingsRes] = await Promise.all([fetch("/api/food"), fetch("/api/bookings")])
      const [foodData, bookingsData] = await Promise.all([foodRes.json(), bookingsRes.json()])

      if (foodData.success) {
        setFoodItems(foodData.data.filter((item) => item.isAvailable))
      }
      if (bookingsData.success) {
        setBookings(bookingsData.data.filter((booking) => booking.userId._id === session?.user?.id))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (foodItem) => {
    const existingItem = cart.find((item) => item.foodId === foodItem._id)
    if (existingItem) {
      setCart(cart.map((item) => (item.foodId === foodItem._id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([
        ...cart,
        {
          foodId: foodItem._id,
          name: foodItem.name,
          price: foodItem.price,
          quantity: 1,
        },
      ])
    }
  }

  const removeFromCart = (foodId) => {
    setCart(cart.filter((item) => item.foodId !== foodId))
  }

  const updateQuantity = (foodId, quantity) => {
    if (quantity === 0) {
      removeFromCart(foodId)
    } else {
      setCart(cart.map((item) => (item.foodId === foodId ? { ...item, quantity } : item)))
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmitOrder = async () => {
    if (!selectedBooking || !deliveryAddress || cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please select a booking, add items to cart, and provide delivery address.",
      })
      return
    }

    setSubmitting(true)
    try {
      const orderData = {
        userId: session?.user?.id,
        bookingId: selectedBooking,
        items: cart.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotalAmount(),
        deliveryAddress,
        specialInstructions,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
      const data = await response.json()
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: "Your food order has been placed successfully.",
          confirmButtonText: "OK",
        })
        setCart([])
        setSelectedBooking("")
        setDeliveryAddress("")
        setSpecialInstructions("")
        router.push("/user-dashboard?tab=orders") // Redirect to user orders
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: error.message || "Failed to place order",
        confirmButtonText: "OK",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const approvedBookings = bookings.filter((booking) => booking.status === "approved")
  const canOrderFood = approvedBookings.length > 0

  

  if (!canOrderFood) {
    return (
      <motion.div
        key="food"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-gray-50 py-8 flex items-center justify-center"
      >
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center max-w-md w-full">
          <UtensilsCrossed className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Food Ordering Not Available</h2>
          <p className="text-gray-700">You need to have an approved room booking to order food.</p>
          <button
            onClick={() => router.push("/book-room")}
            className="mt-6 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Book a Room Now
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div
        key="food"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        {/* Order Form */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Order Food</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Select Booking</label>
                <select
                  value={selectedBooking}
                  onChange={(e) => setSelectedBooking(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                  required
                >
                  <option value="">Select a booking</option>
                  {approvedBookings.map((booking) => (
                    <option key={booking._id} value={booking._id}>
                      Room {booking.roomId.roomNumber} - {booking.guestName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                  placeholder="Room number or specific location"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-1">Special Instructions</label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>
        </div>

        {/* Food Menu */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-gray-700 text-sm mb-2">{item.description}</p>
                  <p className="text-xs text-gray-700 mb-2">Category: {item.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">₨{item.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.foodId} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-700">₨{item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.foodId)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-4">
                  <span>Total: ₨{getTotalAmount().toLocaleString()}</span>
                </div>
                <button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
