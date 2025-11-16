"use client"

import { useEffect, useRef } from "react"

export default function StressVideo() {
  const videoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = videoRef.current
    if (!img) return

    img.src = "http://localhost:8000/video_feed" // FastAPI video feed
  }, [])

  return (
    <div className="flex justify-center">
      <img ref={videoRef} alt="Stress Detector Feed" />
    </div>
  )
}
