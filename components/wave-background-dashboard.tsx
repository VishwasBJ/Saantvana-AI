"use client"

import { useEffect, useState } from "react"

export default function WaveBackgroundDashboard() {
  const [gradientFrom, setGradientFrom] = useState("#00C9FF")
  const [gradientTo, setGradientTo] = useState("#92FE9D")

  useEffect(() => {
    const updateColors = () => {
      const from = getComputedStyle(document.documentElement).getPropertyValue('--gradient-from').trim() || "#00C9FF"
      const to = getComputedStyle(document.documentElement).getPropertyValue('--gradient-to').trim() || "#92FE9D"
      setGradientFrom(from)
      setGradientTo(to)
    }

    updateColors()
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
    
    return () => observer.disconnect()
  }, [])

  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return `rgba(0, 201, 255, ${alpha})`
    return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dynamic Gradient Background - More Visible */}
      <div 
        className="absolute inset-0 opacity-55 transition-all duration-1000"
        style={{
          background: `linear-gradient(to bottom right, ${hexToRgba(gradientFrom, 0.25)}, ${hexToRgba(gradientTo, 0.20)})`
        }}
      />
      <div 
        className="absolute inset-0 opacity-45 transition-all duration-1000"
        style={{
          background: `linear-gradient(to top right, ${hexToRgba(gradientFrom, 0.15)} 0%, transparent 50%, ${hexToRgba(gradientTo, 0.22)} 100%)`
        }}
      />
      <div 
        className="absolute inset-0 opacity-35 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${hexToRgba(gradientFrom, 0.18)}, transparent 70%)`
        }}
      />
      
      {/* Large Atmospheric Orbs - More Visible */}
      <div 
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-float transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientFrom, 0.18)}, ${hexToRgba(gradientTo, 0.14)})` }}
      />
      <div 
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full blur-[140px] animate-float-delayed transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientTo, 0.16)}, ${hexToRgba(gradientFrom, 0.12)})` }}
      />
      <div 
        className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full blur-[100px] animate-float-slow transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientFrom, 0.14)}, ${hexToRgba(gradientTo, 0.10)})` }}
      />
      
      {/* Medium Floating Orbs - More Visible */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientFrom, 0.22)}, ${hexToRgba(gradientTo, 0.16)})` }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-float-delayed transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientTo, 0.18)}, ${hexToRgba(gradientFrom, 0.14)})` }}
      />
      <div 
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-2xl animate-float-slow transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientFrom, 0.16)}, ${hexToRgba(gradientTo, 0.12)})` }}
      />
      
      {/* Small Accent Orbs - More Visible */}
      <div 
        className="absolute top-20 right-20 w-40 h-40 rounded-full blur-xl animate-float-3d transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientFrom, 0.18)}, ${hexToRgba(gradientTo, 0.14)})` }}
      />
      <div 
        className="absolute bottom-32 left-32 w-32 h-32 rounded-full blur-xl animate-float-3d-delayed transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientTo, 0.16)}, ${hexToRgba(gradientFrom, 0.12)})` }}
      />
      <div 
        className="absolute top-40 left-1/3 w-36 h-36 rounded-full blur-2xl animate-float-3d-slow transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom right, ${hexToRgba(gradientFrom, 0.14)}, ${hexToRgba(gradientTo, 0.10)})` }}
      />
      
      {/* Wave Layer 1 - Bottom (More Visible) */}
      <div className="absolute bottom-0 left-0 w-full h-[50%] opacity-40 transition-all duration-1000">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className="wave-animation-1"
            fill="url(#wave-gradient-dash-1)"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="wave-gradient-dash-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={hexToRgba(gradientFrom, 0.25)} />
              <stop offset="50%" stopColor={hexToRgba(gradientTo, 0.20)} />
              <stop offset="100%" stopColor={hexToRgba(gradientFrom, 0.18)} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wave Layer 2 - Middle (More Visible) */}
      <div className="absolute bottom-0 left-0 w-full h-[45%] opacity-35 transition-all duration-1000">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className="wave-animation-2"
            fill="url(#wave-gradient-dash-2)"
            d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="wave-gradient-dash-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={hexToRgba(gradientTo, 0.22)} />
              <stop offset="50%" stopColor={hexToRgba(gradientFrom, 0.18)} />
              <stop offset="100%" stopColor={hexToRgba(gradientTo, 0.16)} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wave Layer 3 - Top (More Visible) */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] opacity-30 transition-all duration-1000">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className="wave-animation-3"
            fill="url(#wave-gradient-dash-3)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="wave-gradient-dash-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={hexToRgba(gradientFrom, 0.20)} />
              <stop offset="50%" stopColor={hexToRgba(gradientTo, 0.16)} />
              <stop offset="100%" stopColor={hexToRgba(gradientFrom, 0.14)} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
