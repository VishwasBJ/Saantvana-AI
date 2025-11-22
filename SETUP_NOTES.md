# Setup Notes

## Frontend Setup ✅
- Node.js dependencies installed successfully with `npm install --legacy-peer-deps`
- React 19 requires legacy peer deps flag due to vaul package compatibility

## Backend Setup ⚠️
- Python backend requires TensorFlow for DeepFace emotion detection
- **Issue**: TensorFlow is not yet available for Python 3.14
- **Workaround Options**:
  1. Use Python 3.11 or 3.12 for the backend
  2. Run frontend only (backend features will be unavailable)
  3. Wait for TensorFlow Python 3.14 support

## Running the Project

### Frontend Only (Recommended for now)
```bash
npm run dev
```
This will start the Next.js development server on http://localhost:3000

### Backend (Requires Python 3.11/3.12)
If you have Python 3.11 or 3.12 available:
```bash
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run backend
cd backend
uvicorn server:app --reload --port 8000
```

## Dependencies

### Frontend
- Next.js 16.0.0
- React 19.2.0
- Radix UI components
- Tailwind CSS 4.1.9
- TypeScript 5

### Backend
- FastAPI
- OpenCV
- DeepFace (emotion detection)
- TensorFlow (requires Python ≤3.12)
