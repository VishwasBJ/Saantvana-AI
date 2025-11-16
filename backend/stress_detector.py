"""Enhanced Real-time Video Stress Detection System - API-ready version"""

import cv2
from deepface import DeepFace
import numpy as np
from collections import deque, defaultdict
import time
import os
from datetime import datetime
import json

# ------------------ Constants ------------------
STRESS_EMOTIONS = ["angry", "fear", "sad"]
ALL_EMOTIONS = ["angry", "fear", "sad", "happy", "neutral", "surprise", "disgust"]
STRESS_THRESHOLD_HIGH = 60
STRESS_THRESHOLD_MEDIUM = 40
COLOR_HIGH_STRESS = (0,0,255)
COLOR_MEDIUM_STRESS = (0,255,255)
COLOR_LOW_STRESS = (0,255,0)
COLOR_WHITE = (255,255,255)
COLOR_STRESS_TEXT = (0,0,255)
COLOR_POSITIVE_TEXT = (100,255,100)
BREATHING_TRIGGER_STRESS = 70
SESSION_SAVE_PATH = "stress_sessions/"
CAMERA_INDEX = 0

# ------------------ Classes ------------------
class EmotionTracker:
    """Track emotion durations."""
    def __init__(self):
        self.emotion_durations = defaultdict(float)
        self.last_emotion = None
        self.last_update = time.time()
        self.dominant_emotion = 'neutral'
        
    def update(self, emotions):
        current_time = time.time()
        self.dominant_emotion = max(emotions.items(), key=lambda x: x[1])[0]
        if self.last_update:
            duration = current_time - self.last_update
            self.emotion_durations[self.dominant_emotion] += duration
        self.last_emotion = self.dominant_emotion
        self.last_update = current_time
    
    def get_report(self):
        total_time = sum(self.emotion_durations.values())
        if total_time == 0:
            return {}
        report = {}
        for emotion, duration in self.emotion_durations.items():
            percentage = (duration / total_time) * 100
            mins, secs = divmod(int(duration), 60)
            report[emotion] = {
                'duration': duration,
                'percentage': percentage,
                'time_str': f"{mins}m {secs}s"
            }
        return report

class BreathingGuide:
    """Breathing exercise guide."""
    def __init__(self):
        self.active = False
        self.phase = 'inhale'
        self.phase_start = None
    
    def start(self):
        self.active = True
        self.phase_start = time.time()
        self.phase = 'inhale'
    
    def stop(self):
        self.active = False

    def update(self):
        if not self.active:
            return
        elapsed = time.time() - self.phase_start
        if self.phase == 'inhale' and elapsed >= 4:
            self.phase = 'hold'
            self.phase_start = time.time()
        elif self.phase == 'hold' and elapsed >= 2:
            self.phase = 'exhale'
            self.phase_start = time.time()
        elif self.phase == 'exhale' and elapsed >= 6:
            self.phase = 'inhale'
            self.phase_start = time.time()

class StressAnalytics:
    """Track stress spikes and high-stress durations."""
    def __init__(self):
        self.stress_spikes = []
        self.high_stress_start = None
        self.session_start = time.time()
        self.last_report_time = time.time()
        self.report_interval = 1800  # 30 min
        
    def detect_spike(self, current_stress, previous_stress):
        if current_stress - previous_stress >= 25:
            spike_time = time.time()
            if not self.stress_spikes or spike_time - self.stress_spikes[-1] > 30:
                self.stress_spikes.append(spike_time)
                return True
        return False
    
    def update_high_stress_duration(self, is_high_stress):
        if is_high_stress:
            if self.high_stress_start is None:
                self.high_stress_start = time.time()
        else:
            self.high_stress_start = None
    
    def get_high_stress_duration(self):
        if self.high_stress_start:
            return time.time() - self.high_stress_start
        return 0
    
    def should_generate_report(self):
        return (time.time() - self.last_report_time) >= self.report_interval

class EnhancedStressDetector:
    """API-ready stress detector."""
    def __init__(self):
        self.stress_history = deque(maxlen=100)
        self.emotion_history = deque(maxlen=10)
        self.current_emotions = {}
        self.stress_score = 0
        self.breathing_guide = BreathingGuide()
        self.analytics = StressAnalytics()
        self.emotion_tracker = EmotionTracker()
        self.previous_stress = 0
        if not os.path.exists(SESSION_SAVE_PATH):
            os.makedirs(SESSION_SAVE_PATH)
    
    def calculate_stress_score(self, emotions):
        return sum(emotions.get(e,0) for e in STRESS_EMOTIONS)
    
    def get_smoothed_emotions(self, emotions):
        self.emotion_history.append(emotions)
        if len(self.emotion_history) < 3:
            return emotions
        smoothed = {}
        for emotion in ALL_EMOTIONS:
            values = [e.get(emotion,0) for e in self.emotion_history]
            smoothed[emotion] = np.mean(values)
        return smoothed
    
    def process_frame(self, frame):
        try:
            result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            if isinstance(result, list):
                result = result[0]
            raw_emotions = result['emotion']
            self.current_emotions = self.get_smoothed_emotions(raw_emotions)
            self.emotion_tracker.update(self.current_emotions)
            self.previous_stress = self.stress_score
            self.stress_score = self.calculate_stress_score(self.current_emotions)
            self.stress_history.append(self.stress_score)
            self.analytics.detect_spike(self.stress_score, self.previous_stress)
            is_high = self.stress_score >= STRESS_THRESHOLD_HIGH
            self.analytics.update_high_stress_duration(is_high)
            if self.stress_score >= BREATHING_TRIGGER_STRESS and not self.breathing_guide.active:
                self.breathing_guide.start()
            elif self.stress_score < STRESS_THRESHOLD_MEDIUM and self.breathing_guide.active:
                self.breathing_guide.stop()
        except:
            pass
