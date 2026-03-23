import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "@gradio/client";

dotenv.config();
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

let client; // cache the client

app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ reply: "Message is required" });

  try {
    if (!client) {
      client = await Client.connect("HariniRR/kodaiwork", {
        hf_token: process.env.HF_TOKEN, // optional, required if private
      });
    }

    // call predict exactly like the official client snippet
    const result = await client.predict("/predict", { text: message });

    // Gradio returns result.data
    res.json({ reply: result.data });
  } catch (err) {
    console.error("Error calling Hugging Face Space:", err);
    res.status(500).json({ reply: "⚠️ Error connecting to backend" });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));