---
title: AiThena Project Overview
type: note
permalink: projects-ai-thena-project-overview
tags:
- ai
- study-copilot
- gemini
- nextjs
- document-intelligence
---

# AiThena - AI Powered Study Copilot

## Project Structure
- **Frontend**: Next.js app running on localhost:3000
- **Backend**: Node.js/Express with Gemini 2.5 Pro on localhost:4001
- **DocIntel-Backend**: Separate backend for Document Intelligence with Docker/Qdrant

## Key Technologies
- **AI Model**: gemini-2.5-pro (default), gemini-2.5-flash-lite for fast responses
- **Backend**: Express, @google/generative-ai
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Document Processing**: pdf-parse, tesseract.js, @langchain/textsplitters
- **Vector Storage**: Qdrant via Docker
- **Embeddings**: transformers.js (Xenova/bge-small-en-v1.5)

## Current Status
- AI Assistant tool working (localhost:3000/dashboard/ai-assistant ↔ localhost:4001)
- Document Intelligence frontend exists but needs backend integration
- DocIntel-Backend partially implemented with Docker setup

## Gemini 2.5 Implementation Notes
- Uses thinkingConfig with thinkingBudget: 0 for lower latency
- Version-aware logic for 2.5 models vs non-2.5 models
- Fallback text extraction via candidates.parts if response.text() fails