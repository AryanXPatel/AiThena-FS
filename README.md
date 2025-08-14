# AiThena Full Stack Project

AiThena is a comprehensive AI-powered platform featuring document intelligence, flashcard generation, and a modern web interface.

## Project Structure

- **AiThena-Backend**: Core AI backend services
- **AiThena-FrontEnd**: Next.js frontend application  
- **DocIntel-Backend**: Document intelligence and processing service
- **FlashcardStudio-Backend**: Flashcard generation and management service
- **TestPdf**: Test documents and resources

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (for frontend) and npm (for backends)
- Google Gemini API key

### Environment Setup

Each backend service requires environment variables. Copy the `.env.example` files to `.env` and configure:

```bash
# For each backend directory:
cp .env.example .env
# Edit .env with your actual values
```

### Installation & Running

1. **Install dependencies for each service:**
```bash
# Frontend (uses pnpm)
cd AiThena-FrontEnd && pnpm install

# Each backend service (uses npm)
cd AiThena-Backend && npm install
cd DocIntel-Backend && npm install  
cd FlashcardStudio-Backend && npm install
```

2. **Start services:**
```bash
# Start each service in separate terminals
cd AiThena-Backend && npm run dev
cd DocIntel-Backend && npm run dev
cd FlashcardStudio-Backend && npm run dev
cd AiThena-FrontEnd && pnpm dev
```

## API Keys

This project requires Google Gemini API keys. Get yours at [Google AI Studio](https://aistudio.google.com/).

⚠️ **Security**: Never commit API keys to version control. Use `.env` files (which are gitignored).

## Development

- Frontend runs on: http://localhost:3000
- AiThena-Backend: http://localhost:4001
- DocIntel-Backend: http://localhost:4101  
- FlashcardStudio-Backend: http://localhost:4201

## License

ISC
