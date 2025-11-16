from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import cv2
# backend/server.py
from .stress_detector import EnhancedStressDetector, CAMERA_INDEX

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS from your frontend
origins = [
    "http://localhost:3000",  # frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = EnhancedStressDetector()
cap = cv2.VideoCapture(CAMERA_INDEX)

def gen_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
        detector.process_frame(frame.copy())
        # Draw stress score overlay
        cv2.putText(frame, f"Stress: {detector.stress_score:.1f}", (20,50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(gen_frames(), media_type="multipart/x-mixed-replace; boundary=frame")
