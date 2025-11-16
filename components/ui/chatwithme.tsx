"use client"

import { useState } from "react"
import { Button } from "./button"  // <-- FIXED PATH


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
    </div>
  )
}
