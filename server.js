import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "@xenova/transformers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

let gen = null;

async function loadModel() {
    console.log("Loading model pipeline (may download model files)...");
    // This uses Xenova's transformers pipeline which will download model assets on first run.
    gen = await pipeline("text-generation", "Xenova/gpt2");
    console.log("Model loaded.");
}

// Start loading model immediately (Render will run this on startup).
loadModel().catch(err => {
    console.error("Failed to load model on startup:", err);
});

app.post("/chat", async (req, res) => {
    try {
        if (!gen) {
            return res.json({ reply: "Model is still loading, please retry in a few seconds." });
        }
        const message = req.body.message || "";
        const prompt = `User: ${message}\nAssistant:`;
        const out = await gen(prompt, { max_new_tokens: 128, do_sample: true, temperature: 0.7 });
        // out is an array; join text parts
        const text = Array.isArray(out) ? out[0].generated_text : (out.generated_text || "");
        // Trim to reasonable length
        const reply = text.replace(prompt, "").trim();
        res.json({ reply });
    } catch (err) {
        console.error("Chat error:", err);
        res.json({ reply: "Error: " + (err.message || String(err)) });
    }
});

// Simple health
app.get("/health", (req, res) => res.send("ok"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server listening on port", PORT));
