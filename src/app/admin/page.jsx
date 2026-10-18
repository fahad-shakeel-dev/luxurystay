// "use client"
// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Users,
//   Calendar,
//   UtensilsCrossed,
//   Plus,
//   Edit,
//   Trash2,
//   Check,
//   X,
//   DollarSign,
//   TrendingUp,
//   Building,
// } from "lucide-react"
// import Swal from "sweetalert2"
// import { CldUploadWidget } from "next-cloudinary"

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("overview")
//   const [users, setUsers] = useState([])
//   const [rooms, setRooms] = useState([])
//   const [bookings, setBookings] = useState([])
//   const [food, setFood] = useState([])
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalRooms: 0,
//     availableRooms: 0,
//     totalBookings: 0,
//     totalRevenue: 0,
//     pendingBookings: 0,
//   })

//   useEffect(() => {
//     fetchAllData()
//   }, [])

//   const fetchAllData = async () => {
//     try {
//       const [usersRes, roomsRes, bookingsRes, foodRes, ordersRes] = await Promise.all([
//         fetch("/api/register"),
//         fetch("/api/rooms"),
//         fetch("/api/bookings"),
//         fetch("/api/food"),
//         fetch("/api/orders"),
//       ])

//       const [usersData, roomsData, bookingsData, foodData, ordersData] = await Promise.all([
//         usersRes.json(),
//         roomsRes.json(),
//         bookingsRes.json(),
//         foodRes.json(),
//         ordersRes.json(),
//       ])

//       if (usersData) setUsers(Array.isArray(usersData) ? usersData : [])
//       if (roomsData.success) setRooms(roomsData.data)
//       if (bookingsData.success) setBookings(bookingsData.data)
//       if (foodData.success) setFood(foodData.data)
//       if (ordersData.success) setOrders(ordersData.data)

//       // Calculate stats
//       const totalRevenue = bookingsData.success
//         ? bookingsData.data.reduce((sum, booking) => sum + booking.totalAmount, 0)
//         : 0
//       const foodRevenue = ordersData.success ? ordersData.data.reduce((sum, order) => sum + order.totalAmount, 0) : 0

//       setStats({
//         totalUsers: Array.isArray(usersData) ? usersData.length : 0,
//         totalRooms: roomsData.success ? roomsData.data.length : 0,
//         availableRooms: roomsData.success ? roomsData.data.filter((room) => room.isAvailable).length : 0,
//         totalBookings: bookingsData.success ? bookingsData.data.length : 0,
//         totalRevenue: totalRevenue + foodRevenue,
//         pendingBookings: bookingsData.success
//           ? bookingsData.data.filter((booking) => booking.status === "pending").length
//           : 0,
//       })
//     } catch (error) {
//       console.error("Error fetching data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
//           <p className="mt-4 text-gray-700">Loading admin dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="text-xl font-semibold text-gray-900">LuxuryStay Admin Dashboard</div>
//             <div className="text-sm text-gray-700">Hotel Management System</div>
//           </div>
//         </div>
//       </header>

//       {/* Welcome Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-r from-gray-500 via-gray-600 to-gray-800 text-white relative overflow-hidden shadow-xl"
//       >
//         <div className="absolute inset-0 bg-grid-white/[0.05]" />
//         <div className="relative px-4 sm:px-6 lg:px-8 py-8">
//           <div className="max-w-7xl mx-auto">
//             <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
//             <p className="text-amber-100 text-lg">Manage your hotel operations efficiently</p>
//           </div>
//         </div>
//       </motion.div>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
//           {[
//             { id: "overview", label: "Overview", icon: TrendingUp },
//             { id: "users", label: "Users", icon: Users },
//             { id: "rooms", label: "Rooms", icon: Building },
//             { id: "bookings", label: "Bookings", icon: Calendar },
//             { id: "food", label: "Food Menu", icon: UtensilsCrossed },
//             { id: "orders", label: "Food Orders", icon: UtensilsCrossed },
//             { id: "revenue", label: "Revenue", icon: DollarSign },
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
//           {activeTab === "overview" && <OverviewTab stats={stats} />}
//           {activeTab === "users" && <UsersTab users={users} onRefresh={fetchAllData} />}
//           {activeTab === "rooms" && <RoomsTab rooms={rooms} onRefresh={fetchAllData} />}
//           {activeTab === "bookings" && <BookingsTab bookings={bookings} onRefresh={fetchAllData} />}
//           {activeTab === "food" && <FoodTab food={food} onRefresh={fetchAllData} />}
//           {activeTab === "orders" && <OrdersTab orders={orders} onRefresh={fetchAllData} />}
//           {activeTab === "revenue" && <RevenueTab bookings={bookings} orders={orders} />}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// // Overview Tab Component
// function OverviewTab({ stats }) {
//   return (
//     <motion.div
//       key="overview"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//     >
//       <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-100 rounded-lg">
//             <Users className="w-6 h-6 text-blue-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-700">Total Users</p>
//             <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-green-100 rounded-lg">
//             <Building className="w-6 h-6 text-green-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-700">Available Rooms</p>
//             <h3 className="text-2xl font-bold text-gray-900">
//               {stats.availableRooms}/{stats.totalRooms}
//             </h3>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-yellow-100 rounded-lg">
//             <Calendar className="w-6 h-6 text-yellow-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-700">Pending Bookings</p>
//             <h3 className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</h3>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-purple-100 rounded-lg">
//             <Calendar className="w-6 h-6 text-purple-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-700">Total Bookings</p>
//             <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-amber-100 rounded-lg">
//             <DollarSign className="w-6 h-6 text-amber-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-700">Total Revenue</p>
//             <h3 className="text-2xl font-bold text-gray-900">₨{stats.totalRevenue.toLocaleString()}</h3>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Users Tab Component
// function UsersTab({ users, onRefresh }) {
//   const [editingUser, setEditingUser] = useState(null)
//   const [editForm, setEditForm] = useState({})

//   const handleEdit = (user) => {
//     setEditingUser(user._id)
//     setEditForm({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//     })
//   }

//   const handleSaveEdit = async (userId) => {
//     try {
//       const response = await fetch(`/api/users/${userId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editForm),
//       })
//       if (response.ok) {
//         Swal.fire({
//           icon: "success",
//           title: "User Updated",
//           text: "User information has been updated successfully.",
//         })
//         setEditingUser(null)
//         onRefresh()
//       } else {
//         const errorData = await response.json()
//         throw new Error(errorData.message || "Failed to update user information.")
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: error.message || "Failed to update user information.",
//       })
//     }
//   }

//   const handleDelete = async (userId, userName) => {
//     const result = await Swal.fire({
//       title: "Delete User",
//       text: `Are you sure you want to delete ${userName}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       confirmButtonText: "Delete",
//     })

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(`/api/users/${userId}`, {
//           method: "DELETE",
//         })
//         if (response.ok) {
//           Swal.fire({
//             icon: "success",
//             title: "User Deleted",
//             text: "User has been deleted successfully.",
//           })
//           onRefresh()
//         } else {
//           const errorData = await response.json()
//           throw new Error(errorData.message || "Failed to delete user.")
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Delete Failed",
//           text: error.message || "Failed to delete user.",
//         })
//       }
//     }
//   }

//   return (
//     <motion.div
//       key="users"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       <div className="p-6 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
//       </div>
//       <div className="p-6">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-gray-900">User</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Contact</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Joined</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id} className="border-b border-gray-100">
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={user.image || "/placeholder.svg"}
//                         alt={user.name}
//                         className="w-10 h-10 rounded-full object-cover"
//                       />
//                       <div>
//                         {editingUser === user._id ? (
//                           <input
//                             type="text"
//                             value={editForm.name}
//                             onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                             className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
//                           />
//                         ) : (
//                           <p className="font-medium text-gray-900">{user.name}</p>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     {editingUser === user._id ? (
//                       <div className="space-y-1">
//                         <input
//                           type="email"
//                           value={editForm.email}
//                           onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                           className="border border-gray-300 rounded px-2 py-1 text-sm w-full text-gray-900"
//                         />
//                         <input
//                           type="tel"
//                           value={editForm.phone}
//                           onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                           className="border border-gray-300 rounded px-2 py-1 text-sm w-full text-gray-900"
//                         />
//                       </div>
//                     ) : (
//                       <div>
//                         <p className="text-sm text-gray-900">{user.email}</p>
//                         <p className="text-sm text-gray-700">{user.phone}</p>
//                       </div>
//                     )}
//                   </td>
//                   <td className="py-3 px-4">
//                     <p className="text-sm text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-2">
//                       {editingUser === user._id ? (
//                         <>
//                           <button
//                             onClick={() => handleSaveEdit(user._id)}
//                             className="p-1 text-green-600 hover:bg-green-100 rounded"
//                           >
//                             <Check className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => setEditingUser(null)}
//                             className="p-1 text-gray-600 hover:bg-gray-100 rounded"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEdit(user)}
//                             className="p-1 text-blue-600 hover:bg-blue-100 rounded"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(user._id, user.name)}
//                             className="p-1 text-red-600 hover:bg-red-100 rounded"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Rooms Tab Component
// function RoomsTab({ rooms, onRefresh }) {
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [editingRoom, setEditingRoom] = useState(null)
//   const [formData, setFormData] = useState({
//     roomNumber: "",
//     roomType: "Single",
//     price: "",
//     capacity: "",
//     description: "",
//     amenities: "",
//     images: [],
//   })
//   const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Presidential"]

//   const handleImageUpload = (results) => {
//     if (results.info?.secure_url && results.event === "success") {
//       setFormData({
//         ...formData,
//         images: [...formData.images, results.info.secure_url],
//       })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const roomData = {
//       ...formData,
//       price: Number.parseFloat(formData.price),
//       capacity: Number.parseInt(formData.capacity),
//       amenities: formData.amenities
//         .split(",")
//         .map((item) => item.trim())
//         .filter((item) => item),
//     }

//     try {
//       const url = editingRoom ? `/api/rooms/${editingRoom}` : "/api/rooms"
//       const method = editingRoom ? "PUT" : "POST"
//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(roomData),
//       })
//       const data = await response.json()
//       if (data.success) {
//         Swal.fire({
//           icon: "success",
//           title: editingRoom ? "Room Updated" : "Room Added",
//           text: `Room has been ${editingRoom ? "updated" : "added"} successfully.`,
//         })
//         setShowAddForm(false)
//         setEditingRoom(null)
//         setFormData({
//           roomNumber: "",
//           roomType: "Single",
//           price: "",
//           capacity: "",
//           description: "",
//           amenities: "",
//           images: [],
//         })
//         onRefresh()
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Operation Failed",
//         text: error.message || `Failed to ${editingRoom ? "update" : "add"} room.`,
//       })
//     }
//   }

//   const handleEdit = (room) => {
//     setEditingRoom(room._id)
//     setFormData({
//       roomNumber: room.roomNumber,
//       roomType: room.roomType,
//       price: room.price.toString(),
//       capacity: room.capacity.toString(),
//       description: room.description,
//       amenities: room.amenities.join(", "),
//       images: room.images || [],
//     })
//     setShowAddForm(true)
//   }

//   const handleDelete = async (roomId, roomNumber) => {
//     const result = await Swal.fire({
//       title: "Delete Room",
//       text: `Are you sure you want to delete Room ${roomNumber}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       confirmButtonText: "Delete",
//     })

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(`/api/rooms/${roomId}`, {
//           method: "DELETE",
//         })
//         if (response.ok) {
//           Swal.fire({
//             icon: "success",
//             title: "Room Deleted",
//             text: "Room has been deleted successfully.",
//           })
//           onRefresh()
//         } else {
//           const errorData = await response.json()
//           throw new Error(errorData.message || "Failed to delete room.")
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Delete Failed",
//           text: error.message || "Failed to delete room.",
//         })
//       }
//     }
//   }

//   return (
//     <motion.div
//       key="rooms"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="space-y-6"
//     >
//       {/* Add Room Button */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-gray-900">Room Management</h2>
//         <button
//           onClick={() => {
//             setShowAddForm(true)
//             setEditingRoom(null)
//             setFormData({
//               roomNumber: "",
//               roomType: "Single",
//               price: "",
//               capacity: "",
//               description: "",
//               amenities: "",
//               images: [],
//             })
//           }}
//           className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
//         >
//           <Plus className="w-4 h-4" />
//           Add Room
//         </button>
//       </div>

//       {/* Add/Edit Room Form */}
//       {showAddForm && (
//         <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">{editingRoom ? "Edit Room" : "Add New Room"}</h3>
//           </div>
//           <div className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Room Number</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.roomNumber}
//                     onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Room Type</label>
//                   <select
//                     value={formData.roomType}
//                     onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   >
//                     {roomTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Price per Night (₨)</label>
//                   <input
//                     type="number"
//                     required
//                     value={formData.price}
//                     onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Capacity</label>
//                   <input
//                     type="number"
//                     required
//                     value={formData.capacity}
//                     onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
//                 <textarea
//                   required
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">Amenities (comma separated)</label>
//                 <input
//                   type="text"
//                   value={formData.amenities}
//                   onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
//                   placeholder="WiFi, AC, TV, Mini Bar"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">Room Images</label>
//                 <CldUploadWidget
//                   uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
//                   onSuccess={handleImageUpload}
//                   options={{ cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, multiple: true }}
//                 >
//                   {({ open }) => (
//                     <button
//                       type="button"
//                       onClick={open}
//                       className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:bg-gray-50 transition-colors"
//                     >
//                       <Plus className="w-6 h-6 mx-auto mb-2 text-gray-700" />
//                       <p className="text-gray-700">Click to upload images</p>
//                     </button>
//                   )}
//                 </CldUploadWidget>
//                 {formData.images.length > 0 && (
//                   <div className="mt-2 grid grid-cols-3 gap-2">
//                     {formData.images.map((image, index) => (
//                       <img
//                         key={index}
//                         src={image || "/placeholder.svg"}
//                         alt={`Room ${index + 1}`}
//                         className="w-full h-20 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   type="submit"
//                   className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
//                 >
//                   {editingRoom ? "Update Room" : "Add Room"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddForm(false)
//                     setEditingRoom(null)
//                   }}
//                   className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Rooms List */}
//       <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">All Rooms</h3>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {rooms.map((room) => (
//               <div
//                 key={room._id}
//                 className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
//               >
//                 {room.images && room.images.length > 0 && (
//                   <img
//                     src={room.images[0] || "/placeholder.svg"}
//                     alt={room.roomType}
//                     className="w-full h-48 object-cover rounded-lg mb-4"
//                   />
//                 )}
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <h4 className="font-semibold text-lg text-gray-900">Room {room.roomNumber}</h4>
//                     <p className="text-gray-700">{room.roomType}</p>
//                   </div>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       room.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {room.isAvailable ? "Available" : "Occupied"}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-700 mb-2">{room.description}</p>
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="text-lg font-bold text-gray-900">₨{room.price.toLocaleString()}/night</span>
//                   <span className="text-sm text-gray-700">Capacity: {room.capacity}</span>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleEdit(room)}
//                     className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
//                   >
//                     <Edit className="w-4 h-4" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(room._id, room.roomNumber)}
//                     className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Bookings Tab Component
// function BookingsTab({ bookings, onRefresh }) {
//   const handleStatusUpdate = async (bookingId, newStatus) => {
//     try {
//       const response = await fetch(`/api/bookings/${bookingId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       })
//       const data = await response.json()
//       if (data.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Status Updated",
//           text: `Booking status has been updated to ${newStatus}.`,
//         })
//         onRefresh()
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: error.message || "Failed to update booking status.",
//       })
//     }
//   }

//   const handlePaymentUpdate = async (bookingId, paymentStatus) => {
//     try {
//       const response = await fetch(`/api/bookings/${bookingId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ paymentStatus }),
//       })
//       const data = await response.json()
//       if (data.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Payment Updated",
//           text: `Payment status has been updated to ${paymentStatus}.`,
//         })
//         onRefresh()
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: error.message || "Failed to update payment status.",
//       })
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-100 text-green-800"
//       case "rejected":
//         return "bg-red-100 text-red-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "completed":
//         return "bg-blue-100 text-blue-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getPaymentColor = (status) => {
//     switch (status) {
//       case "paid":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "refunded":
//         return "bg-blue-100 text-blue-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <motion.div
//       key="bookings"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       <div className="p-6 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-900">Booking Management</h2>
//       </div>
//       <div className="p-6">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-gray-900">Guest</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Room</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Dates</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Amount</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Status</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Payment</th>
//                 <th className="text-left py-3 px-4 text-gray-900">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookings.map((booking) => (
//                 <tr key={booking._id} className="border-b border-gray-100">
//                   <td className="py-3 px-4">
//                     <div>
//                       <p className="font-medium text-gray-900">{booking.guestName}</p>
//                       <p className="text-sm text-gray-700">{booking.guestEmail}</p>
//                       <p className="text-sm text-gray-700">{booking.guestPhone}</p>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div>
//                       <p className="font-medium text-gray-900">Room {booking.roomId?.roomNumber}</p>
//                       <p className="text-sm text-gray-700">{booking.roomId?.roomType}</p>
//                       <p className="text-sm text-gray-700">{booking.numberOfGuests} guests</p>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div>
//                       <p className="text-sm text-gray-900">
//                         <strong>In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
//                       </p>
//                       <p className="text-sm text-gray-900">
//                         <strong>Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <p className="font-bold text-gray-900">₨{booking.totalAmount.toLocaleString()}</p>
//                   </td>
//                   <td className="py-3 px-4">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
//                       {booking.status}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(booking.paymentStatus)}`}
//                     >
//                       {booking.paymentStatus}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex flex-col gap-1">
//                       {booking.status === "pending" && (
//                         <div className="flex gap-1">
//                           <button
//                             onClick={() => handleStatusUpdate(booking._id, "approved")}
//                             className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             onClick={() => handleStatusUpdate(booking._id, "rejected")}
//                             className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                       {booking.status === "approved" && booking.paymentStatus === "pending" && (
//                         <button
//                           onClick={() => handlePaymentUpdate(booking._id, "paid")}
//                           className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
//                         >
//                           Mark Paid
//                         </button>
//                       )}
//                       {booking.status === "approved" && (
//                         <button
//                           onClick={() => handleStatusUpdate(booking._id, "completed")}
//                           className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
//                         >
//                           Complete
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Food Tab Component
// function FoodTab({ food, onRefresh }) {
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [editingFood, setEditingFood] = useState(null)
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "Breakfast",
//     image: "",
//     ingredients: "",
//   })
//   const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages", "Desserts"]

//   const handleImageUpload = (results) => {
//     if (results.info?.secure_url && results.event === "success") {
//       setFormData({
//         ...formData,
//         image: results.info.secure_url,
//       })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const foodData = {
//       ...formData,
//       price: Number.parseFloat(formData.price),
//       ingredients: formData.ingredients
//         .split(",")
//         .map((item) => item.trim())
//         .filter((item) => item),
//     }

//     try {
//       const url = editingFood ? `/api/food/${editingFood}` : "/api/food"
//       const method = editingFood ? "PUT" : "POST"
//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(foodData),
//       })
//       const data = await response.json()
//       if (data.success) {
//         Swal.fire({
//           icon: "success",
//           title: editingFood ? "Food Updated" : "Food Added",
//           text: `Food item has been ${editingFood ? "updated" : "added"} successfully.`,
//         })
//         setShowAddForm(false)
//         setEditingFood(null)
//         setFormData({
//           name: "",
//           description: "",
//           price: "",
//           category: "Breakfast",
//           image: "",
//           ingredients: "",
//         })
//         onRefresh()
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Operation Failed",
//         text: error.message || `Failed to ${editingFood ? "update" : "add"} food item.`,
//       })
//     }
//   }

//   const handleEdit = (foodItem) => {
//     setEditingFood(foodItem._id)
//     setFormData({
//       name: foodItem.name,
//       description: foodItem.description,
//       price: foodItem.price.toString(),
//       category: foodItem.category,
//       image: foodItem.image,
//       ingredients: foodItem.ingredients.join(", "),
//     })
//     setShowAddForm(true)
//   }

//   const handleDelete = async (foodId, foodName) => {
//     const result = await Swal.fire({
//       title: "Delete Food Item",
//       text: `Are you sure you want to delete ${foodName}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       confirmButtonText: "Delete",
//     })

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(`/api/food/${foodId}`, {
//           method: "DELETE",
//         })
//         if (response.ok) {
//           Swal.fire({
//             icon: "success",
//             title: "Food Deleted",
//             text: "Food item has been deleted successfully.",
//           })
//           onRefresh()
//         } else {
//           const errorData = await response.json()
//           throw new Error(errorData.message || "Failed to delete food item.")
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Delete Failed",
//           text: error.message || "Failed to delete food item.",
//         })
//       }
//     }
//   }

//   const toggleAvailability = async (foodId, currentStatus) => {
//     try {
//       const response = await fetch(`/api/food/${foodId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isAvailable: !currentStatus }),
//       })
//       const data = await response.json()
//       if (data.success) {
//         onRefresh()
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: error.message || "Failed to update availability status.",
//       })
//     }
//   }

//   return (
//     <motion.div
//       key="food"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="space-y-6"
//     >
//       {/* Add Food Button */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-gray-900">Food Menu Management</h2>
//         <button
//           onClick={() => {
//             setShowAddForm(true)
//             setEditingFood(null)
//             setFormData({
//               name: "",
//               description: "",
//               price: "",
//               category: "Breakfast",
//               image: "",
//               ingredients: "",
//             })
//           }}
//           className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
//         >
//           <Plus className="w-4 h-4" />
//           Add Food Item
//         </button>
//       </div>

//       {/* Add/Edit Food Form */}
//       {showAddForm && (
//         <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">
//               {editingFood ? "Edit Food Item" : "Add New Food Item"}
//             </h3>
//           </div>
//           <div className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Food Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   >
//                     {categories.map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Price (₨)</label>
//                   <input
//                     type="number"
//                     required
//                     value={formData.price}
//                     onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-1">Ingredients (comma separated)</label>
//                   <input
//                     type="text"
//                     value={formData.ingredients}
//                     onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
//                     placeholder="Chicken, Rice, Spices"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
//                 <textarea
//                   required
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">Food Image</label>
//                 <CldUploadWidget
//                   uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
//                   onSuccess={handleImageUpload}
//                   options={{ cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, multiple: false }}
//                 >
//                   {({ open }) => (
//                     <button
//                       type="button"
//                       onClick={open}
//                       className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:bg-gray-50 transition-colors"
//                     >
//                       {formData.image ? (
//                         <img
//                           src={formData.image || "/placeholder.svg"}
//                           alt="Food preview"
//                           className="w-32 h-32 object-cover rounded mx-auto"
//                         />
//                       ) : (
//                         <>
//                           <Plus className="w-6 h-6 mx-auto mb-2 text-gray-700" />
//                           <p className="text-gray-700">Click to upload image</p>
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </CldUploadWidget>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   type="submit"
//                   className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
//                 >
//                   {editingFood ? "Update Food Item" : "Add Food Item"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddForm(false)
//                     setEditingFood(null)
//                   }}
//                   className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Food Items List */}
//       <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">All Food Items</h3>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {food.map((item) => (
//               <div
//                 key={item._id}
//                 className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
//               >
//                 <img
//                   src={item.image || "/placeholder.svg"}
//                   alt={item.name}
//                   className="w-full h-48 object-cover rounded-lg mb-4"
//                 />
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <h4 className="font-semibold text-lg text-gray-900">{item.name}</h4>
//                     <p className="text-gray-700">{item.category}</p>
//                   </div>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {item.isAvailable ? "Available" : "Unavailable"}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-700 mb-2">{item.description}</p>
//                 <p className="text-lg font-bold mb-4 text-gray-900">₨{item.price.toLocaleString()}</p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleEdit(item)}
//                     className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
//                   >
//                     <Edit className="w-4 h-4" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => toggleAvailability(item._id, item.isAvailable)}
//                     className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
//                       item.isAvailable
//                         ? "bg-yellow-500 hover:bg-yellow-600 text-white"
//                         : "bg-green-500 hover:bg-green-600 text-white"
//                     }`}
//                   >
//                     {item.isAvailable ? "Disable" : "Enable"}
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item._id, item.name)}
//                     className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Orders Tab Component
// function OrdersTab({ orders, onRefresh }) {
//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       const response = await fetch(`/api/orders/${orderId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       })
//       const data = await response.json()
//       if (data.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Status Updated",
//           text: `Order status has been updated to ${newStatus}.`,
//         })
//         onRefresh()
//       } else {
//         throw new Error(data.message)
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: error.message || "Failed to update order status.",
//       })
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "delivered":
//         return "bg-green-100 text-green-800"
//       case "ready":
//         return "bg-blue-100 text-blue-800"
//       case "preparing":
//         return "bg-yellow-100 text-yellow-800"
//       case "pending":
//         return "bg-gray-100 text-gray-800"
//       case "cancelled":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <motion.div
//       key="orders"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       <div className="p-6 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-900">Food Orders Management</h2>
//       </div>
//       <div className="p-6">
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h4 className="font-semibold text-gray-900">Order #{order._id.slice(-6)}</h4>
//                   <p className="text-sm text-gray-700">
//                     Customer: {order.userId?.name} ({order.userId?.email})
//                   </p>
//                   <p className="text-sm text-gray-700">Delivery: {order.deliveryAddress}</p>
//                   <p className="text-sm text-gray-700">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//                 </div>
//                 <div className="text-right">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                     {order.status}
//                   </span>
//                   <p className="text-lg font-bold mt-2 text-gray-900">₨{order.totalAmount.toLocaleString()}</p>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <h5 className="font-medium text-gray-900 mb-2">Order Items:</h5>
//                 <div className="space-y-1">
//                   {order.items.map((item, index) => (
//                     <div key={index} className="flex justify-between text-sm text-gray-900">
//                       <span>
//                         {item.foodId?.name} x {item.quantity}
//                       </span>
//                       <span>₨{(item.price * item.quantity).toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {order.specialInstructions && (
//                 <div className="mb-4">
//                   <h5 className="font-medium text-gray-900 mb-1">Special Instructions:</h5>
//                   <p className="text-sm text-gray-700">{order.specialInstructions}</p>
//                 </div>
//               )}
//               <div className="flex gap-2">
//                 {order.status === "pending" && (
//                   <>
//                     <button
//                       onClick={() => handleStatusUpdate(order._id, "preparing")}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
//                     >
//                       Start Preparing
//                     </button>
//                     <button
//                       onClick={() => handleStatusUpdate(order._id, "cancelled")}
//                       className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 )}
//                 {order.status === "preparing" && (
//                   <button
//                     onClick={() => handleStatusUpdate(order._id, "ready")}
//                     className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
//                   >
//                     Mark Ready
//                   </button>
//                 )}
//                 {order.status === "ready" && (
//                   <button
//                     onClick={() => handleStatusUpdate(order._id, "delivered")}
//                     className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
//                   >
//                     Mark Delivered
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Revenue Tab Component
// function RevenueTab({ bookings, orders }) {
//   const calculateRevenue = () => {
//     const roomRevenue = bookings.reduce((sum, booking) => {
//       if (booking.paymentStatus === "paid") {
//         return sum + booking.totalAmount
//       }
//       return sum
//     }, 0)
//     const foodRevenue = orders.reduce((sum, order) => {
//       if (order.status === "delivered") {
//         return sum + order.totalAmount
//       }
//       return sum
//     }, 0)
//     return {
//       roomRevenue,
//       foodRevenue,
//       totalRevenue: roomRevenue + foodRevenue,
//     }
//   }

//   const { roomRevenue, foodRevenue, totalRevenue } = calculateRevenue()

//   const getMonthlyRevenue = () => {
//     const monthlyData = {}
//     bookings.forEach((booking) => {
//       if (booking.paymentStatus === "paid") {
//         const month = new Date(booking.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
//         monthlyData[month] = (monthlyData[month] || 0) + booking.totalAmount
//       }
//     })
//     orders.forEach((order) => {
//       if (order.status === "delivered") {
//         const month = new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
//         monthlyData[month] = (monthlyData[month] || 0) + order.totalAmount
//       }
//     })
//     return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }))
//   }

//   const monthlyRevenue = getMonthlyRevenue()

//   return (
//     <motion.div
//       key="revenue"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="space-y-6"
//     >
//       {/* Revenue Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <Building className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-700">Room Revenue</p>
//               <h3 className="text-2xl font-bold text-gray-900">₨{roomRevenue.toLocaleString()}</h3>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <UtensilsCrossed className="w-6 h-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-700">Food Revenue</p>
//               <h3 className="text-2xl font-bold text-gray-900">₨{foodRevenue.toLocaleString()}</h3>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-amber-100 rounded-lg">
//               <DollarSign className="w-6 h-6 text-amber-600" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-700">Total Revenue</p>
//               <h3 className="text-2xl font-bold text-gray-900">₨{totalRevenue.toLocaleString()}</h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Monthly Revenue */}
//       <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
//         </div>
//         <div className="p-6">
//           <div className="space-y-4">
//             {monthlyRevenue.map((data, index) => (
//               <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="font-medium text-gray-900">{data.month}</span>
//                 <span className="text-lg font-bold text-gray-900">₨{data.revenue.toLocaleString()}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
//         </div>
//         <div className="p-6">
//           <div className="space-y-4">
//             {/* Paid Bookings */}
//             {bookings
//               .filter((booking) => booking.paymentStatus === "paid")
//               .slice(0, 5)
//               .map((booking) => (
//                 <div key={booking._id} className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <div>
//                     <p className="font-medium text-gray-900">Room Booking - {booking.guestName}</p>
//                     <p className="text-sm text-gray-700">Room {booking.roomId?.roomNumber}</p>
//                   </div>
//                   <span className="text-green-600 font-bold">+₨{booking.totalAmount.toLocaleString()}</span>
//                 </div>
//               ))}
//             {/* Delivered Orders */}
//             {orders
//               .filter((order) => order.status === "delivered")
//               .slice(0, 5)
//               .map((order) => (
//                 <div key={order._id} className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <div>
//                     <p className="font-medium text-gray-900">Food Order - {order.userId?.name}</p>
//                     <p className="text-sm text-gray-700">Order #{order._id.slice(-6)}</p>
//                   </div>
//                   <span className="text-green-600 font-bold">+₨{order.totalAmount.toLocaleString()}</span>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }







"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Calendar,
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  DollarSign,
  TrendingUp,
  Building,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import Swal from "sweetalert2";
import LocalImageUpload from "@/components/LocalImageUpload";
import "./AdminDashboard.css"; // Import custom CSS for additional responsive styles

// Login Form Component
function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to sign in.");
      Swal.fire({ icon: "success", title: "Login Successful", text: "Welcome to the Admin Dashboard!", timer: 1500, showConfirmButton: false });
      onLogin();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Login Failed", text: error.message || "Unable to sign in. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-900"
              placeholder="Enter your email"
            />
          </div>

          {/* Password with Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-900 pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Secret Code with Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-900 mb-1">Secret Code</label>
            <input
              type={showSecret ? "text" : "password"}
              required
              value={formData.secretCode}
              onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-900 pr-10"
              placeholder="Enter secret code"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-[38px] text-gray-600"
            >
              {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [food, setFood] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });

  // Check authentication state on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      setLoading(false); // Show login form if not authenticated
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true"); // Persist authentication state
  };

  const handleLogout = () => {
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // Clear authentication state
  };

  const fetchAllData = async () => {
    try {
      const headers = { "Content-Type": "application/json" };

      const [usersRes, roomsRes, bookingsRes, foodRes, ordersRes] = await Promise.all([
        fetch("/api/register", { headers }),
        fetch("/api/rooms", { headers }),
        fetch("/api/bookings", { headers }),
        fetch("/api/food", { headers }),
        fetch("/api/orders", { headers }),
      ]);

      const [usersData, roomsData, bookingsData, foodData, ordersData] = await Promise.all([
        usersRes.json(),
        roomsRes.json(),
        bookingsRes.json(),
        foodRes.json(),
        ordersRes.json(),
      ]);

      if (usersData) setUsers(Array.isArray(usersData) ? usersData : []);
      if (roomsData.success) setRooms(roomsData.data);
      if (bookingsData.success) setBookings(bookingsData.data);
      if (foodData.success) setFood(foodData.data);
      if (ordersData.success) setOrders(ordersData.data);

      const totalRevenue = bookingsData.success
        ? bookingsData.data.reduce((sum, booking) => sum + booking.totalAmount, 0)
        : 0;
      const foodRevenue = ordersData.success ? ordersData.data.reduce((sum, order) => sum + order.totalAmount, 0) : 0;

      setStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalRooms: roomsData.success ? roomsData.data.length : 0,
        availableRooms: roomsData.success ? roomsData.data.filter((room) => room.isAvailable).length : 0,
        totalBookings: bookingsData.success ? bookingsData.data.length : 0,
        totalRevenue: totalRevenue + foodRevenue,
        pendingBookings: bookingsData.success
          ? bookingsData.data.filter((booking) => booking.status === "pending").length
          : 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Data Fetch Failed",
        text: "Failed to load dashboard data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-700 text-base sm:text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-sidebar-brand">
          <span className="admin-brand-mark"><Building size={19} aria-hidden="true" /></span>
          <span className="admin-brand-copy"><strong>LuxuryStay</strong><small>Hotel operations</small></span>
        </Link>

        <div className="admin-sidebar-section">
          <p className="admin-sidebar-label">Workspace</p>
          <nav className="admin-sidebar-nav" aria-label="Admin sections">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "users", label: "Users", icon: Users },
            { id: "rooms", label: "Rooms", icon: Building },
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "food", label: "Food Menu", icon: UtensilsCrossed },
            { id: "orders", label: "Food Orders", icon: UtensilsCrossed },
            { id: "revenue", label: "Revenue", icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`admin-sidebar-link ${activeTab === tab.id ? "is-active" : ""}`}
            >
              <tab.icon size={18} strokeWidth={1.8} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <Link href="/" className="admin-site-link">View hotel site <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button type="button" onClick={handleLogout} className="admin-logout-button touch-target">
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><p className="admin-topbar-eyebrow">HOTEL MANAGEMENT</p><h1>Admin dashboard</h1></div>
          <p className="admin-topbar-note">Manage your hotel operations</p>
        </header>
        <div className="admin-main-content">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewTab stats={stats} />}
            {activeTab === "users" && <UsersTab users={users} onRefresh={fetchAllData} />}
            {activeTab === "rooms" && <RoomsTab rooms={rooms} onRefresh={fetchAllData} />}
            {activeTab === "bookings" && <BookingsTab bookings={bookings} onRefresh={fetchAllData} />}
            {activeTab === "food" && <FoodTab food={food} onRefresh={fetchAllData} />}
            {activeTab === "orders" && <OrdersTab orders={orders} onRefresh={fetchAllData} />}
            {activeTab === "revenue" && <RevenueTab bookings={bookings} orders={orders} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats }) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {[
        { icon: Users, label: "Total Users", value: stats.totalUsers, bg: "bg-blue-100", color: "text-blue-600" },
        {
          icon: Building,
          label: "Available Rooms",
          value: `${stats.availableRooms}/${stats.totalRooms}`,
          bg: "bg-green-100",
          color: "text-green-600",
        },
        {
          icon: Calendar,
          label: "Pending Bookings",
          value: stats.pendingBookings,
          bg: "bg-yellow-100",
          color: "text-yellow-600",
        },
        {
          icon: Calendar,
          label: "Total Bookings",
          value: stats.totalBookings,
          bg: "bg-purple-100",
          color: "text-purple-600",
        },
        {
          icon: DollarSign,
          label: "Total Revenue",
          value: `₨${stats.totalRevenue.toLocaleString()}`,
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
  );
}

// Users Tab Component
function UsersTab({ users, onRefresh }) {
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "User Updated",
          text: "User information has been updated successfully.",
        });
        setEditingUser(null);
        onRefresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user information.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update user information.",
      });
    }
  };

  const handleDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Delete User",
      text: `Are you sure you want to delete ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "User Deleted",
            text: "User has been deleted successfully.",
          });
          onRefresh();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete user.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error.message || "Failed to delete user.",
        });
      }
    }
  };

  return (
    <motion.div
      key="users"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">User Management</h2>
      </div>
      <div className="p-4 sm:p-6 overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">User</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Contact</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Joined</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-100">
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={user.image || "/placeholder.svg"}
                      alt={user.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div>
                      {editingUser === user._id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm text-gray-900 w-full"
                        />
                      ) : (
                        <p className="font-medium text-gray-900 text-xs sm:text-sm">{user.name}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  {editingUser === user._id ? (
                    <div className="space-y-1">
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm w-full text-gray-900"
                      />
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm w-full text-gray-900"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-900">{user.email}</p>
                      <p className="text-xs sm:text-sm text-gray-700">{user.phone}</p>
                    </div>
                  )}
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <p className="text-xs sm:text-sm text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div className="flex items-center gap-2">
                    {editingUser === user._id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(user._id)}
                          className="p-1 sm:p-2 text-green-600 hover:bg-green-100 rounded touch-target"
                        >
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="p-1 sm:p-2 text-gray-600 hover:bg-gray-100 rounded touch-target"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1 sm:p-2 text-blue-600 hover:bg-blue-100 rounded touch-target"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="p-1 sm:p-2 text-red-600 hover:bg-red-100 rounded touch-target"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// Rooms Tab Component
function RoomsTab({ rooms, onRefresh }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Single",
    price: "",
    capacity: "",
    description: "",
    amenities: "",
    images: [],
  });
  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Presidential"];

  const handleImageUpload = (urls) => {
    setFormData((previous) => ({ ...previous, images: [...previous.images, ...urls] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      capacity: Number.parseInt(formData.capacity),
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    };

    try {
      const url = editingRoom ? `/api/rooms/${editingRoom}` : "/api/rooms";
      const method = editingRoom ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: editingRoom ? "Room Updated" : "Room Added",
          text: `Room has been ${editingRoom ? "updated" : "added"} successfully.`,
        });
        setShowAddForm(false);
        setEditingRoom(null);
        setFormData({
          roomNumber: "",
          roomType: "Single",
          price: "",
          capacity: "",
          description: "",
          amenities: "",
          images: [],
        });
        onRefresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: error.message || `Failed to ${editingRoom ? "update" : "add"} room.`,
      });
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room._id);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      description: room.description,
      amenities: room.amenities.join(", "),
      images: room.images || [],
    });
    setShowAddForm(true);
  };

  const handleDelete = async (roomId, roomNumber) => {
    const result = await Swal.fire({
      title: "Delete Room",
      text: `Are you sure you want to delete Room ${roomNumber}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/rooms/${roomId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Room Deleted",
            text: "Room has been deleted successfully.",
          });
          onRefresh();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete room.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error.message || "Failed to delete room.",
        });
      }
    }
  };

  return (
    <motion.div
      key="rooms"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Add Room Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Room Management</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingRoom(null);
            setFormData({
              roomNumber: "",
              roomType: "Single",
              price: "",
              capacity: "",
              description: "",
              amenities: "",
              images: [],
            });
          }}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 touch-target"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Add/Edit Room Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {editingRoom ? "Edit Room" : "Add New Room"}
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Room Type</label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  >
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">
                    Price per Night (₨)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, AC, TV, Mini Bar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Room Images</label>
                <LocalImageUpload onUpload={handleImageUpload} multiple={true}>
                  {({ open, isUploading }) => (
                    <button
                      type="button"
                      onClick={open}
                      disabled={isUploading}
                      className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:bg-gray-50 transition-colors touch-target"
                    >
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-700" />
                      <p className="text-gray-700 text-xs sm:text-sm">Click to upload images</p>
                    </button>
                  )}
                </LocalImageUpload>
                {formData.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative aspect-[4/3] w-full">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Room ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors touch-target"
                >
                  {editingRoom ? "Update Room" : "Add Room"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRoom(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors touch-target"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms List */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Rooms</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300"
              >
                {room.images && room.images.length > 0 ? (
                  <div className="relative aspect-[4/3] w-full mb-3 sm:mb-4">
                    <img
                      src={room.images[0] || "/placeholder.svg"}
                      alt={room.roomType}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] w-full mb-3 sm:mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src="/placeholder.svg"
                      alt="No image available"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-900">Room {room.roomNumber}</h4>
                    <p className="text-xs sm:text-sm text-gray-700">{room.roomType}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.isAvailable ? "Available" : "Occupied"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mb-2">{room.description}</p>
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    ₨{room.price.toLocaleString()}/night
                  </span>
                  <span className="text-xs sm:text-sm text-gray-700">Capacity: {room.capacity}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 touch-target"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id, room.roomNumber)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1 touch-target"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Bookings Tab Component
function BookingsTab({ bookings, onRefresh }) {
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Booking status has been updated to ${newStatus}.`,
        });
        onRefresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update booking status.",
      });
    }
  };

  const handlePaymentUpdate = async (bookingId, paymentStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Updated",
          text: `Payment status has been updated to ${paymentStatus}.`,
        });
        onRefresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update payment status.",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      key="bookings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Booking Management</h2>
      </div>
      <div className="p-4 sm:p-6 overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Guest</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Room</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Dates</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Amount</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Status</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Payment</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-900 text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-100">
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">{booking.guestName}</p>
                    <p className="text-xs text-gray-700">{booking.guestEmail}</p>
                    <p className="text-xs text-gray-700">{booking.guestPhone}</p>
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">
                      Room {booking.roomId?.roomNumber}
                    </p>
                    <p className="text-xs text-gray-700">{booking.roomId?.roomType}</p>
                    <p className="text-xs text-gray-700">{booking.numberOfGuests} guests</p>
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-900">
                      <strong>In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900">
                      <strong>Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">
                    ₨{booking.totalAmount.toLocaleString()}
                  </p>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(booking.paymentStatus)}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div className="flex flex-col gap-1">
                    {booking.status === "pending" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStatusUpdate(booking._id, "approved")}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors touch-target"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, "rejected")}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors touch-target"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {booking.status === "approved" && booking.paymentStatus === "pending" && (
                      <button
                        onClick={() => handlePaymentUpdate(booking._id, "paid")}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors touch-target"
                      >
                        Mark Paid
                      </button>
                    )}
                    {booking.status === "approved" && (
                      <button
                        onClick={() => handleStatusUpdate(booking._id, "completed")}
                        className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors touch-target"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// Food Tab Component
function FoodTab({ food, onRefresh }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Breakfast",
    image: "",
    ingredients: "",
  });
  const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages", "Desserts"];

  const handleImageUpload = (urls) => {
    setFormData((previous) => ({ ...previous, image: urls[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foodData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      ingredients: formData.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    };

    try {
      const url = editingFood ? `/api/food/${editingFood}` : "/api/food";
      const method = editingFood ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(foodData),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: editingFood ? "Food Updated" : "Food Added",
          text: `Food item has been ${editingFood ? "updated" : "added"} successfully.`,
        });
        setShowAddForm(false);
        setEditingFood(null);
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "Breakfast",
          image: "",
          ingredients: "",
        });
        onRefresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: error.message || `Failed to ${editingFood ? "update" : "add"} food item.`,
      });
    }
  };

  const handleEdit = (foodItem) => {
    setEditingFood(foodItem._id);
    setFormData({
      name: foodItem.name,
      description: foodItem.description,
      price: foodItem.price.toString(),
      category: foodItem.category,
      image: foodItem.image,
      ingredients: foodItem.ingredients.join(", "),
    });
    setShowAddForm(true);
  };

  const handleDelete = async (foodId, foodName) => {
    const result = await Swal.fire({
      title: "Delete Food Item",
      text: `Are you sure you want to delete ${foodName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/food/${foodId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Food Deleted",
            text: "Food item has been deleted successfully.",
          });
          onRefresh();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete food item.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error.message || "Failed to delete food item.",
        });
      }
    }
  };

  const toggleAvailability = async (foodId, currentStatus) => {
    try {
      const response = await fetch(`/api/food/${foodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        onRefresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update availability status.",
      });
    }
  };

  return (
    <motion.div
      key="food"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Add Food Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Food Menu Management</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingFood(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              category: "Breakfast",
              image: "",
              ingredients: "",
            });
          }}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 touch-target"
        >
          <Plus className="w-4 h-4" />
          Add Food Item
        </button>
      </div>

      {/* Add/Edit Food Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {editingFood ? "Edit Food Item" : "Add New Food Item"}
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Food Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Price (₨)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">
                    Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Chicken, Rice, Spices"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Food Image</label>
                <LocalImageUpload onUpload={handleImageUpload} multiple={false}>
                  {({ open, isUploading }) => (
                    <button
                      type="button"
                      onClick={open}
                      disabled={isUploading}
                      className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:bg-gray-50 transition-colors touch-target"
                    >
                      {formData.image ? (
                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Food preview"
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded mx-auto"
                        />
                      ) : (
                        <>
                          <Plus className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-700" />
                          <p className="text-gray-700 text-xs sm:text-sm">Click to upload image</p>
                        </>
                      )}
                    </button>
                  )}
                </LocalImageUpload>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors touch-target"
                >
                  {editingFood ? "Update Food Item" : "Add Food Item"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingFood(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors touch-target"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Food Items List */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Food Items</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {food.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                />
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-900">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-700">{item.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mb-2">{item.description}</p>
                <p className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-900">
                  ₨{item.price.toLocaleString()}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 touch-target"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleAvailability(item._id, item.isAvailable)}
                    className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 touch-target ${
                      item.isAvailable
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {item.isAvailable ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors touch-target"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Orders Tab Component
function OrdersTab({ orders, onRefresh }) {
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Order status has been updated to ${newStatus}.`,
        });
        onRefresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update order status.",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "ready":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Food Orders Management</h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
                <div>
                  <h4 className="font-semibold text-base sm:text-lg text-gray-900">
                    Order #{order._id.slice(-6)}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Customer: {order.userId?.name} ({order.userId?.email})
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">Delivery: {order.deliveryAddress}</p>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-base sm:text-lg font-bold mt-2 text-gray-900">
                    ₨{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mb-3 sm:mb-4">
                <h5 className="font-medium text-gray-900 text-xs sm:text-sm mb-2">Order Items:</h5>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs sm:text-sm text-gray-900">
                      <span>
                        {item.foodId?.name} x {item.quantity}
                      </span>
                      <span>₨{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              {order.specialInstructions && (
                <div className="mb-3 sm:mb-4">
                  <h5 className="font-medium text-gray-900 text-xs sm:text-sm mb-1">Special Instructions:</h5>
                  <p className="text-xs sm:text-sm text-gray-700">{order.specialInstructions}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(order._id, "preparing")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-yellow-600 transition-colors touch-target"
                    >
                      Start Preparing
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(order._id, "cancelled")}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition-colors touch-target"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "ready")}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-600 transition-colors touch-target"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === "ready" && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "delivered")}
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-600 transition-colors touch-target"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Revenue Tab Component
function RevenueTab({ bookings, orders }) {
  const calculateRevenue = () => {
    const roomRevenue = bookings.reduce((sum, booking) => {
      if (booking.paymentStatus === "paid") {
        return sum + booking.totalAmount;
      }
      return sum;
    }, 0);
    const foodRevenue = orders.reduce((sum, order) => {
      if (order.status === "delivered") {
        return sum + order.totalAmount;
      }
      return sum;
    }, 0);
    return {
      roomRevenue,
      foodRevenue,
      totalRevenue: roomRevenue + foodRevenue,
    };
  };

  const { roomRevenue, foodRevenue, totalRevenue } = calculateRevenue();

  const getMonthlyRevenue = () => {
    const monthlyData = {};
    bookings.forEach((booking) => {
      if (booking.paymentStatus === "paid") {
        const month = new Date(booking.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
        monthlyData[month] = (monthlyData[month] || 0) + booking.totalAmount;
      }
    });
    orders.forEach((order) => {
      if (order.status === "delivered") {
        const month = new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
        monthlyData[month] = (monthlyData[month] || 0) + order.totalAmount;
      }
    });
    return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));
  };

  const monthlyRevenue = getMonthlyRevenue();

  return (
    <motion.div
      key="revenue"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            icon: Building,
            label: "Room Revenue",
            value: `₨${roomRevenue.toLocaleString()}`,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            icon: UtensilsCrossed,
            label: "Food Revenue",
            value: `₨${foodRevenue.toLocaleString()}`,
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            icon: DollarSign,
            label: "Total Revenue",
            value: `₨${totalRevenue.toLocaleString()}`,
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
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Monthly Revenue</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {monthlyRevenue.map((data, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100"
              >
                <span className="font-medium text-gray-900 text-xs sm:text-sm">{data.month}</span>
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  ₨{data.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {bookings
              .filter((booking) => booking.paymentStatus === "paid")
              .slice(0, 5)
              .map((booking) => (
                <div
                  key={booking._id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">
                      Room Booking - {booking.guestName}
                    </p>
                    <p className="text-xs text-gray-700">Room {booking.roomId?.roomNumber}</p>
                  </div>
                  <span className="text-green-600 font-bold text-xs sm:text-sm">
                    +₨{booking.totalAmount.toLocaleString()}
                  </span>
                </div>
              ))}
            {orders
              .filter((order) => order.status === "delivered")
              .slice(0, 5)
              .map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">
                      Food Order - {order.userId?.name}
                    </p>
                    <p className="text-xs text-gray-700">Order #{order._id.slice(-6)}</p>
                  </div>
                  <span className="text-green-600 font-bold text-xs sm:text-sm">
                    +₨{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}






