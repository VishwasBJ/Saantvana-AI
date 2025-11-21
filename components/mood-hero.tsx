"use client"

import { useEffect, useState } from "react"
import { Sparkles, Heart, Smile, Leaf } from "lucide-react"
import LogoIcon from "./logo-icon"

interface MoodHeroProps {
  userName?: string
}

export default function MoodHero({ userName }: MoodHeroProps) {
  const [mounted, setMounted] = useState(false)
  const [gradientFrom, setGradientFrom] = useState("#00C9FF")
  const [gradientTo, setGradientTo] = useState("#92FE9D")

  useEffect(() => {
    setMounted(true)
    
    // Get initial gradient colors
    const updateColors = () => {
      const from = getComputedStyle(document.documentElement).getPropertyValue('--gradient-from').trim() || "#00C9FF"
      const to = getComputedStyle(document.documentElement).getPropertyValue('--gradient-to').trim() || "#92FE9D"
      setGradientFrom(from)
      setGradientTo(to)
    }

    updateColors()
    
    // Listen for gradient changes
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
    
    return () => observer.disconnect()
  }, [])

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl mb-8 bg-transparent backdrop-blur-sm border border-white/10 shadow-sm">
      {/* Subtle Gradient Overlay - Blends with Background */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
          opacity: 0.08
        }}
      />
      
      {/* Minimal Glow Effects - Dynamic Colors */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-10 transition-all duration-1000"
        style={{ backgroundColor: gradientFrom }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-10 transition-all duration-1000"
        style={{ backgroundColor: gradientTo, animationDelay: '1s' }}
      />
      
      {/* Gentle Wave Layers - Minimal */}
      <div className="absolute inset-0 overflow-hidden opacity-15">
        <svg
          className="absolute bottom-0 left-0 w-full h-full wave-animation-1"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255, 255, 255, 0.08)"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full h-full wave-animation-2"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255, 255, 255, 0.06)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main Content Container - Reduced Padding */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 py-6 md:py-8 lg:py-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          {/* Left Side - Text Content */}
          <div className="flex-1 w-full text-center lg:text-left">
            <div
              className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Personalized Greeting */}
              {userName && (
                <div className="mb-6 md:mb-8">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 transition-all duration-500 gradient-primary-text">
                    {getGreeting()}, {userName}
                  </h1>
                  <p 
                    className="text-base md:text-lg font-medium transition-all duration-500"
                    style={{ color: gradientFrom, opacity: 0.7 }}
                  >
                    {currentDate}
                  </p>
                </div>
              )}
              
              {/* Hero Title - Gradient Text */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                <span className="block mb-2 transition-all duration-500 gradient-primary-text">
                  Hi, I'm
                </span>
                <span className="block transition-all duration-500 gradient-primary-text">
                  Calm Mind
                </span>
              </h2>
              
              <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-3 transition-all duration-500 gradient-primary-text">
                Your AI Partner for Emotional Wellness
              </p>
              <p 
                className="text-base md:text-lg font-light transition-all duration-500"
                style={{ color: gradientFrom, opacity: 0.7 }}
              >
                Let's explore your feelings together in a safe, supportive space
              </p>
            </div>
          </div>

          {/* Right Side - 3D Floating Wellness Icons */}
          <div className="relative w-full lg:w-auto lg:min-w-[350px] h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
            {/* Central Logo with Subtle Glow */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              {/* Subtle Glow Effect - Dynamic Colors */}
              <div 
                className="absolute inset-0 rounded-full blur-3xl animate-pulse transition-all duration-1000"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
                  opacity: 0.4
                }}
              />
              
              {/* Logo Container - Minimal */}
              <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-white/10 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center border border-white/20">
                <div className="relative opacity-95">
                  <LogoIcon size={100} className="drop-shadow-xl md:hidden" />
                  <LogoIcon size={120} className="drop-shadow-xl hidden md:block lg:hidden" />
                  <LogoIcon size={140} className="drop-shadow-xl hidden lg:block" />
                </div>
              </div>
            </div>

            {/* Floating 3D Wellness Icons - Subtle */}
            {/* Heart Icon */}
            <div
              className={`absolute top-4 md:top-8 left-4 md:left-8 transition-all duration-1000 delay-500 ${mounted ? "opacity-100" : "opacity-0"} hidden sm:block`}
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/15 backdrop-blur-xl rounded-3xl shadow-md flex items-center justify-center animate-float-3d border border-white/25">
                <Heart className="w-7 h-7 md:w-8 md:h-8 text-rose-400 fill-rose-300/60" />
              </div>
            </div>

            {/* Sparkles Icon */}
            <div
              className={`absolute top-8 md:top-16 right-2 md:right-4 transition-all duration-1000 delay-700 ${mounted ? "opacity-100" : "opacity-0"} hidden sm:block`}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/15 backdrop-blur-xl rounded-3xl shadow-md flex items-center justify-center animate-float-3d-delayed border border-white/25">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-amber-400" />
              </div>
            </div>

            {/* Smile Icon */}
            <div
              className={`absolute bottom-8 md:bottom-12 left-2 md:left-4 transition-all duration-1000 delay-900 ${mounted ? "opacity-100" : "opacity-0"} hidden sm:block`}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/15 backdrop-blur-xl rounded-3xl shadow-md flex items-center justify-center animate-float-3d-slow border border-white/25">
                <Smile className="w-6 h-6 md:w-7 md:h-7 text-cyan-400" />
              </div>
            </div>

            {/* Leaf Icon */}
            <div
              className={`absolute bottom-4 md:bottom-8 right-8 md:right-12 transition-all duration-1000 delay-1100 ${mounted ? "opacity-100" : "opacity-0"} hidden sm:block`}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/15 backdrop-blur-xl rounded-3xl shadow-md flex items-center justify-center animate-float-3d border border-white/25">
                <Leaf className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
              </div>
            </div>

            {/* Ambient Floating Particles */}
            <div className="absolute top-1/4 left-1/4 w-10 h-10 bg-cyan-300/20 rounded-full blur-md animate-float-3d-delayed" />
            <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-teal-300/20 rounded-full blur-md animate-float-3d-slow" />
            <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-emerald-300/15 rounded-full blur-lg animate-float-3d" />
          </div>
        </div>
      </div>

      {/* Sparkle Particles */}
      <div className="sparkle sparkle-1" />
      <div className="sparkle sparkle-2" />
      <div className="sparkle sparkle-3" />
      <div className="sparkle sparkle-4" />
      <div className="sparkle sparkle-5" />
      <div className="sparkle sparkle-6" />
    </div>
  )
}
