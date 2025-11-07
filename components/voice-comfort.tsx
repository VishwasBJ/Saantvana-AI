"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Mic, StopCircle, Upload, Send, Volume2 } from "lucide-react"
import { getDetailedResponse, detectEmotionalTone } from "@/lib/ai-response-engine"

interface VoiceMessage {
  id: string
  type: "user" | "ai"
  text: string
  audioUrl?: string
  timestamp: Date
}

export default function VoiceComfort() {
  const [voiceFile, setVoiceFile] = useState<File | null>(null)
  const [friendName, setFriendName] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [userInput, setUserInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [voiceChatActive, setVoiceChatActive] = useState(false)
  const [voiceSampleUrl, setVoiceSampleUrl] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const [isListening, setIsListening] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setTranscribedText("")
      }

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            setTranscribedText((prev) => prev + transcript + " ")
          } else {
            interimTranscript += transcript
          }
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("[v0] Speech recognition error:", event.error)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type.includes("audio") || file.name.endsWith(".mp3") || file.name.endsWith(".wav"))) {
      setVoiceFile(file)
      const url = URL.createObjectURL(file)
      setVoiceSampleUrl(url)
      console.log("[v0] Voice file uploaded:", file.name, file.size, "bytes")
    } else {
      alert("Please upload an audio file (MP3 or WAV)")
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleVoiceMessage = (voiceText: string) => {
    if (!voiceText.trim()) return

    // Add user message with transcribed text
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: "user",
      text: voiceText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setTranscribedText("")
    generateAIResponse(voiceText)
  }

  const generateAIResponse = async (userText: string) => {
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get conversation history for context
    const conversationHistory = messages.map((m) => m.text)
    const emotionalTone = detectEmotionalTone(userText)

    // Use the advanced response engine
    const responseText = getDetailedResponse(userText, emotionalTone, 25, conversationHistory)

    const aiMessage: VoiceMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      text: responseText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsProcessing(false)

    // Auto-play AI response
    playAIResponse(responseText)
  }

  const playAIResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 1

      // Use a female voice if available for comfort
      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find((voice) => voice.name.includes("Female") || voice.name.includes("woman"))
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      console.log("[v0] Playing AI response:", text)
      speechSynthesis.speak(utterance)
    }
  }

  const handleTextSubmit = () => {
    if (!userInput.trim()) return
    handleVoiceMessage(userInput)
    setUserInput("")
  }

  const activateVoiceChat = () => {
    if (!voiceFile || !friendName.trim()) {
      alert("Please provide both a voice sample and a friend name first")
      return
    }
    setVoiceChatActive(true)
  }

  if (voiceChatActive) {
    return (
      <div className="space-y-4 flex flex-col h-full">
        <Card className="p-4 border-0 shadow-sm bg-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Voice Chat with {friendName}</h2>
              <p className="text-sm text-muted-foreground">Speak naturally - AI responds in real-time with audio</p>
            </div>
            <Button variant="outline" onClick={() => setVoiceChatActive(false)} className="rounded-lg">
              Exit Chat
            </Button>
          </div>
        </Card>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-secondary/5 rounded-lg">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <Mic className="w-8 h-8 text-accent" />
              <p className="text-muted-foreground">Start speaking or click the mic button to begin your conversation</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-foreground border border-border rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-card text-foreground border border-border px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-accent rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-accent rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input controls */}
        <Card className="p-4 border-0 shadow-sm space-y-3">
          <div className="space-y-2">
            {isListening && (
              <div className="bg-accent/20 border border-accent rounded-lg p-3">
                <p className="text-sm font-medium text-accent mb-1">Listening...</p>
                <p className="text-sm text-foreground">{transcribedText || "Speak now..."}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`flex-1 rounded-lg ${
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-accent hover:bg-accent/90"
              }`}
            >
              {isListening ? (
                <>
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>

            {transcribedText && (
              <Button
                onClick={() => {
                  handleVoiceMessage(transcribedText)
                  setTranscribedText("")
                }}
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}

            {!isListening && (
              <Button
                variant="outline"
                onClick={() =>
                  playAIResponse("Let's continue our conversation. Feel free to share what's on your mind.")
                }
                className="rounded-lg"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder="Or type your message..."
            disabled={isProcessing || isListening}
            className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground"
          />

          {userInput && (
            <Button
              onClick={handleTextSubmit}
              disabled={isProcessing || !userInput.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Speak naturally or type - AI responds with contextual, empathetic support
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Mic className="w-5 h-5 text-accent" />
          Setup Voice Chat
        </h2>
        <p className="text-muted-foreground mb-6">
          Upload a voice sample to personalize your AI companion, then start a voice conversation with real-time audio
          responses.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Friend's Name</label>
            <input
              type="text"
              placeholder="Enter your friend's name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Voice Sample (MP3 or WAV)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition">
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="voice-upload" />
              <label htmlFor="voice-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {voiceFile ? voiceFile.name : "Click to upload voice sample"}
                </span>
                <span className="text-xs text-muted-foreground">or drag and drop</span>
              </label>
            </div>

            {voiceSampleUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">Voice Sample Preview</label>
                <audio controls className="w-full">
                  <source src={voiceSampleUrl} />
                </audio>
              </div>
            )}
          </div>

          {voiceFile && friendName.trim() && (
            <Button
              onClick={activateVoiceChat}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Voice Chat
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm bg-secondary/30">
        <h3 className="font-semibold text-foreground mb-3">How Voice Chat Works</h3>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex gap-2">
            <span className="text-accent font-bold">1.</span>
            <span>Upload a voice sample and enter your friend's name</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">2.</span>
            <span>Click "Start Voice Chat" to begin the conversation</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">3.</span>
            <span>Speak naturally - AI transcribes and responds with context-aware support</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">4.</span>
            <span>AI responses play automatically with empathetic, human-like voice</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
