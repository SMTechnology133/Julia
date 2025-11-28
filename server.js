import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // only if Node <18
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const HF_MODEL_URL = "microsoft/DialoGPT-medium/models/facebook/blenderbot-400M-distill";

app.post("/chat", async (req, res) => {
    try {
        const userMsg = req.body.message || "";

        const hfRes = await fetch(HF_MODEL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: userMsg })
        });

        const text = await hfRes.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Non-JSON response from HuggingFace:", text);
            return res.status(502).json({ reply: "Bad response from HuggingFace model." });
        }

        let reply = "No response from model.";
        if (typeof data === "string") reply = data;
        else if (data.generated_text) reply = data.generated_text;
        else if (Array.isArray(data) && data[0] && data[0].generated_text) reply = data[0].generated_text;
        else if (data.error) reply = "Model error: " + data.error;

        return res.json({ reply });

    } catch (err) {
        console.error("Chat route error:", err);
        return res.status(500).json({ reply: "Server error: " + (err.message || "unknown") });
    }
});

app.get("/health", (req, res) => res.send("ok"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));