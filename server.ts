import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON payload parsing middleware with sufficient limits for high-resolution images
  app.use(express.json({ limit: "15mb" }));

  // API moves here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/diagnose", async (req, res) => {
    try {
      const { mimeType, base64Data } = req.body;
      if (!mimeType || !base64Data) {
        return res.status(400).json({ error: "Missing image payload or mimeType" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing on the server. Please check Settings > Secrets." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        }
      };

      const textPart = {
        text: "Analyze this agricultural crop sample image. Detect if there are any plant diseases, pests, fungal/bacterial infections, physiological distress, or nutrient deficiencies. Provide an accurate and helpful advisory diagnosis for the farmer."
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING, description: "The identified crop category (e.g. Tomato, Paddy, Coconut, Areca nut)" },
              diagnosis: { type: Type.STRING, description: "Identified pathology, disease name, nutrient deficiency, or issue (e.g. Leaf Blast, Bud Rot, Early Blight)" },
              severity: { type: Type.STRING, description: "Severity grading (Low, Medium, or High)" },
              confidence: { type: Type.NUMBER, description: "Confidence percentage score from 1 to 100" },
              shortExplanation: { type: Type.STRING, description: "Brief visual explanation of the damage/signs detected (1-2 sentences)" },
              symptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of visual symptoms detected on this leaf/part" },
              immediateActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step immediate curative or corrective actions" },
              preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Long term agricultural preventive steps" },
              kannadaSummary: { type: Type.STRING, description: "A simple, comforting 1-2 sentence diagnostic summary in Kannada script so local farmers can read what they need to do" }
            },
            required: ["cropName", "diagnosis", "severity", "confidence", "shortExplanation", "symptoms", "immediateActions", "preventiveMeasures", "kannadaSummary"]
          }
        }
      });

      const textOutput = response.text || "{}";
      const diagnosticResult = JSON.parse(textOutput);
      res.json(diagnosticResult);
    } catch (err: any) {
      console.error("Diagnosis endpoint failed:", err);
      res.status(500).json({ error: err.message || "Failed to analyze crop sample" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
