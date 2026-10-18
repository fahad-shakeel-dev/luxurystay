"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No Image</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-lg">
      <img
        src={images[currentIndex] || "/placeholder.svg"}
        alt={`Room image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-400"}`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
