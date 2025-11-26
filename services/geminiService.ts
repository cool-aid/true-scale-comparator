import { GoogleGenAI } from "@google/genai";
import { ComparisonItem, ImageResolution, GenerationResult } from "../types";

// Helper to get a fresh AI client (crucial for key selection updates)
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Step 1: Use Gemini Flash + Google Search to research item sizes.
 */
export const researchItemSizes = async (items: ComparisonItem[]): Promise<{ summary: string; links: { title: string; uri: string }[] }> => {
  const ai = getAiClient();
  
  const itemsToResearch = items.filter(i => !i.sizeOverride).map(i => i.name);
  const itemsWithOverrides = items.filter(i => i.sizeOverride).map(i => `${i.name} (User provided size: ${i.sizeOverride})`);

  let prompt = `I need to compare the physical sizes of the following items to generate a scale-accurate image.
  
  Items to research (find their typical height, width, and depth in meters or centimeters):
  ${itemsToResearch.join(", ")}
  
  Items with pre-defined sizes:
  ${itemsWithOverrides.join(", ")}

  Please output a concise summary list describing the physical dimensions of ALL items in the list. 
  For the items requiring research, use the Google Search tool to find accurate real-world dimensions.
  Format the output clearly so it can be used as a specification for an image generator.
  `;

  if (itemsToResearch.length === 0) {
    // If all items have overrides, we skip the search tool to save latency, but since we need a unified summary,
    // we can just ask Flash to format it nicely without tools.
    prompt += "\n(No research needed, just format the provided sizes).";
  }

  // We only use the search tool if there are items to research
  const tools = itemsToResearch.length > 0 ? [{ googleSearch: {} }] : undefined;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: tools,
    }
  });

  const text = response.text || "No size information found.";
  
  // Extract grounding chunks if available
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const links = chunks
    .filter((c: any) => c.web?.uri && c.web?.title)
    .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

  return { summary: text, links };
};

/**
 * Step 2: Generate the composite image using Nano Banana Pro (gemini-3-pro-image-preview).
 */
export const generateScaleImage = async (
  researchSummary: string,
  resolution: ImageResolution
): Promise<string> => {
  const ai = getAiClient();

  const prompt = `Generate a high-quality, realistic composite image showing the following items side-by-side on a neutral, clean ground plane (or a realistic environment if fitting) to compare their sizes.
  
  CRITICAL: The items MUST be scaled correctly relative to each other based on the following specifications:
  
  ${researchSummary}
  
  Ensure the perspective allows for clear size comparison. Lighting should be natural and consistent.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        imageSize: resolution,
        aspectRatio: "16:9" // Wide aspect ratio is usually better for side-by-side comparison
      }
    }
  });

  // Extract image from response
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data found in response.");
};

export const processComparison = async (items: ComparisonItem[], resolution: ImageResolution): Promise<GenerationResult> => {
  // 1. Research
  const research = await researchItemSizes(items);
  
  // 2. Generate
  const imageUrl = await generateScaleImage(research.summary, resolution);

  return {
    imageUrl,
    researchSummary: research.summary,
    groundingLinks: research.links
  };
};