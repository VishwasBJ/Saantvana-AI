"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Phone, MapPin } from "lucide-react"

const CRISIS_RESOURCES = {
  us: [
    {
      name: "988 Suicide & Crisis Lifeline",
      description: "Free, confidential support 24/7",
      phone: "988 or 1-800-273-8255",
      web: "988lifeline.org",
      type: "Hotline",
    },
    {
      name: "Crisis Text Line",
      description: "Text HOME to 741741",
      phone: "Text-based",
      web: "crisistextline.org",
      type: "Text",
    },
  ],
  uk: [
    {
      name: "Samaritans",
      description: "Support for anyone in distress",
      phone: "116 123",
      web: "samaritans.org",
      type: "Hotline",
    },
    {
      name: "Mind Crisis Support",
      description: "Information and support",
      phone: "0300 123 3393",
      web: "mind.org.uk",
      type: "Hotline",
    },
  ],
  india: [
    {
      name: "iCall Mental Health",
      description: "Helpline for emotional support",
      phone: "9152987821",
      web: "icallhelpline.org",
      type: "Hotline",
    },
    {
      name: "Vandrevala Foundation",
      description: "24-hour emotional support",
      phone: "9999 77 6555",
      web: "vandrevalafoundation.org",
      type: "Hotline",
    },
  ],
}

export default function CrisisResources() {
  return (
    <div className="space-y-6">
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          If you're in immediate danger, call emergency services (911 in US, 999 in UK, 112 in India)
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Crisis Support Resources</h2>

        <div className="grid gap-4">
          {/* United States Resources */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">United States</h3>
            </div>
            <div className="space-y-3">
              {CRISIS_RESOURCES.us.map((resource, idx) => (
                <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{resource.name}</p>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Phone className="w-3 h-3" />
                      {resource.phone}
                    </Button>
                    <Button variant="outline" size="sm">
                      Visit Website
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* United Kingdom Resources */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">United Kingdom</h3>
            </div>
            <div className="space-y-3">
              {CRISIS_RESOURCES.uk.map((resource, idx) => (
                <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{resource.name}</p>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Phone className="w-3 h-3" />
                      {resource.phone}
                    </Button>
                    <Button variant="outline" size="sm">
                      Visit Website
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* India Resources */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">India</h3>
            </div>
            <div className="space-y-3">
              {CRISIS_RESOURCES.india.map((resource, idx) => (
                <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{resource.name}</p>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Phone className="w-3 h-3" />
                      {resource.phone}
                    </Button>
                    <Button variant="outline" size="sm">
                      Visit Website
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200 space-y-2">
        <p className="text-sm font-medium text-foreground">Remember:</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>You are not alone in what you're experiencing</li>
          <li>Asking for help is a sign of strength</li>
          <li>There are people trained to listen and help</li>
          <li>These feelings can improve with proper support</li>
        </ul>
      </Card>
    </div>
  )
}
