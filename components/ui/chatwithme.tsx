"use client"

import { useState } from "react"
import { Button } from "./button"
import { Card } from "./card"
import { Alert, AlertDescription } from "./alert"
import { AlertTriangle, Phone, MapPin } from "lucide-react"

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

export default function ChatWithMe({ age }: { age: number }) {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, input])
    setInput("")
  }

  return (
    <div className="space-y-8">
      {/* Crisis Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          If you're in immediate danger, call emergency services (911 in US, 999 in UK, 112 in India)
        </AlertDescription>
      </Alert>
      
      {/* VIDEO CHAT SECTION */}
      <div className="border rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-3">Video Chat</h2>
        <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-white">
          <p>Video feed placeholder</p>
        </div>
        <div className="mt-4 flex gap-3">
          <Button>Start Video</Button>
          <Button variant="destructive">End Call</Button>
        </div>
      </div>

      {/* AUDIO CHAT SECTION */}
      <div className="border rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-3">Audio Chat</h2>
        <div className="flex gap-3">
          <Button>Start Recording</Button>
          <Button variant="outline">Stop</Button>
        </div>
      </div>

      {/* TEXT CHAT SECTION */}
      <div className="border rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-3">Text Chat</h2>

        <div className="h-60 overflow-auto border rounded p-3 bg-muted">
          {messages.map((msg, i) => (
            <p key={i} className="my-1 p-2 bg-background rounded-lg shadow">
              {msg}
            </p>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Type your message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>

      {/* Crisis Help Resources */}
      <Card className="p-6 border-0 shadow-sm bg-red-50/50">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Crisis Support Resources
        </h2>

        {/* India Resources */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">India</h3>
          </div>
          <div className="space-y-3">
            {CRISIS_RESOURCES.india.map((resource, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div>
                  <p className="font-semibold text-foreground">{resource.name}</p>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Phone className="w-3 h-3" />
                  {resource.phone}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* US Resources */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">United States</h3>
          </div>
          <div className="space-y-3">
            {CRISIS_RESOURCES.us.map((resource, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div>
                  <p className="font-semibold text-foreground">{resource.name}</p>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Phone className="w-3 h-3" />
                  {resource.phone}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm font-semibold text-foreground mb-2">Remember:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>You are not alone in what you're experiencing</li>
            <li>Asking for help is a sign of strength</li>
            <li>There are people trained to listen and help</li>
            <li>These feelings can improve with proper support</li>
          </ul>
        </Card>
      </Card>
    </div>
  )
}
