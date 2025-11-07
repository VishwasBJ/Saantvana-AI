"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [user, setUser] = useState(null)

  return (
    <main className="min-h-screen bg-background">
      {!user ? <LoginForm onLogin={setUser} /> : <Dashboard user={user} onLogout={() => setUser(null)} />}
    </main>
  )
}
