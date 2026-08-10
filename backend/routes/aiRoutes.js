import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// AI Explain
router.post("/explain", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Explain this astronomy information in simple English: ${req.body.explanation}`,
    });

    res.json({
      explanation: response.text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "AI explanation failed",
    });
  }
});

// AI Quiz
router.post("/quiz", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `
Create one simple multiple-choice question based on this astronomy information:

${req.body.explanation}

Return exactly:
{
  "question": "question here",
  "options": ["option 1", "option 2", "option 3", "option 4"],
  "answer": "correct option"
}
`,

      config: {
        responseMimeType: "application/json",
      },
    });

    const quiz = JSON.parse(response.text);

    res.json(quiz);
  } catch (error) {
    console.log("QUIZ ERROR:", error);

    res.status(500).json({
      message: "Quiz generation failed",
    });
  }
});

export default router;