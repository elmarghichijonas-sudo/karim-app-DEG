import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDocumentMetadata = async (fileName: string, subcategory: string) => {
  try {
    const model = ai.models;
    
    const prompt = `
      Analyze the following document filename and subcategory. 
      Generate a short professional description (max 20 words) and a list of 3-5 relevant tags/keywords.
      
      Filename: "${fileName}"
      Subcategory: "${subcategory}"
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            keywords: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return { description: 'Description auto-generated failed.', keywords: ['generic'] };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails or key is missing
    return {
      description: `Document uploaded in ${subcategory}.`,
      keywords: [subcategory.toLowerCase(), 'document']
    };
  }
};

export const chatWithGED = async (query: string, documents: any[]) => {
  try {
    const docSummary = documents.map(d => `- ${d.title} (${d.category}/${d.subcategory}): ${d.description}`).join('\n');
    
    const prompt = `
      You are an assistant for a Document Management System (GED).
      Here is the list of available documents:
      ${docSummary}

      User Query: "${query}"

      Please answer the user's query based ONLY on the documents list. 
      If the user is looking for a document, recommend the best matches.
      Keep it brief and helpful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Désolé, je ne peux pas traiter votre demande pour le moment.";
  }
};
