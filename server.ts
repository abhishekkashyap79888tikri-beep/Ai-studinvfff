import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 30mb limit for high-res room photos
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

/**
 * Clean base64 string helper
 */
function cleanBase64(dataUriOrRaw: string): { data: string; mimeType: string } {
  if (!dataUriOrRaw) return { data: "", mimeType: "image/jpeg" };
  const matches = dataUriOrRaw.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (matches) {
    return { mimeType: matches[1], data: matches[2] };
  }
  return { data: dataUriOrRaw, mimeType: "image/jpeg" };
}

/**
 * Generate Room Makeover & Design Analysis
 */
app.post("/api/makeover", async (req, res) => {
  try {
    const { imageBase64, styleName, styleDescription, customPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const { data: cleanData, mimeType } = cleanBase64(imageBase64);
    const ai = getGeminiClient();

    // 1. Generate visual image transformation with Gemini image model
    let generatedImageUrl: string | null = null;
    let visualGenerationAttempted = false;

    try {
      visualGenerationAttempted = true;
      const imagePrompt = `Transform this room into a high-end ${styleName} interior design style. ${styleDescription}. ${customPrompt || ""}. Maintain the architectural layout, windows, floor boundaries, and room geometry, but replace outdated or mismatched furniture, rugs, wall paint, lighting, and decorative accessories with photorealistic, magazine-quality ${styleName} elements. High interior design photography.`;

      // Attempt with gemini-3.1-flash-image
      const imageResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanData,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: imagePrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "4:3",
            imageSize: "1K",
          },
        },
      });

      if (imageResponse.candidates?.[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            generatedImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (imgErr) {
      console.warn("Direct image generation notice (will use structured redesign insights):", imgErr);
    }

    // 2. Generate detailed architectural critique, palette, and shoppable recommendations with gemini-3.8-flash
    const analysisPrompt = `You are a world-class Interior Design Consultant and architectural stylist.
Analyze the user's room and provide a curated makeover plan into the "${styleName}" style.
${styleDescription}
${customPrompt ? `Custom requirement: "${customPrompt}"` : ""}

Provide a comprehensive, high-taste interior design plan including:
1. makeoverSummary: 2-3 sentences explaining the transformative vision and spatial changes.
2. colorPalette: 5 harmonious hex color codes representing wall, textile, wood, and accent finishes.
3. keyModifications: 4 key changes made to lighting, layout, textures, and focal points.
4. shoppableItems: 4 exact real-world furniture or decor pieces that fit this exact makeover. For each item provide:
   - name: clear product name
   - category: e.g. "Seating", "Lighting", "Rugs", "Tables", "Decor"
   - price: realistic price estimate (e.g. "$380")
   - retailer: well-known design retailer (e.g. West Elm, CB2, Article, IKEA, Pottery Barn, Crate & Barrel, The Sill)
   - description: 1 sentence explaining material and style purpose
   - searchUrl: a Google Shopping query link like "https://www.google.com/search?tbm=shop&q=..."
   - styleMatch: the style tag`;

    const analysisResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType || "image/jpeg",
            },
          },
          {
            text: analysisPrompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            makeoverSummary: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyModifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            shoppableItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  price: { type: Type.STRING },
                  retailer: { type: Type.STRING },
                  description: { type: Type.STRING },
                  searchUrl: { type: Type.STRING },
                  styleMatch: { type: Type.STRING },
                },
                required: ["name", "category", "price", "retailer", "description", "searchUrl", "styleMatch"],
              },
            },
          },
          required: ["makeoverSummary", "colorPalette", "keyModifications", "shoppableItems"],
        },
      },
    });

    let structuredData = null;
    try {
      const rawText = analysisResponse.text || "{}";
      structuredData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse design JSON:", parseErr);
    }

    res.json({
      success: true,
      generatedImageUrl,
      analysis: structuredData || {
        makeoverSummary: `Transformed space embracing ${styleName} with elevated material textures and tailored lighting.`,
        colorPalette: ["#8B5A2B", "#C98A2C", "#4A5B42", "#EFE6D8", "#2C3E50"],
        keyModifications: [
          "Replaced dated central seating with architectural profile piece",
          "Introduced layered ambient and task lighting",
          "Balanced warm organic timber with plush woven textiles",
          "Decluttered peripheral sightlines to maximize natural daylight"
        ],
        shoppableItems: []
      },
    });
  } catch (error: any) {
    console.error("Makeover API error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate room makeover" });
  }
});

/**
 * Context-Aware Chat Interface for Refinements & Shoppable Recommendations
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, context, currentImageBase64 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an elite, approachable AI Interior Design Consultant.
You are helping the user refine an active room makeover.
Current design context:
- Room Style: ${context?.currentStyle || "Modern Contemporary"}
- Current Room Overview: ${context?.roomOverview || "Standard residential living space"}
- Currently Suggested Palette: ${context?.palette?.join(", ") || "Warm neutrals, oak, linen"}

Your goals:
1. Provide thoughtful, tasteful, and professional interior design advice.
2. If the user asks for changes (e.g. "Keep this layout but make the rug navy blue", "What kind of coffee table works here?", "Can we add brass accents?"), acknowledge the modification, explain how it harmonizes with the lighting and spatial balance.
3. If the user is requesting a visual tweak to the room (such as changing colors, furniture items, lighting, or materials), specify an 'imageRefinementPrompt' describing the exact visual edit.
4. ALWAYS recommend 2 to 4 shoppable items tailored to the user's specific inquiry. Provide realistic price, retailer, search URL, category, and styling purpose.
Return a structured JSON with your conversational response, optional visual refinement instruction, and shoppable product recommendations.`;

    const chatParts: any[] = [];

    // Attach current room image if present for visual grounding
    if (currentImageBase64) {
      const { data, mimeType } = cleanBase64(currentImageBase64);
      if (data) {
        chatParts.push({
          inlineData: {
            data,
            mimeType: mimeType || "image/jpeg",
          },
        });
      }
    }

    // Format conversation history
    const conversationTranscript = messages
      .map((m: any) => `${m.sender === "user" ? "Client" : "Consultant"}: ${m.text}`)
      .join("\n\n");

    chatParts.push({
      text: `Conversation transcript:\n${conversationTranscript}\n\nPlease respond to the client's latest message with expert interior styling, recommended items, and any visual adjustment directives.`,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts: chatParts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: {
              type: Type.STRING,
              description: "The consultant's warm, professional, advice-rich response.",
            },
            actionSummary: {
              type: Type.STRING,
              description: "Short tag of the action taken (e.g., 'Refining rug to Cobalt Blue', 'Curating sculptural lighting')",
            },
            imageRefinementPrompt: {
              type: Type.STRING,
              description: "A descriptive text prompt to visually modify the room image if the user requested a visual change, otherwise null or empty.",
            },
            shoppableItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  price: { type: Type.STRING },
                  retailer: { type: Type.STRING },
                  description: { type: Type.STRING },
                  searchUrl: { type: Type.STRING },
                  styleMatch: { type: Type.STRING },
                },
                required: ["name", "category", "price", "retailer", "description", "searchUrl", "styleMatch"],
              },
            },
          },
          required: ["replyText", "shoppableItems"],
        },
      },
    });

    let result = null;
    try {
      result = JSON.parse(response.text || "{}");
    } catch {
      result = {
        replyText: response.text || "I'd love to help adjust that design for you!",
        shoppableItems: [],
      };
    }

    res.json({
      success: true,
      reply: result.replyText,
      actionSummary: result.actionSummary || null,
      imageRefinementPrompt: result.imageRefinementPrompt || null,
      shoppableItems: result.shoppableItems || [],
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    res.status(500).json({ error: err?.message || "Failed to process chat consultation" });
  }
});

/**
 * Visual Refinement Endpoint (Applies targeted edit using Gemini image capabilities)
 */
app.post("/api/refine-visual", async (req, res) => {
  try {
    const { imageBase64, refinementPrompt } = req.body;
    if (!imageBase64 || !refinementPrompt) {
      return res.status(400).json({ error: "Image and refinement prompt required" });
    }

    const { data: cleanData, mimeType } = cleanBase64(imageBase64);
    const ai = getGeminiClient();

    let refinedImageUrl: string | null = null;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanData,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: `Modify this interior room image: ${refinementPrompt}. Keep all other architectural structural elements, wall positions, and overall layout unchanged. Return the updated photorealistic room image.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "4:3",
            imageSize: "1K",
          },
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            refinedImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (err) {
      console.warn("Refine visual notice:", err);
    }

    res.json({
      success: true,
      imageUrl: refinedImageUrl,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Refinement failed" });
  }
});

// Vite middleware & Static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Interior Design Consultant server running on port ${PORT}`);
  });
}

setupVite();
