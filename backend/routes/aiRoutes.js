import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// AI Explain
router.post("/explain", async (req, res) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `Explain this astronomy information in simple English: ${req.body.explanation}`,
  });

  res.json({
    explanation: response.text,
  });
});

// AI Quiz
router.post("/quiz", async (req, res) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `
Create one simple multiple-choice question based on this astronomy information:
${req.body.explanation}

Return only JSON:
{
  "question": "question",
  "options": ["option 1", "option 2", "option 3", "option 4"],
  "answer": "correct option"
}
`,
  });

  const text = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  res.json(JSON.parse(text));
});

export default router;