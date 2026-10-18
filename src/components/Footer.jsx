"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react"

const footerLinks = {
  "Quick Links": [
    { name: "Home", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  Services: [
    { name: "Fine Dining", href: "/services#fine-dining" },
    { name: "Valet Parking", href: "/services#valet-parking" },
    { name: "Free WiFi", href: "/services#free-wifi" },
    { name: "Fitness Center", href: "/services#fitness-center" },
    { name: "Spa & Wellness", href: "/services#spa-wellness" },
    { name: "24/7 Concierge", href: "/services#concierge" },
  ],
  "Plan Your Stay": [
    { name: "Book a Room", href: "/book-room" },
    { name: "Order Food", href: "/order-food" },
    { name: "Contact Us", href: "/contact" },
    { name: "Sign In", href: "/auth/login" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link href="/" className="footer-brand" aria-label="LuxuryStay home">
              <img src="/images/luxurystay-logo-trimmed.png" alt="" className="footer-brand-logo" />
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience luxury redefined with our exceptional hospitality and world-class amenities. Your comfort is
              our priority.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                <span className="text-sm">123 Luxury Avenue, Faisalabad</span>
              </div>
              <a href="https://wa.me/92395534343" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp at +92395534343" className="flex items-center text-gray-300 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4 mr-2 text-amber-500" />
                <span className="text-sm">+92395534343</span>
              </a>
              <a href="mailto:versanexinc@gmail.com" className="flex items-center text-gray-300 hover:text-amber-400 transition-colors">
                <Mail className="w-4 h-4 mr-2 text-amber-500" />
                <span className="text-sm">versanexinc@gmail.com</span>
              </a>
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 text-amber-500">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-amber-500 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div>
              <p className="text-white font-semibold">Questions before you arrive?</p>
              <p className="text-gray-400 text-sm mt-1">Our team is happy to help plan your stay.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/contact" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
                Contact our team <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a href="https://wa.me/92395534343" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-amber-300 text-sm transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} LuxuryStay. All rights reserved. | Designed with ❤️ for exceptional experiences.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
