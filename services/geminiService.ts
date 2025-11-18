import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PostureAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A numerical score from 0 to 100 representing posture quality. 100 is perfect ergonomic posture.",
    },
    status: {
      type: Type.STRING,
      enum: ["Excellent", "Good", "Fair", "Poor", "Unknown"],
      description: "Categorical status of the posture.",
    },
    issues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific detected issues (e.g., 'Head forward', 'Shoulders slumped', 'Screen too low').",
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable advice to correct the detected issues (e.g., 'Raise your monitor', 'Pull shoulders back').",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, encouraging summary of the analysis.",
    },
  },
  required: ["score", "status", "issues", "recommendations", "summary"],
};

export const analyzePostureImage = async (base64Image: string): Promise<PostureAnalysis> => {
  try {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          {
            text: `Analyze this image of a person sitting at a desk or computer. 
                   Evaluate their ergonomics and posture. 
                   Look for: Head position, neck angle, shoulder position, back straightness, and distance from screen.
                   If no person is clearly visible, set status to 'Unknown' and score to 0.
                   Provide actionable, specific feedback in JSON format.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as PostureAnalysis;
    return data;

  } catch (error) {
    console.error("Error analyzing posture:", error);
    throw error;
  }
};