// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize the Gemini API client
// // Note: You'll need to add VITE_GOOGLE_AI_API_KEY to your .env file
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY || '');

// /**
//  * Service for interacting with Google's Gemini API
//  */
// const geminiService = {
//   /**
//    * Generate embeddings for text using a simple deterministic approach
//    * Note: Gemini doesn't currently have a dedicated embeddings API like OpenAI,
//    * so we're using the same mock embedding approach
//    *
//    * @param text The text to generate embeddings for
//    * @returns The generated embeddings
//    */
//   async generateEmbeddings(text: string): Promise<number[]> {
//     try {
//       console.log('Generating mock embeddings with Gemini service');

//       // Create a deterministic but unique embedding based on the text
//       const mockEmbedding: number[] = [];

//       // Create a 1536-dimensional vector (same as OpenAI's embedding model)
//       for (let i = 0; i < 1536; i++) {
//         // Use a simple hash function to generate a value between -1 and 1
//         const charCode = (i < text.length) ? text.charCodeAt(i % text.length) : 0;
//         const value = Math.sin(charCode * (i + 1)) * 0.5;
//         mockEmbedding.push(value);
//       }

//       // Normalize the vector to have a magnitude of 1
//       const magnitude = Math.sqrt(mockEmbedding.reduce((sum, val) => sum + val * val, 0));
//       const normalizedEmbedding = mockEmbedding.map(val => val / magnitude);

//       return normalizedEmbedding;
//     } catch (error) {
//       console.error('Error generating mock embeddings:', error);
//       throw error;
//     }
//   },

//   /**
//    * Generate a chat response using Gemini
//    *
//    * @param messages Array of message objects with role and content
//    * @returns The generated response
//    */
//   async generateChatResponse(messages: { role: string; content: string }[]): Promise<string> {
//     try {
//       console.log('Generating chat response with Gemini');

//       // Extract system message if it exists
//       const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';

//       // Format conversation history for Gemini
//       // Only include user and assistant messages (no system messages)
//       const history: Array<{
//         role: 'user' | 'model';
//         parts: Array<{text: string}>
//       }> = [];

//       // Process messages in order, skipping system messages
//       for (const msg of messages) {
//         if (msg.role === 'system') continue;

//         history.push({
//           role: msg.role === 'assistant' ? 'model' : 'user',
//           parts: [{ text: msg.content }]
//         });
//       }

//       // Get the Gemini model
//       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

//       // Start a chat
//       const chat = model.startChat({
//         history,
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 1000,
//         },
//       });

//       // Prepare the prompt with system instructions if available
//       const prompt = systemMessage ?
//         `[SYSTEM INSTRUCTION]: ${systemMessage}\n\nPlease respond to the latest message.` :
//         'Please respond to the latest message.';

//       // Generate a response
//       const result = await chat.sendMessage(prompt);

//       return result.response.text();
//     } catch (error) {
//       console.error('Error generating chat response with Gemini:', error);
//       throw error;
//     }
//   }
// };

// export default geminiService;
