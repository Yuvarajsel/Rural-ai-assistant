# Rural Clinical AI Assistant

A multimodal AI system for rural healthcare decision support.

## Tech Stack
- **Frontend**: Next.js, TailwindCSS
- **Backend**: FastAPI, Python
- **AI**: PyTorch, Transformers, Qdrant

## Setup Instructions

### Backend
1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   Server runs at `http://localhost:8000`.

### Frontend
1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`.

## Features
- Upload Patient Image (Skin/X-ray)
- Enter Symptoms
- Upload Medical Report (PDF)
- Get Risk Score and Treatment Guidance
