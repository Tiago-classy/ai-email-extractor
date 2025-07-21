import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  // This will be caught by the App component and displayed to the user.
  throw new Error("The API_KEY environment variable is not set. Please configure it to use the application.");
}

const ai = new GoogleGenAI({ apiKey });

const emailExtractionSchema = {
  type: Type.OBJECT,
  properties: {
    emails: {
      type: Type.ARRAY,
      description: "A list of email addresses found on the page.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ['emails'],
};


export const extractEmailsFromUrl = async (url: string): Promise<string[]> => {
  if (!url) {
    return [];
  }

  const prompt = `
    You are a specialized AI that simulates a web crawler and email address extractor.
    Your task is to analyze the likely public-facing content of the ENTIRE website accessible from the provided URL, as if you were performing a deep crawl (depth = -1), following links to all other pages within the same domain (like "Contact", "About", "Team" pages).

    From this analysis, identify and extract any email addresses that would likely be present across the analyzed scope.

    URL to analyze: "${url}"

    Rules:
    1. Only return valid email address formats.
    2. Do not invent email addresses. If none are likely to be found, return an empty list.
    3. If the URL appears invalid, non-existent, or is a common placeholder (e.g., example.com, yoursite.com), return an empty list.
    4. Your final output MUST be a JSON object conforming to the specified schema.

    Example for a successful extraction: {"emails": ["contact@company.com", "support@company.com"]}
    Example for no emails found: {"emails": []}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: emailExtractionSchema,
        temperature: 0.1, 
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
        console.warn("Gemini returned an empty response.");
        return [];
    }
    
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.emails)) {
      // Filter out any invalid-looking entries just in case
      return result.emails.filter(email => typeof email === 'string' && email.includes('@'));
    } else {
      console.error("Invalid JSON structure received from Gemini:", result);
      return [];
    }

  } catch (error) {
    console.error("Error extracting emails with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to extract emails. Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the AI service.");
  }
};