"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

const heroSlides = [
  {
    id: 1,
    image: "/hotel-exterior.jpg",
    title: "Luxury Redefined",
    subtitle: "Experience the pinnacle of hospitality",
    description: "Indulge in our world-class amenities and exceptional service",
  },
  {
    id: 2,
    image: "/images/photo-1618773928121-c32242e63f39.jpg",
    title: "Elegant Comfort",
    subtitle: "Where luxury meets tranquility",
    description: "Discover our beautifully appointed rooms and suites",
  },
  {
    id: 3,
    image: "/images/photo-1673687778498-5ddd20749408.jpg",
    title: "Unforgettable Moments",
    subtitle: "Create memories that last a lifetime",
    description: "From romantic getaways to business retreats",
  },
   {
    id: 4,
    image: "/images/photo-1445019980597-93fa8acb246c.jpg",
    title: "Luxury Redefined",
    subtitle: "Experience the pinnacle of hospitality",
    description: "Indulge in our world-class amenities and exceptional service",
  },
  {
    id: 5,
    image: "/images/photo-1542314831-068cd1dbfeeb.jpg",
    title: "Elegant Comfort",
    subtitle: "Where luxury meets tranquility",
    description: "Discover our beautifully appointed rooms and suites",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[currentSlide]
  const titleWords = slide.title.split(" ")
  const accentWord = titleWords.pop()

  return (
    <section className="hotel-hero" aria-label="Welcome to LuxuryStay" aria-roledescription="carousel">
      <div className="hotel-hero-images" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.img
            key={slide.id}
            src={slide.image}
            onError={(event) => {
              if (event.currentTarget.getAttribute("src") !== "/hotel-exterior.jpg") {
                event.currentTarget.src = "/hotel-exterior.jpg"
              }
            }}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="hotel-hero-image"
          />
        </AnimatePresence>
      </div>
      <div className="hotel-hero-shade" />

      {/* Copy is visible on first render and stays visible through image transitions. */}
      <div className="hotel-hero-inner">
        <div className="hotel-hero-copy">
          <p className="hotel-hero-eyebrow"><span /> Welcome to LuxuryStay</p>
          <h1>{titleWords.join(" ")}<br /><span>{accentWord}</span></h1>
          <p className="hotel-hero-subtitle">{slide.subtitle}</p>
          <p className="hotel-hero-description">{slide.description}</p>
          <div className="hotel-hero-actions">
            <Link href="/rooms" className="hotel-hero-book">Book your stay <ChevronRight size={18} aria-hidden="true" /></Link>
            <Link href="/about" className="hotel-hero-about">Explore LuxuryStay</Link>
          </div>
        </div>

      </div>
    </section>
  )
}
