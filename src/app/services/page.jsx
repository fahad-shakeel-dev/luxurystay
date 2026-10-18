"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Utensils, Car, Wifi, Dumbbell, Waves, Headphones } from "lucide-react"

const services = [
  {
    id: "fine-dining",
    icon: Utensils,
    title: "Fine Dining",
    description: "Experience world-class cuisine at our award-winning restaurants with diverse international menus.",
  },
  {
    id: "valet-parking",
    icon: Car,
    title: "Valet Parking",
    description: "Complimentary valet parking service available 24/7 for all our guests convenience.",
  },
  {
    id: "free-wifi",
    icon: Wifi,
    title: "Free WiFi",
    description: "High-speed internet access throughout the hotel premises for seamless connectivity.",
  },
  {
    id: "fitness-center",
    icon: Dumbbell,
    title: "Fitness Center",
    description: "State-of-the-art fitness facility with modern equipment and personal training services.",
  },
  {
    id: "spa-wellness",
    icon: Waves,
    title: "Spa & Wellness",
    description: "Rejuvenate your body and mind at our luxury spa with therapeutic treatments.",
  },
  {
    id: "concierge",
    icon: Headphones,
    title: "24/7 Concierge",
    description: "Our dedicated concierge team is available round the clock to assist with your needs.",
  },
]

export default function Services() {
  return (
    <main className="services-page">
      <div className="services-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="services-intro"
        >
          <div className="services-intro-copy">
            <p className="stays-eyebrow"><span /> Thoughtful hospitality</p>
            <h1>More than a<br /><span>place to stay.</span></h1>
            <p className="services-lead">The best stays feel effortless. From a table worth lingering over to help whenever you need it, every detail is here to make your time away feel like your own.</p>
            <Link href="/contact" className="services-contact">Get in touch <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="services-intro-photo">
            <img src="/images/photo-1445019980597-93fa8acb246c.jpg" alt="A quiet, sunlit terrace at the hotel" />
            <div className="services-photo-caption"><span>Make yourself at home</span><p>We’ll take care of the details.</p></div>
          </div>
        </motion.div>

        <div className="services-heading">
          <div><p className="stays-eyebrow"><span /> Here for your stay</p><h2>Considered comforts.<br />Right when you need them.</h2></div>
          <p>Little touches and essential comforts, brought together with the same care as your room.</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              id={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="service-card"
            >
              <div className="service-card-top"><span className="service-icon"><service.icon size={22} strokeWidth={1.6} aria-hidden="true" /></span><span className="service-number">0{index + 1}</span></div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  )
}
