# Online AI Chat (No API Key) — GPT-2 (Xenova)

## Overview
This project is a self-contained Node.js web app that runs a small language model (Xenova/gpt2) on the server using `@xenova/transformers`. No external API key is required.

## Included
- `server.js` — Node.js server that hosts the model and handles chat requests
- `public/` — Front-end chat UI
- `package.json` — Dependencies and start script
- `render.yaml` — Optional: use to deploy to Render.com
- `README.md` — This file

## How to run locally
1. `npm install`
2. `node server.js`
3. Visit `http://localhost:3000` in your browser.
The first start may download model weights and can take 30–120 seconds depending on network and CPU.

## Deploy to Render
1. Push this repo to GitHub.
2. Create a new Web Service on Render and connect the repo.
3. Use the provided `render.yaml` or set build/start commands:
   - Build command: `npm install`
   - Start command: `node server.js`

## Notes & Tips
- The `@xenova/transformers` library will download model files from the internet during the first run. Ensure Render allows outbound downloads.
- GPT-2 is lightweight and recommended for free-tier hosting.
- If you want better quality later, swap `"Xenova/gpt2"` in `server.js` with a different model ID (e.g., `Xenova/distilgpt2`).
