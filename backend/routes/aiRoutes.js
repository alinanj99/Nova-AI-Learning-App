import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/explain", async (req, res) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `Explain this astronomy information in simple English: ${req.body.explanation}`,
  });

  res.json({
    explanation: response.text,
  });
});

router.post("/quiz", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Create one simple multiple-choice astronomy question based on this information:

${req.body.explanation}`,

      config: {
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          properties: {
            question: {
              type: "string",
            },
            options: {
              type: "array",
              items: {
                type: "string",
              },
            },
            answer: {
              type: "string",
            },
          },
          required: ["question", "options", "answer"],
        },
      },
    });

    const quiz = JSON.parse(response.text);

    res.json(quiz);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Quiz generation failed",
    });
  }
});

export default router;