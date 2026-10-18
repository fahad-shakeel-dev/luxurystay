// "use client"
// import { useSession, signOut } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   LogOut,
//   ChevronDown,
//   Home,
//   Calendar,
//   UtensilsCrossed,
//   CreditCard,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
// } from "lucide-react"
// import Swal from "sweetalert2"


// export default function UserDashboard() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [showProfileMenu, setShowProfileMenu] = useState(false)
//   const [activeTab, setActiveTab] = useState("overview")
//   const [bookings, setBookings] = useState([])
//   const [orders, setOrders] = useState([])
//   const [totalExpenses, setTotalExpenses] = useState(0)

//   useEffect(() => {
//     if (status === "loading") return
//     if (!session) {
//       router.replace("/auth/login")
//       return
//     }
//     fetchUserData()
//   }, [session, status])

//   // Check for session expiry based on checkout time
//   useEffect(() => {
//     const checkSessionExpiry = () => {
//       const approvedBookings = bookings.filter(
//         (booking) => booking.status === "approved" && booking.userId._id === session?.user?.id,
//       )
//       approvedBookings.forEach((booking) => {
//         const checkoutTime = new Date(booking.checkOutDate)
//         const now = new Date()
//         if (now >= checkoutTime) {
//           Swal.fire({
//             title: "Session Expired",
//             text: "Your checkout time has passed. You will be logged out.",
//             icon: "warning",
//             confirmButtonText: "OK",
//           }).then(() => {
//             signOut({ redirect: false })
//             router.push("/")
//           })
//         }
//       })
//     }

//     if (bookings.length > 0) {
//       const interval = setInterval(checkSessionExpiry, 60000) // Check every minute
//       return () => clearInterval(interval)
//     }
//   }, [bookings, session, router])

//   const fetchUserData = async () => {
//     try {
//       const [bookingsRes, ordersRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/orders")])
//       const [bookingsData, ordersData] = await Promise.all([bookingsRes.json(), ordersRes.json()])

//       if (bookingsData.success) {
//         const userBookings = bookingsData.data.filter((booking) => booking.userId._id === session?.user?.id)
//         setBookings(userBookings)
//         const totalBookingAmount = userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)

//         if (ordersData.success) {
//           const userOrders = ordersData.data.filter((order) => order.userId._id === session?.user?.id)
//           setOrders(userOrders)
//           const totalOrderAmount = userOrders.reduce((sum, order) => sum + order.totalAmount, 0)
//           setTotalExpenses(totalBookingAmount + totalOrderAmount)
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch user data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       const result = await Swal.fire({
//         title: "Logout",
//         text: "Are you sure you want to logout?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Logout",
//         cancelButtonText: "Cancel",
//         confirmButtonColor: "#ef4444",
//       })
//       if (result.isConfirmed) {
//         await signOut({ redirect: false })
//         router.push("/")
//       }
//     } catch (error) {
//       console.error("Logout failed:", error)
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "approved":
//         return <CheckCircle className="w-5 h-5 text-green-500" />
//       case "rejected":
//         return <XCircle className="w-5 h-5 text-red-500" />
//       case "pending":
//         return <AlertCircle className="w-5 h-5 text-yellow-500" />
//       default:
//         return <Clock className="w-5 h-5 text-gray-700" />
//     }
//   }

//   const canOrderFood = () => {
//     return bookings.some((booking) => booking.status === "approved" && booking.userId._id === session?.user?.id)
//   }


//   const waveAnimation = {
//     animate: {
//       rotate: [0, 14, -8, 14, -4, 10, 0],
//       transition: {
//         duration: 2.5,
//         repeat: Number.POSITIVE_INFINITY,
//         repeatType: "reverse",
//         ease: "easeInOut",
//       },
//     },
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="text-xl font-semibold text-gray-900">LuxuryStay Dashboard</div>
//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div className="hidden sm:block text-right">
//                   <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
//                   <p className="text-xs text-gray-700">{session?.user?.email}</p>
//                 </div>
//                 <img
//                   src={session?.user?.image || "/placeholder.svg"}
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
//                 />
//                 <ChevronDown className="w-4 h-4 text-gray-700" />
//               </button>
//               <AnimatePresence>
//                 {showProfileMenu && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 10 }}
//                     className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
//                   >
//                     <button
//                       onClick={handleLogout}
//                       className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Welcome Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 text-whiterelative overflow-hidden shadow-xl"
//       >
//         <div className="absolute inset-0 bg-grid-white/[0.05]" />
//         <div className="relative px-4 sm:px-6 lg:px-8 py-8">
//           <div className="max-w-7xl mx-auto">
//             <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
//               Welcome back, {session?.user?.name?.split(" ")[0]}
//               <motion.span className="inline-block origin-[70%_70%]" variants={waveAnimation} animate="animate">
//                 👋
//               </motion.span>
//             </h1>
//             <p className="text-amber-100 text-lg">Manage your bookings and enjoy your stay</p>
//           </div>
//         </div>
//       </motion.div>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
//           {[
//             { id: "overview", label: "Overview", icon: Home },
//             { id: "bookings", label: "My Bookings", icon: Calendar },
//             { id: "book-room", label: "Book Room", icon: Home },
//             { id: "food", label: "Order Food", icon: UtensilsCrossed },
//             { id: "expenses", label: "Expenses", icon: CreditCard },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
//                 activeTab === tab.id ? "bg-white text-amber-600 shadow-sm" : "text-gray-900 hover:text-amber-600"
//               }`}
//             >
//               <tab.icon className="w-4 h-4" />
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <AnimatePresence mode="wait">
//           {activeTab === "overview" && (
//             <motion.div
//               key="overview"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="grid grid-cols-1 md:grid-cols-3 gap-6"
//             >
//               {/* Total Bookings */}
//               <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-blue-100 rounded-lg">
//                     <Calendar className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">Total Bookings</p>
//                     <h3 className="text-2xl font-bold text-gray-900">{bookings.length}</h3>
//                   </div>
//                 </div>
//               </div>
//               {/* Total Orders */}
//               <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-green-100 rounded-lg">
//                     <UtensilsCrossed className="w-6 h-6 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">Food Orders</p>
//                     <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
//                   </div>
//                 </div>
//               </div>
//               {/* Total Expenses */}
//               <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-amber-100 rounded-lg">
//                     <CreditCard className="w-6 h-6 text-amber-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">Total Expenses</p>
//                     <h3 className="text-2xl font-bold text-gray-900">₨{totalExpenses.toLocaleString()}</h3>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//           {activeTab === "bookings" && (
//             <motion.div
//               key="bookings"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//             >
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
//               </div>
//               <div className="p-6">
//                 {bookings.length === 0 ? (
//                   <div className="text-center py-8">
//                     <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
//                     <p className="text-gray-700">No bookings found</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {bookings.map((booking) => (
//                       <div
//                         key={booking._id}
//                         className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="flex items-center gap-2">
//                             {getStatusIcon(booking.status)}
//                             <span className="font-medium text-gray-900">Room {booking.roomId.roomNumber}</span>
//                             <span className="text-sm text-gray-700">({booking.roomId.roomType})</span>
//                           </div>
//                           <span className="text-lg font-bold text-gray-900">
//                             ₨{booking.totalAmount.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4 text-sm text-gray-900">
//                           <div>
//                             <p>
//                               <strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
//                             </p>
//                             <p>
//                               <strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <div>
//                             <p>
//                               <strong>Guests:</strong> {booking.numberOfGuests}
//                             </p>
//                             <p>
//                               <strong>Status:</strong>
//                               <span
//                                 className={`ml-1 capitalize ${
//                                   booking.status === "approved"
//                                     ? "text-green-600"
//                                     : booking.status === "rejected"
//                                       ? "text-red-600"
//                                       : "text-yellow-600"
//                                 }`}
//                               >
//                                 {booking.status}
//                               </span>
//                             </p>
//                             <p>
//                               <strong>Payment:</strong>
//                               <span
//                                 className={`ml-1 capitalize ${
//                                   booking.paymentStatus === "paid"
//                                     ? "text-green-600"
//                                     : booking.paymentStatus === "pending"
//                                       ? "text-yellow-600"
//                                       : "text-blue-600"
//                                 }`}
//                               >
//                                 {booking.paymentStatus}
//                               </span>
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}
//           {activeTab === "book-room" && (
//             <BookRoomComponent userId={session?.user?.id} onBookingSuccess={fetchUserData} />
//           )}
//           {activeTab === "food" && (
//             <FoodOrderComponent
//               userId={session?.user?.id}
//               canOrder={canOrderFood()}
//               bookings={bookings}
//               onOrderSuccess={fetchUserData}
//             />
//           )}
//           {activeTab === "expenses" && (
//             <motion.div
//               key="expenses"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//             >
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900">Expense Details</h2>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-6">
//                   {/* Room Expenses */}
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">Room Bookings</h3>
//                     {bookings.map((booking) => (
//                       <div
//                         key={booking._id}
//                         className="flex justify-between items-center py-2 border-b border-gray-100"
//                       >
//                         <div>
//                           <p className="font-medium text-gray-900">Room {booking.roomId.roomNumber}</p>
//                           <p className="text-sm text-gray-700">
//                             {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
//                             {new Date(booking.checkOutDate).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <span className="font-bold text-gray-900">₨{booking.totalAmount.toLocaleString()}</span>
//                       </div>
//                     ))}
//                   </div>
//                   {/* Food Expenses */}
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">Food Orders</h3>
//                     {orders.map((order) => (
//                       <div key={order._id} className="flex justify-between items-center py-2 border-b border-gray-100">
//                         <div>
//                           <p className="font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
//                           <p className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
//                         </div>
//                         <span className="font-bold text-gray-900">₨{order.totalAmount.toLocaleString()}</span>
//                       </div>
//                     ))}
//                   </div>
//                   {/* Total */}
//                   <div className="border-t border-gray-200 pt-4">
//                     <div className="flex justify-between items-center text-xl font-bold text-gray-900">
//                       <span>Total Expenses</span>
//                       <span>₨{totalExpenses.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// // Book Room Component
// function BookRoomComponent({ userId, onBookingSuccess }) {
//   const [rooms, setRooms] = useState([])
//   const [selectedRoom, setSelectedRoom] = useState(null)
//   const [formData, setFormData] = useState({
//     guestName: "",
//     guestPhone: "",
//     guestEmail: "",
//     checkInDate: "",
//     checkOutDate: "",
//     numberOfGuests: 1,
//     specialRequests: "",
//   })
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     fetchRooms()
//   }, [])

//   const fetchRooms = async () => {
//     try {
//       const response = await fetch("/api/rooms")
//       const data = await response.json()
//       if (data.success) {
//         setRooms(data.data.filter((room) => room.isAvailable))
//       }
//     } catch (error) {
//       console.error("Error fetching rooms:", error)
//     }
//   }

//   const calculateTotalAmount = () => {
//     if (!selectedRoom || !formData.checkInDate || !formData.checkOutDate) return 0
//     const checkIn = new Date(formData.checkInDate)
//     const checkOut = new Date(formData.checkOutDate)
//     const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
//     return nights * selectedRoom.price
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const totalAmount = calculateTotalAmount()
//       const bookingData = {
//         userId,
//         roomId: selectedRoom._id,
//         ...formData,
//         totalAmount,
//       }

//       const response = await fetch("/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingData),
//       })
//       const data = await response.json()
//       if (data.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Booking Submitted!",
//           text: "Your booking request has been submitted for approval.",
//           confirmButtonText: "OK",
//         })
//         setFormData({
//           guestName: "",
//           guestPhone: "",
//           guestEmail: "",
//           checkInDate: "",
//           checkOutDate: "",
//           numberOfGuests: 1,
//           specialRequests: "",
//         })
//         setSelectedRoom(null)
//         onBookingSuccess() // Refresh user bookings in UserDashboard
//         fetchRooms() // Refresh available rooms
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Booking Failed",
//         text: error.message || "Failed to submit booking request",
//         confirmButtonText: "OK",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <motion.div
//       key="book-room"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       {/* Available Rooms */}
//       <div className="p-6 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-900">Available Rooms</h2>
//       </div>
//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {rooms.map((room) => (
//             <div
//               key={room._id}
//               className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md duration-300 ${
//                 selectedRoom?._id === room._id
//                   ? "border-amber-500 bg-amber-50"
//                   : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setSelectedRoom(room)}
//             >
//               {room.images && room.images.length > 0 && (
//                 <img
//                   src={room.images[0] || "/placeholder.svg"}
//                   alt={room.roomType}
//                   className="w-full h-48 object-cover rounded-lg mb-4"
//                 />
//               )}
//               <h3 className="font-semibold text-lg text-gray-900">Room {room.roomNumber}</h3>
//               <p className="text-gray-700">{room.roomType}</p>
//               <p className="text-sm text-gray-700 mb-2">{room.description}</p>
//               <div className="flex justify-between items-center">
//                 <span className="text-lg font-bold text-gray-900">₨{room.price.toLocaleString()}/night</span>
//                 <span className="text-sm text-gray-700">Capacity: {room.capacity}</span>
//               </div>
//               {room.amenities && room.amenities.length > 0 && (
//                 <div className="mt-2">
//                   <p className="text-xs text-gray-700">Amenities: {room.amenities.join(", ")}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Booking Form */}
//       {selectedRoom && (
//         <div className="bg-white rounded-xl shadow-md">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-900">Book Room {selectedRoom.roomNumber}</h2>
//           </div>
//           <div className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Guest Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.guestName}
//                     onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Phone Number</label>
//                   <input
//                     type="tel"
//                     required
//                     value={formData.guestPhone}
//                     onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Email Address</label>
//                   <input
//                     type="email"
//                     required
//                     value={formData.guestEmail}
//                     onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Number of Guests</label>
//                   <input
//                     type="number"
//                     min="1"
//                     max={selectedRoom.capacity}
//                     required
//                     value={formData.numberOfGuests}
//                     onChange={(e) => setFormData({ ...formData, numberOfGuests: Number.parseInt(e.target.value) })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Check-in Date</label>
//                   <input
//                     type="date"
//                     required
//                     min={new Date().toISOString().split("T")[0]}
//                     value={formData.checkInDate}
//                     onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Check-out Date</label>
//                   <input
//                     type="date"
//                     required
//                     min={formData.checkInDate || new Date().toISOString().split("T")[0]}
//                     value={formData.checkOutDate}
//                     onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">Special Requests</label>
//                 <textarea
//                   value={formData.specialRequests}
//                   onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   placeholder="Any special requests or requirements..."
//                 />
//               </div>
//               {/* Total Amount */}
//               {formData.checkInDate && formData.checkOutDate && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
//                     <span>Total Amount:</span>
//                     <span>₨{calculateTotalAmount().toLocaleString()}</span>
//                   </div>
//                 </div>
//               )}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
//               >
//                 {loading ? "Submitting..." : "Submit Booking Request"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   )
// }

// // Food Order Component
// function FoodOrderComponent({ userId, canOrder, bookings, onOrderSuccess }) {
//   const [foodItems, setFoodItems] = useState([])
//   const [cart, setCart] = useState([])
//   const [selectedBooking, setSelectedBooking] = useState("")
//   const [deliveryAddress, setDeliveryAddress] = useState("")
//   const [specialInstructions, setSpecialInstructions] = useState("")
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     fetchFoodItems()
//   }, [])

//   const fetchFoodItems = async () => {
//     try {
//       const response = await fetch("/api/food")
//       const data = await response.json()
//       if (data.success) {
//         setFoodItems(data.data.filter((item) => item.isAvailable))
//       }
//     } catch (error) {
//       console.error("Error fetching food items:", error)
//     }
//   }

//   const addToCart = (foodItem) => {
//     const existingItem = cart.find((item) => item.foodId === foodItem._id)
//     if (existingItem) {
//       setCart(cart.map((item) => (item.foodId === foodItem._id ? { ...item, quantity: item.quantity + 1 } : item)))
//     } else {
//       setCart([
//         ...cart,
//         {
//           foodId: foodItem._id,
//           name: foodItem.name,
//           price: foodItem.price,
//           quantity: 1,
//         },
//       ])
//     }
//   }

//   const removeFromCart = (foodId) => {
//     setCart(cart.filter((item) => item.foodId !== foodId))
//   }

//   const updateQuantity = (foodId, quantity) => {
//     if (quantity === 0) {
//       removeFromCart(foodId)
//     } else {
//       setCart(cart.map((item) => (item.foodId === foodId ? { ...item, quantity } : item)))
//     }
//   }

//   const getTotalAmount = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0)
//   }

//   const handleSubmitOrder = async () => {
//     if (!selectedBooking || !deliveryAddress || cart.length === 0) {
//       Swal.fire({
//         icon: "error",
//         title: "Missing Information",
//         text: "Please select a booking, add items to cart, and provide delivery address.",
//       })
//       return
//     }

//     setLoading(true)
//     try {
//       const orderData = {
//         userId,
//         bookingId: selectedBooking,
//         items: cart.map((item) => ({
//           foodId: item.foodId,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//         totalAmount: getTotalAmount(),
//         deliveryAddress,
//         specialInstructions,
//       }

//       const response = await fetch("/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderData),
//       })
//       const data = await response.json()
//       if (data.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Order Placed!",
//           text: "Your food order has been placed successfully.",
//           confirmButtonText: "OK",
//         })
//         setCart([])
//         setSelectedBooking("")
//         setDeliveryAddress("")
//         setSpecialInstructions("")
//         onOrderSuccess()
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Order Failed",
//         text: error.message || "Failed to place order",
//         confirmButtonText: "OK",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const approvedBookings = bookings.filter((booking) => booking.status === "approved")

//   if (!canOrder) {
//     return (
//       <motion.div
//         key="food"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         className="bg-white rounded-xl shadow-sm p-8 text-center"
//       >
//         <UtensilsCrossed className="w-16 h-16 text-gray-700 mx-auto mb-4" />
//         <h2 className="text-xl font-semibold text-gray-900 mb-2">Food Ordering Not Available</h2>
//         <p className="text-gray-700">You need to have an approved room booking to order food.</p>
//       </motion.div>
//     )
//   }

//   return (
//     <motion.div
//       key="food"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       {/* Order Form */}
//       <div className="p-6 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-900">Order Food</h2>
//       </div>
//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-900 mb-1">Select Booking</label>
//             <select
//               value={selectedBooking}
//               onChange={(e) => setSelectedBooking(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//               required
//             >
//               <option value="">Select a booking</option>
//               {approvedBookings.map((booking) => (
//                 <option key={booking._id} value={booking._id}>
//                   Room {booking.roomId.roomNumber} - {booking.guestName}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-900 mb-1">Delivery Address</label>
//             <input
//               type="text"
//               value={deliveryAddress}
//               onChange={(e) => setDeliveryAddress(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//               placeholder="Room number or specific location"
//               required
//             />
//           </div>
//         </div>
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-900 mb-1">Special Instructions</label>
//           <textarea
//             value={specialInstructions}
//             onChange={(e) => setSpecialInstructions(e.target.value)}
//             rows="2"
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//             placeholder="Any special instructions for your order..."
//           />
//         </div>
//       </div>

//       {/* Food Menu */}
//       <div className="bg-white rounded-xl shadow-sm">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {foodItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
//               >
//                 <img
//                   src={item.image || "/placeholder.svg"}
//                   alt={item.name}
//                   className="w-full h-48 object-cover rounded-lg mb-4"
//                 />
//                 <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
//                 <p className="text-gray-700 text-sm mb-2">{item.description}</p>
//                 <p className="text-xs text-gray-700 mb-2">Category: {item.category}</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-bold text-gray-900">₨{item.price.toLocaleString()}</span>
//                   <button
//                     onClick={() => addToCart(item)}
//                     className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Cart */}
//       {cart.length > 0 && (
//         <div className="bg-white rounded-xl shadow-md">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
//           </div>
//           <div className="p-6">
//             <div className="space-y-4">
//               {cart.map((item) => (
//                 <div key={item.foodId} className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <div>
//                     <p className="font-medium text-gray-900">{item.name}</p>
//                     <p className="text-sm text-gray-700">₨{item.price.toLocaleString()} each</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
//                       className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900"
//                     >
//                       -
//                     </button>
//                     <span className="w-8 text-center text-gray-900">{item.quantity}</span>
//                     <button
//                       onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
//                       className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900"
//                     >
//                       +
//                     </button>
//                     <button
//                       onClick={() => removeFromCart(item.foodId)}
//                       className="ml-2 text-red-500 hover:text-red-700"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="border-t border-gray-200 pt-4 mt-4">
//               <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-4">
//                 <span>Total: ₨{getTotalAmount().toLocaleString()}</span>
//               </div>
//               <button
//                 onClick={handleSubmitOrder}
//                 disabled={loading}
//                 className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
//               >
//                 {loading ? "Placing Order..." : "Place Order"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   )
// }













"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ChevronDown,
  Home,
  Calendar,
  UtensilsCrossed,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import "./UserDashboard.css"; // Import custom CSS for responsive styles
import BookingDialog from "@/components/BookingDialog";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (new URLSearchParams(window.location.search).get("tab") === "book-room") setActiveTab("book-room");
    fetchUserData();
  }, [session, status, router]);

  const fetchUserData = async () => {
    try {
      const [bookingsRes, ordersRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/orders")]);
      const [bookingsData, ordersData] = await Promise.all([bookingsRes.json(), ordersRes.json()]);

      if (bookingsData.success) {
        const userBookings = bookingsData.data.filter(
          (booking) =>
            booking.userId?._id === session?.user?.id &&
            booking.roomId &&
            booking.roomId.roomNumber &&
            booking.roomId.roomType
        );
        setBookings(userBookings);
        const totalBookingAmount = userBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

        if (ordersData.success) {
          const userOrders = ordersData.data.filter((order) => order.userId?._id === session?.user?.id);
          setOrders(userOrders);
          const totalOrderAmount = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
          setTotalExpenses(totalBookingAmount + totalOrderAmount);
        } else {
          console.warn("Failed to fetch orders:", ordersData.message);
        }
      } else {
        console.warn("Failed to fetch bookings:", bookingsData.message);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load user data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Logout",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Logout",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ef4444",
      });
      if (result.isConfirmed) {
        await signOut({ callbackUrl: "/" });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "An error occurred while logging out. Please try again.",
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />;
    }
  };

  const canOrderFood = () => {
    return bookings.some(
      (booking) => booking.status === "approved" && booking.userId?._id === session?.user?.id && booking.roomId
    );
  };

  const waveAnimation = {
    animate: {
      rotate: [0, 14, -8, 14, -4, 10, 0],
      transition: {
        duration: 2.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-700 text-sm sm:text-base">Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">LuxuryStay Dashboard</div>
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">{session?.user?.name || "User"}</p>
                  <p className="text-xs text-gray-700">{session?.user?.email || "N/A"}</p>
                </div>
                <img
                  src={(Array.isArray(session?.user?.image) ? session.user.image[0] : session?.user?.image) || "/placeholder.svg"}
                  alt="Profile"
                  onError={(event) => { event.currentTarget.src = "/placeholder.svg" }}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </button>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2 touch-target"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 text-white relative overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
              Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
              <motion.span className="inline-block origin-[70%_70%]" variants={waveAnimation} animate="animate">
                👋
              </motion.span>
            </h1>
            <p className="text-amber-100 text-base sm:text-lg">Manage your bookings and enjoy your stay</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:space-x-1 bg-gray-100 p-1 rounded-lg mb-4 sm:mb-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Home },
            { id: "bookings", label: "My Bookings", icon: Calendar },
            { id: "book-room", label: "Book Room", icon: Home },
            { id: "food", label: "Order Food", icon: UtensilsCrossed },
            { id: "expenses", label: "Expenses", icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "bg-white text-amber-600 shadow-sm" : "text-gray-900 hover:text-amber-600"
              } touch-target`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              {[
                {
                  icon: Calendar,
                  label: "Total Bookings",
                  value: bookings.length,
                  bg: "bg-blue-100",
                  color: "text-blue-600",
                },
                {
                  icon: UtensilsCrossed,
                  label: "Food Orders",
                  value: orders.length,
                  bg: "bg-green-100",
                  color: "text-green-600",
                },
                {
                  icon: CreditCard,
                  label: "Total Expenses",
                  value: `₨${totalExpenses.toLocaleString()}`,
                  bg: "bg-amber-100",
                  color: "text-amber-600",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 ${card.bg} rounded-lg`}>
                      <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">{card.label}</p>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900">{card.value}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {activeTab === "bookings" && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Bookings</h2>
              </div>
              <div className="p-4 sm:p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-700 text-sm sm:text-base">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(booking.status)}
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              Room {booking.roomId?.roomNumber || "N/A"}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-700">
                              ({booking.roomId?.roomType || "Unknown"})
                            </span>
                          </div>
                          <span className="text-base sm:text-lg font-bold text-gray-900 mt-2 sm:mt-0">
                            ₨{booking.totalAmount?.toLocaleString() || "0"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-900">
                          <div>
                            <p>
                              <strong>Check-in:</strong>{" "}
                              {booking.checkInDate
                                ? new Date(booking.checkInDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p>
                              <strong>Check-out:</strong>{" "}
                              {booking.checkOutDate
                                ? new Date(booking.checkOutDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Guests:</strong> {booking.numberOfGuests || "N/A"}
                            </p>
                            <p>
                              <strong>Status:</strong>
                              <span
                                className={`ml-1 capitalize ${
                                  booking.status === "approved"
                                    ? "text-green-600"
                                    : booking.status === "rejected"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {booking.status || "Unknown"}
                              </span>
                            </p>
                            <p>
                              <strong>Payment:</strong>
                              <span
                                className={`ml-1 capitalize ${
                                  booking.paymentStatus === "paid"
                                    ? "text-green-600"
                                    : booking.paymentStatus === "pending"
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {booking.paymentStatus || "Unknown"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {activeTab === "book-room" && (
            <BookRoomComponent userId={session?.user?.id} onBookingSuccess={fetchUserData} />
          )}
          {activeTab === "food" && (
            <FoodOrderComponent
              userId={session?.user?.id}
              canOrder={canOrderFood()}
              bookings={bookings}
              onOrderSuccess={fetchUserData}
            />
          )}
          {activeTab === "expenses" && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Expense Details</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Room Bookings</h3>
                    {bookings.length === 0 ? (
                      <p className="text-gray-700 text-sm">No room bookings found.</p>
                    ) : (
                      bookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              Room {booking.roomId?.roomNumber || "N/A"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700">
                              {booking.checkInDate && booking.checkOutDate
                                ? `${new Date(booking.checkInDate).toLocaleDateString()} - ${new Date(
                                    booking.checkOutDate
                                  ).toLocaleDateString()}`
                                : "N/A"}
                            </p>
                          </div>
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
                            ₨{booking.totalAmount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Food Orders</h3>
                    {orders.length === 0 ? (
                      <p className="text-gray-700 text-sm">No food orders found.</p>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order._id}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              Order #{order._id?.slice(-6) || "N/A"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
                            ₨{order.totalAmount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between items-center text-base sm:text-lg font-bold text-gray-900">
                      <span>Total Expenses</span>
                      <span>₨{totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Book Room Component
function BookRoomComponent({ userId, onBookingSuccess }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      if (data.success) {
        const available = data.data.filter((room) => room.isAvailable && room.roomNumber && room.price);
        setRooms(available);
        const roomId = new URLSearchParams(window.location.search).get("room");
        setSelectedRoom(available.find(room => room._id === roomId) || null);
      } else {
        console.warn("Failed to fetch rooms:", data.message);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load rooms. Please try again later.",
      });
    }
  };

  const calculateTotalAmount = () => {
    if (!selectedRoom || !formData.checkInDate || !formData.checkOutDate || !selectedRoom.price) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * selectedRoom.price : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom?._id || !selectedRoom.price || !selectedRoom.roomNumber) {
      setFormError("Selected room is unavailable. Please close this form and choose another room.");
      return;
    }
    setFormError("");
    if (calculateTotalAmount() <= 0) {
      setFormError("Please choose a check-out date after your check-in date.");
      return;
    }
    setLoading(true);
    try {
      const totalAmount = calculateTotalAmount();
      const bookingData = {
        userId,
        roomId: selectedRoom._id,
        ...formData,
        totalAmount,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Booking Submitted!",
          text: "Your booking request has been submitted for approval.",
          confirmButtonText: "OK",
        });
        setFormData({
          guestName: "",
          guestPhone: "",
          guestEmail: "",
          checkInDate: "",
          checkOutDate: "",
          numberOfGuests: 1,
          specialRequests: "",
        });
        setSelectedRoom(null);
        onBookingSuccess();
        fetchRooms();
      } else {
        throw new Error(data.message || "Failed to submit booking request");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setFormError(error.message || "Failed to submit booking request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="book-room"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 sm:space-y-6"
    >
      <section className="dashboard-room-section">
        <div className="dashboard-room-heading">
          <div>
            <p className="dashboard-room-eyebrow">YOUR NEXT STAY</p>
            <h2>Find your perfect room</h2>
            <p>Choose a room to view the details and request your stay.</p>
          </div>
          <span className="dashboard-room-count">{rooms.length} available</span>
        </div>
        {rooms.length === 0 ? (
          <div className="dashboard-room-empty"><Home size={32} aria-hidden="true" /><h3>No rooms available right now</h3><p>Please check back soon for your next stay.</p></div>
        ) : (
          <div className="dashboard-room-grid">
            {rooms.map(room => (
              <button
                type="button"
                key={room._id}
                className="dashboard-room-card"
                aria-haspopup="dialog"
                aria-label={"Book " + (room.name || room.roomType || "room") + ", room " + room.roomNumber}
                onClick={() => {
                  setFormError("");
                  setFormData(previous => ({ ...previous, numberOfGuests: Math.min(previous.numberOfGuests, room.capacity || 1) }));
                  setSelectedRoom(room);
                }}
              >
                <div className="dashboard-room-photo">
                  {room.images?.length ? <img src={room.images[0]} alt={room.name || room.roomType || "Room"} loading="lazy" /> : <div className="dashboard-room-placeholder"><Home size={40} aria-hidden="true" /></div>}
                  <span className="dashboard-room-badge">{room.roomType}</span>
                </div>
                <div className="dashboard-room-details">
                  <div className="dashboard-room-title"><h3>{room.name || "Room " + room.roomNumber}</h3><span>{room.capacity || 1} guests</span></div>
                  <p className="dashboard-room-description">{room.description || "A comfortable space for your next stay."}</p>
                  <div className="dashboard-room-amenities">{room.amenities?.slice(0, 3).map(amenity => <span key={amenity}>{amenity}</span>)}</div>
                  <div className="dashboard-room-footer"><div><strong>Rs. {room.price.toLocaleString()}</strong><span> / night</span></div><span className="dashboard-room-action">Book room <span aria-hidden="true">&#8599;</span></span></div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedRoom && (
        <BookingDialog onClose={() => { setSelectedRoom(null); setFormError(""); }} busy={loading}>
          <div className="booking-dialog-header">
            <p className="dashboard-room-eyebrow">RESERVE YOUR STAY</p>
            <h2 id="booking-dialog-title">{selectedRoom.name || "Book Room " + selectedRoom.roomNumber}</h2>
            <p id="booking-dialog-description">{selectedRoom.roomType} &middot; Room {selectedRoom.roomNumber} &middot; Up to {selectedRoom.capacity || 1} guests</p>
            <div className="booking-dialog-rate"><strong>Rs. {selectedRoom.price.toLocaleString()}</strong><span> / night</span></div>
          </div>
          <div className="booking-dialog-body">
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Room booking">
              <fieldset disabled={loading} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1" htmlFor="booking-guestName">Guest Name</label>
                  <input
                    type="text"
                    required
                    id="booking-guestName"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1" htmlFor="booking-guestPhone">Phone Number</label>
                  <input
                    type="tel"
                    required
                    id="booking-guestPhone"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1" htmlFor="booking-guestEmail">Email Address</label>
                  <input
                    type="email"
                    required
                    id="booking-guestEmail"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1" htmlFor="booking-numberOfGuests">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedRoom.capacity || 1}
                    required
                    id="booking-numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={(e) =>
                      setFormData({ ...formData, numberOfGuests: Number.parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1" htmlFor="booking-checkInDate">Check-in Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    id="booking-checkInDate"
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1" htmlFor="booking-checkOutDate">Check-out Date</label>
                  <input
                    type="date"
                    required
                    min={formData.checkInDate || new Date().toISOString().split("T")[0]}
                    id="booking-checkOutDate"
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1" htmlFor="booking-specialRequests">Special Requests</label>
                <textarea
                  id="booking-specialRequests"
                    value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  placeholder="Any special requests or requirements..."
                />
              </div>
              {formData.checkInDate && formData.checkOutDate && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex justify-between items-center text-base sm:text-lg font-semibold text-gray-900">
                    <span>Total Amount:</span>
                    <span>Rs. {calculateTotalAmount().toLocaleString()}</span>
                  </div>
                </div>
              )}
              {formError && <p className="booking-form-error" role="alert">{formError}</p>}
              <p className="booking-approval-note">Your booking will be confirmed after approval.</p>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 touch-target"
              >
                {loading ? "Submitting..." : "Submit Booking Request"}
              </button>
              </fieldset>
            </form>
          </div>
        </BookingDialog>
      )}
    </motion.div>
  );
}

// Food Order Component
function FoodOrderComponent({ userId, canOrder, bookings, onOrderSuccess }) {
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/food");
      const data = await response.json();
      if (data.success) {
        setFoodItems(data.data.filter((item) => item.isAvailable && item.name && item.price));
      } else {
        console.warn("Failed to fetch food items:", data.message);
      }
    } catch (error) {
      console.error("Error fetching food items:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load food items. Please try again later.",
      });
    }
  };

  const addToCart = (foodItem) => {
    if (!foodItem?._id || !foodItem.price) return;
    const existingItem = cart.find((item) => item.foodId === foodItem._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.foodId === foodItem._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          foodId: foodItem._id,
          name: foodItem.name || "Unknown Item",
          price: foodItem.price || 0,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (foodId) => {
    setCart(cart.filter((item) => item.foodId !== foodId));
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity === 0) {
      removeFromCart(foodId);
    } else {
      setCart(cart.map((item) => (item.foodId === foodId ? { ...item, quantity } : item)));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  };

  const handleSubmitOrder = async () => {
    if (
      !selectedBooking ||
      !deliveryAddress ||
      cart.length === 0 ||
      !bookings.find((booking) => booking._id === selectedBooking && booking.roomId)
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please select a valid booking, add items to cart, and provide delivery address.",
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId,
        bookingId: selectedBooking,
        items: cart.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotalAmount(),
        deliveryAddress,
        specialInstructions,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: "Your food order has been placed successfully.",
          confirmButtonText: "OK",
        });
        setCart([]);
        setSelectedBooking("");
        setDeliveryAddress("");
        setSpecialInstructions("");
        onOrderSuccess();
      } else {
        throw new Error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: error.message || "Failed to place order",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "approved" && booking.roomId
  );

  if (!canOrder) {
    return (
      <motion.div
        key="food"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center"
      >
        <UtensilsCrossed className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Food Ordering Not Available</h2>
        <p className="text-gray-700 text-sm sm:text-base">You need to have an approved room booking to order food.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="food"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Order Food</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Select Booking</label>
              <select
                value={selectedBooking}
                onChange={(e) => setSelectedBooking(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                required
              >
                <option value="">Select a booking</option>
                {approvedBookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    Room {booking.roomId?.roomNumber || "N/A"} - {booking.guestName || "Unknown"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                placeholder="Room number or specific location"
                required
              />
            </div>
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Special Instructions</label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
              placeholder="Any special instructions for your order..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Menu</h2>
        </div>
        <div className="p-4 sm:p-6">
          {foodItems.length === 0 ? (
            <p className="text-gray-700 text-sm">No food items available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {foodItems.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300"
                >
                  {item.image ? (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name || "Food Item"}
                      className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">{item.name || "Unknown Item"}</h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2">{item.description || "No description"}</p>
                  <p className="text-xs text-gray-700 mb-2">Category: {item.category || "N/A"}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      ₨{item.price?.toLocaleString() || "0"}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-amber-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors touch-target"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Cart</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.foodId}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name || "Unknown Item"}</p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      ₨{item.price?.toLocaleString() || "0"} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900 touch-target"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-gray-900 text-sm">{item.quantity || 0}</span>
                    <button
                      onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900 touch-target"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.foodId)}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm touch-target"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-4">
              <div className="flex justify-between items-center text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                <span>Total: ₨{getTotalAmount().toLocaleString()}</span>
              </div>
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full bg-amber-500 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 touch-target"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}