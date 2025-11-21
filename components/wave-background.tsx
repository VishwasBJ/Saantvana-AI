"use client"

interface WaveBackgroundProps {
  intensity?: 'subtle' | 'normal' | 'strong'
}

export default function WaveBackground({ intensity = 'normal' }: WaveBackgroundProps) {
  // Adjust opacity based on intensity
  const opacityMultiplier = intensity === 'subtle' ? 0.7 : intensity === 'strong' ? 1.5 : 1
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 3D Floating Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-3d"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-white/8 rounded-full blur-xl animate-float-3d-delayed"></div>
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-white/12 rounded-full blur-3xl animate-float-3d-slow"></div>
      <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-white/7 rounded-full blur-2xl animate-float-3d"></div>
      
      {/* Sparkle Particles */}
      <div className="sparkle sparkle-1"></div>
      <div className="sparkle sparkle-2"></div>
      <div className="sparkle sparkle-3"></div>
      <div className="sparkle sparkle-4"></div>
      <div className="sparkle sparkle-5"></div>
      <div className="sparkle sparkle-6"></div>
      
      {/* Wave Layer 1 - Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-full" style={{ opacity: 0.30 * opacityMultiplier }}>
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className="wave-animation-1"
            fill="rgba(255, 255, 255, 0.3)"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Wave Layer 2 - Middle */}
      <div className="absolute bottom-0 left-0 w-full h-full" style={{ opacity: 0.25 * opacityMultiplier }}>
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className="wave-animation-2"
            fill="rgba(255, 255, 255, 0.25)"
            d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Wave Layer 3 - Top */}
      <div className="absolute bottom-0 left-0 w-full h-full" style={{ opacity: 0.20 * opacityMultiplier }}>
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className="wave-animation-3"
            fill="rgba(255, 255, 255, 0.2)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float-slow"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 left-32 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float-delayed"></div>
    </div>
  )
}
