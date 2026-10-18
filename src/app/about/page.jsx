"use client"
import { motion } from "framer-motion"
import { Award, Users, Clock, MapPin } from "lucide-react"

const stats = [
  { icon: Award, number: "25+", label: "Years of Excellence" },
  { icon: Users, number: "10K+", label: "Happy Guests" },
  { icon: Clock, number: "24/7", label: "Service Available" },
  { icon: MapPin, number: "5", label: "Prime Locations" },
]

export default function About() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-amber-500">LuxuryStay</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              For over two decades, LuxuryStay has been synonymous with exceptional hospitality and unparalleled luxury.
              We pride ourselves on creating unforgettable experiences that exceed our guests' expectations.
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Our commitment to excellence is reflected in every aspect of our service, from our elegantly appointed
              rooms to our world-class amenities and personalized guest care.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              <a href="/services">Learn More About Us</a>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="/placeholder.svg?height=500&width=600"
              alt="Luxury Hotel Interior"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-amber-600 text-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-2">Premium Experience</h3>
              <p className="text-amber-100">Luxury redefined for modern travelers</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center justify-center w-12 h-12 bg-amber-600 text-white rounded-full mb-4"
              >
                <stat.icon className="w-6 h-6" />
              </motion.div>
              <div className="text-3xl font-bold text-amber-500 mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
