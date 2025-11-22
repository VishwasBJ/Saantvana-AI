"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./button"
import { Card } from "./card"
import { Alert, AlertDescription } from "./alert"
import { AlertTriangle, Phone, MapPin, Send, Paperclip, Smile, MoreVertical, Video, Search, Mic, X } from "lucide-react"

// Declare Jitsi API type
declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

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
  const [jitsiLoaded, setJitsiLoaded] = useState(false)
  const [meetingLink, setMeetingLink] = useState("")
  const [showLinkCopied, setShowLinkCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const jitsiApiRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load Jitsi Meet API script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => setJitsiLoaded(true)
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

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

  const startVideoCall = () => {
    if (!jitsiLoaded || !window.JitsiMeetExternalAPI) {
      alert('Jitsi Meet is loading. Please try again in a moment.')
      return
    }

    // Generate unique room name
    const roomName = `therapy-${Date.now()}`
    const meetingUrl = `https://meet.jit.si/${roomName}`
    setMeetingLink(meetingUrl)
    setShowVideoCall(true)

    // Initialize Jitsi Meet after modal is shown
    setTimeout(() => {
      if (jitsiContainerRef.current && !jitsiApiRef.current) {
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
          userInfo: {
            displayName: 'You',
          }
        }

        jitsiApiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', options)

        // Listen for hangup event
        jitsiApiRef.current.addEventListener('readyToClose', () => {
          endCall()
        })
      }
    }, 100)
  }

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink).then(() => {
      setShowLinkCopied(true)
      setTimeout(() => setShowLinkCopied(false), 3000)
    })
  }

  const startPhoneCall = () => {
    setShowPhoneCall(true)
  }

  const endCall = () => {
    // Dispose Jitsi API
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose()
      jitsiApiRef.current = null
    }
    
    setShowVideoCall(false)
    setShowPhoneCall(false)
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose()
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
      {/* Google Meet Style Chat Section */}
      <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* Google Meet-style Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
              PS
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Dr. Priya Sharma</h2>
            <p className="text-sm text-gray-600">{isTyping ? "typing..." : "Available • Confidential Therapy Session"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={startVideoCall}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            title="Start video call"
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">Join Video</span>
          </button>
          <button 
            onClick={startPhoneCall}
            className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Start voice call"
          >
            <Phone className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>



      {/* Chat Messages Area - Google Meet Style */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {message.sender === "therapist" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xs mr-3 flex-shrink-0">
                PS
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              {message.sender === "therapist" && (
                <p className="text-xs font-semibold text-gray-900 mb-1">Dr. Priya Sharma</p>
              )}
              <p className={`text-sm break-words whitespace-pre-wrap ${
                message.sender === "user" ? "text-white" : "text-gray-800"
              }`}>
                {message.text}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1.5">
                <span className={`text-xs ${
                  message.sender === "user" ? "text-blue-100" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
            {message.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs ml-3 flex-shrink-0">
                You
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xs mr-3 flex-shrink-0">
              PS
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
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

      {/* Google Meet-style Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message to Dr. Priya Sharma"
              className="w-full outline-none text-sm bg-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          {input.trim() ? (
            <button
              onClick={sendMessage}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-shrink-0 shadow-sm"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
        <p className="text-xs text-center text-gray-500 mt-3">
          🔒 Secure and confidential • Your privacy is protected
        </p>
      </div>
      </div>



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

      {/* Jitsi Video Call Modal */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                PS
              </div>
              <div>
                <h2 className="text-white font-semibold">Video Session with Dr. Priya Sharma</h2>
                <p className="text-green-400 text-xs">Connected • {formatCallDuration(callDuration)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Share Link Button */}
              <button 
                onClick={copyMeetingLink}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                title="Copy meeting link"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-white text-sm font-medium">
                  {showLinkCopied ? 'Copied!' : 'Share Link'}
                </span>
              </button>
              <button 
                onClick={endCall}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                title="End call"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Meeting Link Banner */}
          {meetingLink && (
            <div className="bg-blue-900/50 px-4 py-2 border-b border-blue-700/50">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <svg className="w-4 h-4 text-blue-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p className="text-blue-100 text-sm truncate">{meetingLink}</p>
                </div>
                <button 
                  onClick={copyMeetingLink}
                  className="ml-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs font-medium transition-colors flex-shrink-0"
                >
                  {showLinkCopied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Jitsi Meet Container */}
          <div className="flex-1 relative">
            <div 
              ref={jitsiContainerRef} 
              className="absolute inset-0"
              style={{ width: '100%', height: '100%' }}
            />
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
