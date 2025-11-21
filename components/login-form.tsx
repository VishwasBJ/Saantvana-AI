"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import LogoIcon from "./logo-icon"
import GradientPicker from "@/components/gradient-picker"
import WaveBackground from "@/components/wave-background"

interface LoginFormProps {
  onLogin: (user: {
    name: string
    email: string
    phone: string
    age: number
    pronouns?: string
    guardianName?: string
    guardianPhone?: string
    trustedContact?: string
  }) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [step, setStep] = useState<"login" | "age" | "details">("login")
  const [isMinor, setIsMinor] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    pronouns: "He/Him",
    guardianName: "",
    guardianPhone: "",
    guardianConsent: false,
    trustedContact: "",
  })

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.phone) {
      setStep("age")
    }
  }

  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const age = Number.parseInt(formData.age)
    if (age >= 13) {
      if (age < 18) {
        setIsMinor(true)
        setStep("details")
      } else {
        setStep("details")
      }
    }
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isMinor && formData.trustedContact && formData.phone === formData.trustedContact) {
      setPhoneError("Trusted contact number must be different from your contact number. Please enter another number.")
      return
    }

    if (isMinor && !formData.guardianConsent) {
      alert("Parent/Guardian consent is required for minors")
      return
    }

    const userData = {
      ...formData,
      age: Number.parseInt(formData.age),
    }
    localStorage.setItem("user", JSON.stringify(userData))
    onLogin(userData)
  }

  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      {/* Smooth Flowing Wave Background */}
      <WaveBackground />

      <GradientPicker />
      
      {/* Main Content Container */}
      <div className="min-h-screen flex items-center justify-between px-8 md:px-16 lg:px-24 relative z-10">
        {/* Left Side - Hero Text */}
        <div className="flex-1 max-w-2xl pr-8 hidden lg:block">
          <h1 className="text-7xl font-black mb-4 leading-[1.1] hero-text-outline">
            <span className="tracking-tight">YOUR JOURNEY TO</span>
            <br />
            <span className="hero-text-filled">MENTAL WELLNESS</span>
          </h1>
          <p className="text-2xl text-white/95 mb-10 leading-relaxed font-light">
            A safe space for your thoughts, powered by AI to support your emotional well-being.
          </p>
          
          {/* CTA Button */}
          <Button 
            onClick={() => document.querySelector('input')?.focus()}
            className="gradient-primary hover:opacity-90 text-white rounded-xl h-14 px-8 font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all mb-8 group"
          >
            Start Your Wellness Journey
            <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Button>
          
          <div className="flex gap-5 mt-8">
            <div className="feature-badge flex items-center gap-2">
              <LogoIcon size={20} /> AI-Powered Support
            </div>
            <div className="feature-badge">
              🔒 Private & Secure
            </div>
          </div>
        </div>

        {/* Right Side - Form Card */}
        <div className="w-full lg:w-auto lg:min-w-[480px]">
          <Card className="blended-card">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <LogoIcon size={80} />
              </div>
              <h2 className="text-4xl font-black gradient-primary-text mb-2 tracking-tight">CALM MIND</h2>
              <p className="text-muted-foreground font-light">Your AI companion for mental wellness</p>
            </div>

            {step === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="blended-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="blended-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Contact Number</label>
                <Input
                  type="tel"
                  placeholder="Enter your contact number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="blended-input"
                  required
                />
              </div>
              <Button
                type="submit"
                className="blended-button"
              >
                Continue
              </Button>
          </form>
        ) : step === "age" ? (
          <form onSubmit={handleAgeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Your Age</label>
              <Input
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="bg-secondary/20 border-secondary/30 rounded-xl"
                min="13"
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                We personalize recommendations based on your age group
              </p>
            </div>
            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full gradient-primary hover:opacity-90 text-white rounded-xl h-11 font-semibold"
              >
                Continue
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl bg-transparent"
                onClick={() => setStep("login")}
              >
                Back
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Your Pronouns (Optional)</label>
              <RadioGroup
                value={formData.pronouns}
                onValueChange={(val) => setFormData({ ...formData, pronouns: val })}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="He/Him" id="he" />
                  <Label htmlFor="he" className="cursor-pointer">
                    He/Him
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="She/Her" id="she" />
                  <Label htmlFor="she" className="cursor-pointer">
                    She/Her
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="They/Them" id="they" />
                  <Label htmlFor="they" className="cursor-pointer">
                    They/Them
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Prefer not to say" id="prefer" />
                  <Label htmlFor="prefer" className="cursor-pointer">
                    Prefer not to say
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {isMinor && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900 mb-3">Parent/Guardian Information</p>
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Parent/Guardian Name"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    className="bg-white border-yellow-200 rounded-lg"
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Parent/Guardian Phone"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="bg-white border-yellow-200 rounded-lg"
                    required
                  />
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={formData.guardianConsent}
                      onChange={(e) => setFormData({ ...formData, guardianConsent: e.target.checked })}
                    />
                    <Label htmlFor="consent" className="text-xs cursor-pointer leading-relaxed">
                      My parent/guardian is aware I'm seeking mental health support
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {!isMinor && Number.parseInt(formData.age) >= 18 && (
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Trusted Contact (Optional)</label>
                <Input
                  type="tel"
                  placeholder="Alternative contact number for emergencies"
                  value={formData.trustedContact}
                  onChange={(e) => {
                    setFormData({ ...formData, trustedContact: e.target.value })
                    setPhoneError("")
                  }}
                  className={`bg-secondary/20 border-secondary/30 rounded-xl ${phoneError ? "border-red-500 border-2" : ""}`}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Someone we can contact in case of crisis (with your consent)
                </p>
                {phoneError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{phoneError}</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full gradient-primary hover:opacity-90 text-white rounded-xl h-11 font-semibold"
              >
                Get Started
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl bg-transparent"
                onClick={() => {
                  setStep("age")
                  setIsMinor(false)
                  setPhoneError("")
                }}
              >
                Back
              </Button>
            </div>
          </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
