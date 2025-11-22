"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LogoIcon from "./logo-icon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Send, AlertTriangle, Phone, Mic, Volume2, VolumeX } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatProps {
  age: number
  selectedCategories: string[]
}

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "harm myself",
  "want to die",
  "end it all",
  "no point",
  "self harm",
  "cut myself",
  "hurt myself",
]

export default function AIChat({ age }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setError("Voice recognition failed. Please try again.")
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const detectCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase()
    return CRISIS_KEYWORDS.some((keyword) => lowerText.includes(keyword))
  }

  // Start voice recording
  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Voice recognition not supported in this browser")
      return
    }

    setError(null)
    setIsListening(true)
    recognitionRef.current.start()
  }

  // Stop voice recording
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  // Text-to-Speech
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.name.includes("Google") || 
        voice.name.includes("Female") ||
        voice.lang.startsWith("en")
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  // Stop speaking
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const hasCrisisIndicators = detectCrisis(input)
    if (hasCrisisIndicators) {
      setShowCrisisAlert(true)
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      speakText(data.response)
    } catch (err: any) {
      console.error("Chat error:", err)
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e as any)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 rounded-2xl p-4">
      <AlertDialog open={showCrisisAlert} onOpenChange={setShowCrisisAlert}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              We're Here for You
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                I've detected that you might be in distress. Your safety is our priority, and I want to make sure you
                have immediate support.
              </p>
              <p className="font-semibold text-foreground">Crisis Support Resources:</p>
              <ul className="space-y-1 text-sm">
                <li>🇺🇸 US: 988 (Suicide & Crisis Lifeline) - Free & Confidential</li>
                <li>🇬🇧 UK: 116 123 (Samaritans) - Available 24/7</li>
                <li>🇮🇳 India: 9152987821 (iCall) - Mental Health Support</li>
              </ul>
              <p className="text-sm italic text-muted-foreground">
                You can also reach out to a trusted friend, family member, or visit your nearest emergency room.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel className="rounded-xl">Continue Chatting</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-xl">
              <Phone className="w-4 h-4 mr-2" />
              Call Helpline
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex-shrink-0 text-center pb-4 mb-4 border-b border-border/50">
        <div className="flex justify-center mb-3">
          <div className="relative">
            <LogoIcon size={56} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
          AI Mental Wellness Companion
        </h2>
        <p className="text-xs text-muted-foreground">
          Confidential • Supportive • Available 24/7
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-border/50 max-w-md">
              <p className="text-muted-foreground mb-3">
                👋 Hi! I'm here to listen and support you. Feel free to share what's on your mind.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setInput("I'm feeling anxious today")}
                  className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                >
                  I'm feeling anxious
                </button>
                <button
                  onClick={() => setInput("I need help managing stress")}
                  className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                >
                  Managing stress
                </button>
                <button
                  onClick={() => setInput("I'm having trouble sleeping")}
                  className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                >
                  Sleep issues
                </button>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-purple-600"
                  : "bg-gradient-to-br from-green-400 to-teal-500"
              }`}
            >
              {message.role === "user" ? "👤" : "🤖"}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col max-w-[75%] ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-sm"
                    : "bg-white/80 backdrop-blur-sm text-foreground border border-border/50 rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex gap-3 animate-in fade-in duration-300">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-sm shadow-sm">
              🤖
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-border/50 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex justify-center animate-in fade-in duration-300">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl text-sm shadow-sm max-w-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="flex-shrink-0 space-y-2">
        <div className="flex gap-2 items-end bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-border/50">
          <Button
            type="button"
            size="icon"
            variant={isListening ? "destructive" : "ghost"}
            onClick={isListening ? stopListening : startListening}
            disabled={loading}
            className={`rounded-full transition-all flex-shrink-0 ${isListening ? "animate-pulse scale-110 shadow-lg" : ""}`}
            title="Voice input"
          >
            <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or speak your message..."
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-20"
              disabled={loading}
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-500 text-xs font-semibold">Listening</span>
              </div>
            )}
          </div>

          {isSpeaking && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={stopSpeaking}
              className="rounded-full animate-pulse flex-shrink-0"
              title="Stop speaking"
            >
              <Volume2 className="w-4 h-4 text-green-600" />
            </Button>
          )}

          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="gradient-primary hover:opacity-90 text-white rounded-full shadow-md flex-shrink-0"
            size="icon"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center px-2">
          🔒 Confidential • For emergencies, contact local emergency services
        </p>
      </form>
    </div>
  )
}
