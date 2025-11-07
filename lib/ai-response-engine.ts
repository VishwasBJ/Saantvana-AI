interface ConversationContext {
  userAge: number
  selectedCategories: string[]
  previousMessages: string[]
  emotionalTone: string
}

const EMOTIONAL_KEYWORDS = {
  stress: ["stress", "pressure", "overwhelmed", "anxious", "tense", "frustrated"],
  sadness: ["sad", "depressed", "hopeless", "down", "miserable", "unhappy"],
  loneliness: ["alone", "lonely", "isolated", "disconnected", "abandoned"],
  anger: ["angry", "furious", "mad", "rage", "upset"],
  joy: ["happy", "joyful", "excited", "grateful", "grateful", "blessed"],
  anxiety: ["anxious", "worried", "nervous", "scared", "afraid", "panic"],
}

function detectEmotionalTone(message: string): string {
  const lower = message.toLowerCase()
  for (const [tone, keywords] of Object.entries(EMOTIONAL_KEYWORDS)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return tone
    }
  }
  return "neutral"
}

function getDetailedResponse(userMessage: string, tone: string, age: number, conversationHistory: string[]): string {
  const messageLength = userMessage.length
  const wordCount = userMessage.split(" ").length
  const isQuestion = userMessage.includes("?")
  const messageNumber = conversationHistory.length

  // Build response based on emotional tone and age
  const responses: Record<string, Record<string, string[]>> = {
    stress: {
      teen: [
        "School, friends, and family expectations can create a lot of pressure. It's great that you're aware of your stress. What's the biggest contributor right now?",
        "That sounds overwhelming. Many teens feel this way when juggling multiple responsibilities. What would help you feel more in control?",
        "Stress at your age is real and valid. Can you pinpoint one thing that, if resolved, would relieve most of the pressure?",
        "I hear the weight in what you're saying. Let's tackle this step by step. What's your biggest worry right now?",
        "Feeling stressed is your body telling you something needs attention. What's demanding your time and energy most?",
      ],
      young_adult: [
        "The transition to adulthood brings unique stressors - career, independence, relationships. What's weighing on you?",
        "It's common to feel pressure at this life stage. Are you stressed about multiple areas, or is one thing dominating?",
        "Career and personal pressures can build up quickly. What's the primary source of your stress right now?",
        "Many young adults feel this exact way when facing big life decisions. What aspect feels most stressful?",
        "Your stress signals that something important needs your attention. Let's identify the core issue.",
      ],
      adult: [
        "Balancing work, family, and personal needs is challenging. Where is most of your stress coming from?",
        "Many adults in your situation experience similar pressure. What's the tipping point for you right now?",
        "It sounds like you're managing a lot. What would make the biggest difference in reducing your stress?",
        "The demands on adults are real and complex. Which area feels most pressing for you?",
        "Recognizing stress is the first step. What specific situation is causing the most tension?",
      ],
      senior: [
        "Life at every stage brings challenges. What's been creating this stress for you?",
        "Your concerns are important. Let's explore what's causing you the most worry right now.",
        "Many people in your age group face these pressures. What's your biggest concern?",
        "Understanding what's stressing you helps us find solutions. What would help ease your mind?",
        "I'm here to listen and help. What's been weighing on you?",
      ],
    },
    sadness: {
      teen: [
        "Feeling down is something many teens experience, but it's important not to go through it alone. What triggered these feelings?",
        "Depression and sadness at your age can feel especially isolating. Have you talked to anyone you trust about this?",
        "Your feelings matter, and they're worth addressing. How long have you been feeling this way?",
        "It's brave of you to acknowledge these feelings. What's at the root of your sadness?",
        "Sadness can be a signal that something in your life needs to change. What do you think that is?",
      ],
      young_adult: [
        "These feelings are valid, and seeking support is a sign of strength, not weakness. What's contributing to your sadness?",
        "Many young adults struggle with depression. You're not alone in this. What circumstances led to these feelings?",
        "Let's talk about what's making you feel this way. Do you see any specific triggers?",
        "Your emotional well-being is important. What would help lift your mood, even slightly?",
        "Sadness often calls for professional support. Have you considered talking to a therapist?",
      ],
      adult: [
        "Depression in adults is treatable and manageable with the right support. What's your situation like?",
        "Many people your age experience depression. You're not alone. What's been happening?",
        "It takes courage to acknowledge sadness. What would be most helpful for you right now?",
        "Your mental health deserves attention. Have you reached out to anyone about this?",
        "Let's work through this together. What's making you feel this way?",
      ],
      senior: [
        "Depression in later years is treatable. Please know you're not alone in this. What's been troubling you?",
        "Your feelings are valid and understandable. What support would help you most right now?",
        "I'm genuinely here to listen. What's been making you feel so down?",
        "These feelings can improve with support and treatment. What's your main concern?",
        "You deserve to feel better. Let's talk about what's been difficult for you.",
      ],
    },
    loneliness: {
      teen: [
        "Loneliness in your teen years can feel especially painful because you're surrounded by people. What's making you feel isolated?",
        "Not feeling connected to others is a real issue many teens face. Do you have people you feel safe with?",
        "Sometimes being alone feels safer than being misunderstood. What would help you feel more connected?",
        "Your need for meaningful connection is valid. Who would you like to reach out to?",
        "Loneliness often comes with feeling different or misunderstood. Is that what you're experiencing?",
      ],
      young_adult: [
        "Loneliness is surprisingly common in young adulthood despite being constantly connected. What kind of connection are you missing?",
        "It's possible to feel lonely even with lots of friends. What does genuine connection look like to you?",
        "Finding your people takes time. What kind of community or relationships would help you feel less alone?",
        "Isolation can happen when you feel misunderstood by those around you. Is that the case?",
        "You deserve meaningful relationships. What's a first step you could take to build connection?",
      ],
      adult: [
        "Loneliness affects many adults, especially with busy schedules. What would help you feel more connected?",
        "Your need for meaningful relationships is important and valid. What's been preventing connection for you?",
        "Many people feel isolated despite being busy. What kind of support would help?",
        "Building connection takes intentional effort. What's one small way you could reach out?",
        "You're not the only one feeling this way. What kind of relationships would bring you joy?",
      ],
      senior: [
        "Loneliness in later years is common but doesn't have to be permanent. What would help you feel more connected?",
        "Your companionship matters, and there are ways to build meaningful connections. What interests you?",
        "Many people your age experience similar feelings. What kind of support would be most welcome?",
        "You deserve to feel included and valued. What activities bring you joy?",
        "Let's explore ways to increase your connection with others. What sounds appealing to you?",
      ],
    },
    joy: {
      teen: [
        "That's wonderful to hear! Celebrating these moments is important. What's making you feel so good?",
        "I love your positive energy! What can you do to keep this momentum going?",
        "You sound genuinely happy. Let's make sure to hold onto this feeling. What's bringing you joy?",
        "This positive feeling is great! How can you share this with others?",
        "Keep riding this wave of positivity! What else makes you feel this way?",
      ],
      young_adult: [
        "That's fantastic! Celebrating wins is so important at this stage. What should be your next step?",
        "Your positive energy is inspiring. What's been the turning point for you?",
        "This is wonderful progress. How can you maintain this positive trajectory?",
        "You're thriving! What's contributing most to your current happiness?",
        "Keep this momentum going. What's one thing you want to hold onto?",
      ],
      adult: [
        "That's beautiful to hear. Appreciating these positive moments is crucial. What's changed?",
        "Your happiness matters as much as your challenges. How can you protect this good feeling?",
        "Wonderful progress! What decisions or changes led to this positivity?",
        "Keep nurturing what's working. What's bringing the most joy to your life right now?",
        "This is deserved happiness. What can you do to sustain it?",
      ],
      senior: [
        "That brings me joy to hear! Celebrate these moments. What's making life feel good?",
        "Your contentment is beautiful. How can you continue to cultivate this feeling?",
        "This is wonderful. What's been a blessing in your life recently?",
        "Your happiness deserves celebration. What brings you the most peace?",
        "Keep embracing this positivity. What makes you feel most alive?",
      ],
    },
    anxiety: {
      teen: [
        "Anxiety at your age is becoming increasingly common, but it's very manageable. What's triggering your worry?",
        "That anxious feeling can be overwhelming, but it doesn't have to control you. What's the worst-case scenario you're imagining?",
        "Many teens experience anxiety about the future, relationships, or performance. What's your main worry?",
        "Your anxiety is real, but it's often based on fears rather than facts. What would help you feel more grounded?",
        "Let's work through this worry step by step. What specific situation is making you anxious?",
      ],
      young_adult: [
        "Anxiety in young adulthood often relates to uncertainty about the future. What are you most worried about?",
        "It's okay to feel anxious during transitions. What would help you feel more secure right now?",
        "Your anxiety has valuable information for you. What's it trying to tell you?",
        "Many strategies help with anxiety. What coping methods have worked for you in the past?",
        "Let's identify what's within your control and what isn't. What's the core of your worry?",
      ],
      adult: [
        "Anxiety at this stage often involves multiple responsibilities. What's your biggest worry?",
        "It's possible to manage anxiety while still being productive. What's making you feel unsettled?",
        "Your anxiety is a signal worth listening to. What's underneath these worried thoughts?",
        "Many adults benefit from anxiety management techniques. What would help you most?",
        "Let's address what's triggering this anxiety. What specific situation concerns you?",
      ],
      senior: [
        "Anxiety can emerge or intensify in later years for various reasons. What's concerning you?",
        "Your worries are understandable given life's circumstances. What would bring you peace?",
        "Many older adults experience anxiety. You're not alone. What's the main source?",
        "Let's work on calming these anxious thoughts. What would help you feel more secure?",
        "Your concerns matter and are addressable. What's been worrying you?",
      ],
    },
    neutral: {
      teen: [
        "I'm here to listen. What would you like to talk about?",
        "Feel free to share what's on your mind. I'm ready to help.",
        "Thanks for reaching out. What's going on with you?",
        "I'm all ears. What brought you here today?",
        "Let's explore what you're thinking about. What matters to you right now?",
      ],
      young_adult: [
        "What's on your mind? I'm here to discuss anything you'd like.",
        "Feel free to share. What can I help you with?",
        "I'm listening. What would be most helpful to talk about?",
        "Let's dive in. What's important to you right now?",
        "I'm ready to help. What brings you here today?",
      ],
      adult: [
        "What's happening in your life right now?",
        "I'm here to help. What would be most valuable to discuss?",
        "Feel free to share what's on your mind.",
        "Let's talk about what matters to you.",
        "I'm listening and ready to help.",
      ],
      senior: [
        "What would you like to talk about today?",
        "I'm here to listen. Please share what's on your mind.",
        "Tell me what's important to you.",
        "I'm ready to help. What brings you here?",
        "Feel free to share anything you'd like.",
      ],
    },
  }

  // Get age group
  let ageGroup = "teen"
  if (age > 18 && age <= 25) ageGroup = "young_adult"
  else if (age > 25 && age <= 50) ageGroup = "adult"
  else if (age > 50) ageGroup = "senior"

  // Ensure we have responses for this tone
  const toneResponses = responses[tone as keyof typeof responses] || responses.neutral

  // Select response based on message number to ensure variation
  const availableResponses = toneResponses[ageGroup] || toneResponses.teen
  const responseIndex = (messageNumber % availableResponses.length) + (isQuestion ? 1 : 0)
  return availableResponses[responseIndex % availableResponses.length]
}

export { getDetailedResponse, detectEmotionalTone }
