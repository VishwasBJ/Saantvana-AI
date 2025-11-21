"use client"

interface LogoIconProps {
  size?: number
  className?: string
}

export default function LogoIcon({ size = 64, className = "" }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(100, 100)">
        {/* Top Main Spike - Layered Cyan/Blue */}
        <path d="M 0,-85 L 12,-25 L 0,-30 Z" fill="url(#grad-top-light)" />
        <path d="M 0,-85 L -12,-25 L 0,-30 Z" fill="url(#grad-top-dark)" />
        <path d="M 0,-30 L 12,-25 L -12,-25 Z" fill="url(#grad-top-base)" />
        
        {/* Top-Right Accent - Small Cyan */}
        <path d="M 35,-50 L 25,-35 L 20,-40 Z" fill="#22D3EE" opacity="0.9" />
        
        {/* Top-Right Main Spike - Layered Blue */}
        <path d="M 60,-60 L 25,-15 L 30,-20 Z" fill="url(#grad-tr-light)" />
        <path d="M 60,-60 L 20,-20 L 25,-15 Z" fill="url(#grad-tr-dark)" />
        
        {/* Right Accent - Small Magenta */}
        <path d="M 50,0 L 40,8 L 40,-8 Z" fill="#E879F9" opacity="0.85" />
        
        {/* Right Main Spike - Layered Purple/Magenta */}
        <path d="M 85,0 L 30,20 L 30,0 Z" fill="url(#grad-r-light)" />
        <path d="M 85,0 L 30,0 L 30,-20 Z" fill="url(#grad-r-dark)" />
        
        {/* Bottom-Right Accent - Small Magenta */}
        <path d="M 35,50 L 20,40 L 25,35 Z" fill="#D946EF" opacity="0.9" />
        
        {/* Bottom-Right Main Spike - Layered Magenta */}
        <path d="M 60,60 L 30,20 L 25,15 Z" fill="url(#grad-br-light)" />
        <path d="M 60,60 L 25,15 L 20,20 Z" fill="url(#grad-br-dark)" />
        
        {/* Bottom Main Spike - Layered Purple/Magenta */}
        <path d="M 0,85 L -12,25 L 0,30 Z" fill="url(#grad-b-dark)" />
        <path d="M 0,85 L 12,25 L 0,30 Z" fill="url(#grad-b-light)" />
        <path d="M 0,30 L -12,25 L 12,25 Z" fill="url(#grad-b-base)" />
        
        {/* Bottom-Left Accent - Small Purple */}
        <path d="M -35,50 L -25,35 L -20,40 Z" fill="#A78BFA" opacity="0.9" />
        
        {/* Bottom-Left Main Spike - Layered Purple */}
        <path d="M -60,60 L -25,15 L -30,20 Z" fill="url(#grad-bl-light)" />
        <path d="M -60,60 L -20,20 L -25,15 Z" fill="url(#grad-bl-dark)" />
        
        {/* Left Main Spike - Layered Teal/Green */}
        <path d="M -85,0 L -30,-20 L -30,0 Z" fill="url(#grad-l-light)" />
        <path d="M -85,0 L -30,0 L -30,20 Z" fill="url(#grad-l-dark)" />
        
        {/* Left Accent - Small Teal */}
        <path d="M -50,0 L -40,-8 L -40,8 Z" fill="#14B8A6" opacity="0.85" />
        
        {/* Top-Left Accent - Small Cyan */}
        <path d="M -35,-50 L -20,-40 L -25,-35 Z" fill="#06B6D4" opacity="0.9" />
        
        {/* Top-Left Main Spike - Layered Cyan */}
        <path d="M -60,-60 L -30,-20 L -25,-15 Z" fill="url(#grad-tl-light)" />
        <path d="M -60,-60 L -25,-15 L -20,-20 Z" fill="url(#grad-tl-dark)" />
        
        {/* Center Core */}
        <circle r="5" fill="#FFFFFF" opacity="0.3" />
      </g>
      
      <defs>
        {/* Top Spike Gradients */}
        <linearGradient id="grad-top-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id="grad-top-dark" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="grad-top-base" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        
        {/* Top-Right Gradients */}
        <linearGradient id="grad-tr-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id="grad-tr-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        
        {/* Right Gradients */}
        <linearGradient id="grad-r-light" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="grad-r-dark" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
        
        {/* Bottom-Right Gradients */}
        <linearGradient id="grad-br-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0ABFC" />
          <stop offset="100%" stopColor="#E879F9" />
        </linearGradient>
        <linearGradient id="grad-br-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E879F9" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
        
        {/* Bottom Gradients */}
        <linearGradient id="grad-b-light" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E879F9" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
        <linearGradient id="grad-b-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C026D3" />
          <stop offset="100%" stopColor="#A21CAF" />
        </linearGradient>
        <linearGradient id="grad-b-base" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        
        {/* Bottom-Left Gradients */}
        <linearGradient id="grad-bl-light" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="grad-bl-dark" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        
        {/* Left Gradients */}
        <linearGradient id="grad-l-light" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        <linearGradient id="grad-l-dark" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        
        {/* Top-Left Gradients */}
        <linearGradient id="grad-tl-light" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id="grad-tl-dark" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  )
}
