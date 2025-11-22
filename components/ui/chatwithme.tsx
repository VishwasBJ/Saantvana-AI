"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./button"
import { Card } from "./card"
import { Alert, AlertDescription } from "./alert"
import { AlertTriangle, Phone, MapPin, Send, Paperclip, Smile, MoreVertical, Video, Search, Mic } from "lucide-react"

const CRISIS_RESOURCES = {
  india: [
    { name: "iCall Mental Health", description: "Helpline for emotional support", phone: "9152987821" },
    { name: "Vandrevala Foundation", description: "24-hour emotional support", phone: "9999 77 6555" },
  ],
  us: [
    { name: "988 Suicide & Crisis Lifeline", description: "Free, confidential support 24/7", phone: "988" },
    { name: "Crisis Text Line", description: "Text HOME to 741741", phone: "Text-based" },
  ],
}

interface Message {
  id: string
  text: string
  sender: "user" | "therapist"
  timestamp: Date
  status?: "sent" | "delivered" | "read"
}

const THERAPIST_RESPONSES = [
  "I hear you. That sounds really challenging. Can you tell me more about how this has been affecting you?",
  "Thank you for sharing that with me. It takes courage to open up. What do you think would help you feel better?",
  "I understand. Those feelings are completely valid. Have you noticed any patterns or triggers?",
  "That must be difficult for you. How long have you been experiencing this?",
  "I'm here to support you. What coping strategies have you tried so far?",
  "It's okay to feel this way. Let's work through this together. What would you like to focus on today?",
  "I appreciate you trusting me with this. How has this been impacting your daily life?",
  "That's a very important insight. What do you think is the root cause of these feelings?",
  "I can see this is weighing on you. Have you been able to talk to anyone else about this?",
  "Your feelings matter. Let's explore some ways to help you manage this better."
]

export default function ChatWithMe({ age }: { age: number }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Namaste! I'm Dr. Priya Sharma, your therapist. I'm here to listen and support you. How are you feeling today?",
      sender: "therapist",
      timestamp: new Date(Date.now() - 60000),
      status: "read"
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [showPhoneCall, setShowPhoneCall] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (showVideoCall || showPhoneCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
      setCallDuration(0)
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [showVideoCall, showPhoneCall])

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startVideoCall = async () => {
    try {
      setCameraError(null)
      
      // Stop any existing streams first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: true 
      })
      
      streamRef.current = stream
      setShowVideoCall(true)
      setIsCameraOn(true)
      setIsMicOn(true)
      
      // Wait for video element to be available
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current
        }
      }, 100)
    } catch (error: any) {
      console.error("Camera access error:", error)
      let errorMessage = "Unable to access camera. "
      
      if (error.name === "NotAllowedError") {
        errorMessage += "Please allow camera and microphone permissions in your browser."
      } else if (error.name === "NotFoundError") {
        errorMessage += "No camera or microphone found on your device."
      } else if (error.name === "NotReadableError") {
        errorMessage += "Camera is already in use by another application. Please close other apps using the camera."
      } else if (error.name === "OverconstrainedError") {
        errorMessage += "Camera doesn't support the requested settings."
      } else {
        errorMessage += error.message || "Please check your device settings."
      }
      
      setCameraError(errorMessage)
    }
  }

  const startPhoneCall = () => {
    setShowPhoneCall(true)
  }

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsCameraOn(videoTrack.enabled)
      }
    }
  }

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMicOn(audioTrack.enabled)
      }
    }
  }

  const endCall = () => {
    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setShowVideoCall(false)
    setShowPhoneCall(false)
    setIsCameraOn(true)
    setIsMicOn(true)
    setCameraError(null)
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const getTherapistResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Context-aware responses
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("worried")) {
      return "I understand anxiety can be overwhelming. Let's take a moment - try taking three deep breaths with me. What specific situations trigger your anxiety?"
    }
    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down")) {
      return "I'm sorry you're feeling this way. Depression can feel very isolating. Remember, you're not alone. What activities used to bring you joy?"
    }
    if (lowerMessage.includes("stress") || lowerMessage.includes("stressed")) {
      return "Stress is very common, especially in today's world. Let's identify what's causing the most stress. Can you share what's been on your mind lately?"
    }
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      return "Sleep issues can really affect our wellbeing. Have you tried establishing a bedtime routine? Let's discuss some sleep hygiene practices that might help."
    }
    if (lowerMessage.includes("family") || lowerMessage.includes("parents")) {
      return "Family relationships can be complex. It's important to set healthy boundaries while maintaining connection. What specific challenges are you facing?"
    }
    if (lowerMessage.includes("work") || lowerMessage.includes("job")) {
      return "Work-related stress is very common. Finding work-life balance is crucial. What aspects of work are most challenging for you?"
    }
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're very welcome! I'm here for you. Is there anything else you'd like to discuss today?"
    }
    if (lowerMessage.includes("better") || lowerMessage.includes("good")) {
      return "That's wonderful to hear! Progress is important to acknowledge. What do you think has helped you feel better?"
    }
    
    // Random supportive response
    return THERAPIST_RESPONSES[Math.floor(Math.random() * THERAPIST_RESPONSES.length)]
  }

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sent"
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    
    // Simulate therapist typing delay (1.5-3 seconds)
    const typingDelay = 1500 + Math.random() * 1500
    
    setTimeout(() => {
      const responseText = getTherapistResponse(userMessage.text)
      const therapistResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "therapist",
        timestamp: new Date(),
        status: "read"
      }
      setMessages(prev => [...prev, therapistResponse])
      setIsTyping(false)
    }, typingDelay)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="space-y-6">
      {/* WhatsApp Chat Section */}
      <div className="flex flex-col h-[calc(100vh-16rem)] bg-[#f0f2f5] rounded-2xl overflow-hidden shadow-lg">
      {/* WhatsApp-style Header */}
      <div className="bg-[#008069] text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
            PS
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-base">Dr. Priya Sharma</h2>
          <p className="text-xs text-green-100">{isTyping ? "typing..." : "Online • Confidential Session"}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={startVideoCall}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
            title="Start video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button 
            onClick={startPhoneCall}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
            title="Start voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>



      {/* Chat Messages Area - WhatsApp Style */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#e5ddd5'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                message.sender === "user"
                  ? "bg-[#d9fdd3] rounded-br-none"
                  : "bg-white rounded-bl-none"
              }`}
            >
              <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">
                {message.text}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {message.sender === "user" && (
                  <span className="text-xs text-gray-400">
                    {message.status === "sent" && "✓"}
                    {message.status === "delivered" && "✓✓"}
                    {message.status === "read" && <span className="text-blue-500">✓✓</span>}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white rounded-lg rounded-bl-none px-3 py-2 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp-style Input Area */}
      <div className="bg-[#f0f2f5] px-4 py-3 flex items-end gap-2 border-t border-gray-200">
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0">
          <Smile className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0">
          <Paperclip className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1 bg-white rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>
        {input.trim() ? (
          <button
            onClick={sendMessage}
            className="p-3 bg-[#008069] hover:bg-[#017561] rounded-full transition-colors flex-shrink-0 shadow-md"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button className="p-3 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0">
            <Mic className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Quick Info Footer */}
      <div className="bg-white px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          🔒 End-to-end encrypted • Confidential therapy session
        </p>
      </div>
      </div>

      {/* Camera Error Alert */}
      {cameraError && (
        <Alert className="border-red-300 bg-red-50 shadow-md">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-900 font-medium">
            <p className="font-semibold mb-1">Camera Access Error</p>
            <p className="text-sm">{cameraError}</p>
            <button 
              onClick={() => setCameraError(null)}
              className="mt-2 text-xs text-red-700 hover:text-red-900 underline"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Crisis Help Resources Section - Compact */}
      <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-red-900">Crisis Support</h2>
          <span className="text-xs text-red-700 ml-auto">24/7 • Free</span>
        </div>

        {/* Countries Side by Side - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* India */}
          <Card className="p-3 bg-white border border-orange-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🇮🇳</span>
              <h3 className="text-sm font-bold text-gray-900">India</h3>
            </div>
            <div className="space-y-2">
              <a
                href="tel:9152987821"
                className="flex items-center gap-2 px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-semibold"
              >
                <Phone className="w-3 h-3" />
                9152987821
              </a>
              <a
                href="tel:9999776555"
                className="flex items-center gap-2 px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-semibold"
              >
                <Phone className="w-3 h-3" />
                9999 77 6555
              </a>
            </div>
          </Card>

          {/* United States */}
          <Card className="p-3 bg-white border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🇺🇸</span>
              <h3 className="text-sm font-bold text-gray-900">United States</h3>
            </div>
            <div className="space-y-2">
              <a
                href="tel:988"
                className="flex items-center gap-2 px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold"
              >
                <Phone className="w-3 h-3" />
                988 Lifeline
              </a>
              <a
                href="sms:741741"
                className="flex items-center gap-2 px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold"
              >
                <Phone className="w-3 h-3" />
                Text 741741
              </a>
            </div>
          </Card>

          {/* United Kingdom */}
          <Card className="p-3 bg-white border border-purple-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🇬🇧</span>
              <h3 className="text-sm font-bold text-gray-900">United Kingdom</h3>
            </div>
            <div className="space-y-2">
              <a
                href="tel:116123"
                className="flex items-center gap-2 px-2 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs font-semibold"
              >
                <Phone className="w-3 h-3" />
                116 123
              </a>
              <a
                href="sms:85258"
                className="flex items-center gap-2 px-2 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs font-semibold"
              >
                <Phone className="w-3 h-3" />
                Text 85258
              </a>
            </div>
          </Card>
        </div>

        {/* Compact Reminder */}
        <p className="mt-3 text-xs text-center text-gray-700 bg-blue-50 rounded px-3 py-2">
          💙 You're not alone. Help is available 24/7.
        </p>
      </Card>

      {/* Video Call Modal */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl">
            {/* Video Area */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {/* Therapist Video (Main) - Simulated */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold mb-4 animate-pulse">
                  PS
                </div>
                <p className="text-white text-xl font-semibold">Dr. Priya Sharma</p>
                <p className="text-green-400 text-sm mt-2">Connected • {formatCallDuration(callDuration)}</p>
              </div>
              
              {/* User Video (Picture-in-Picture) - Real Camera */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-white/20 overflow-hidden shadow-2xl">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs">Camera Off</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Status Overlay */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="text-white text-sm font-semibold">
                  {formatCallDuration(callDuration)}
                </p>
              </div>
            </div>

            {/* Call Controls */}
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-center gap-4">
              <button 
                onClick={toggleMic}
                className={`p-4 rounded-full transition-colors ${
                  isMicOn 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isMicOn ? "Mute microphone" : "Unmute microphone"}
              >
                <Mic className={`w-6 h-6 ${isMicOn ? 'text-white' : 'text-white line-through'}`} />
              </button>
              <button 
                onClick={toggleCamera}
                className={`p-4 rounded-full transition-colors ${
                  isCameraOn 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isCameraOn ? "Turn off camera" : "Turn on camera"}
              >
                <Video className={`w-6 h-6 ${isCameraOn ? 'text-white' : 'text-white line-through'}`} />
              </button>
              <button 
                onClick={endCall}
                className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                title="End call"
              >
                <Phone className="w-6 h-6 text-white rotate-135" />
              </button>
              <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Call Modal */}
      {showPhoneCall && (
        <div className="fixed inset-0 bg-gradient-to-br from-green-900 to-teal-900 z-50 flex items-center justify-center p-4">
          <div className="text-center">
            {/* Therapist Avatar */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-5xl font-bold mx-auto mb-6 shadow-2xl animate-pulse">
              PS
            </div>
            
            {/* Call Info */}
            <h2 className="text-white text-3xl font-bold mb-2">Dr. Priya Sharma</h2>
            <p className="text-green-300 text-lg mb-1">Voice Call</p>
            <p className="text-white text-xl font-mono mb-8">{formatCallDuration(callDuration)}</p>

            {/* Audio Wave Animation */}
            <div className="flex items-center justify-center gap-1 mb-12">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 40}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-6">
              <button className="p-5 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm">
                <Mic className="w-7 h-7 text-white" />
              </button>
              <button 
                onClick={endCall}
                className="p-6 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-2xl"
              >
                <Phone className="w-8 h-8 text-white rotate-135" />
              </button>
              <button className="p-5 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm">
                <MoreVertical className="w-7 h-7 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
