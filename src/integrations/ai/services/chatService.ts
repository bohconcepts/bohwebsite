import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { OpenAI } from 'openai';
import geminiService from './geminiService';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Enable browser usage - ensure your API key is properly secured
});

// Flag to track which AI service to use
let useGemini = false; // Start with OpenAI, switch to Gemini if OpenAI fails

// Define chat message types for the API
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources: {
    documentId: string;
    title: string;
    relevance: number;
  }[];
  provider?: string; // Which AI provider was used (OpenAI or Gemini)
}

/**
 * Service for handling chat interactions with LLM
 */
export const chatService = {
  /**
   * Find relevant documents based on query embeddings
   * @param queryEmbedding The query embedding to search with
   * @param limit Maximum number of documents to return
   * @returns Array of relevant document IDs and their similarity scores
   */
  async findRelevantDocuments(
    queryEmbedding: number[],
    limit = 3
  ): Promise<Array<{ id: string; title: string; similarity: number }>> {
    try {
      console.log("Finding relevant documents for query");

      // Use vector similarity search to find relevant documents
      // This requires the pgvector extension to be enabled in Supabase
      const { data, error } = await supabaseAdmin.rpc("match_documents", {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, // Minimum similarity threshold
        match_count: limit, // Maximum number of matches
      });

      if (error) {
        console.error("Error finding relevant documents:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in findRelevantDocuments:", error);
      return [];
    }
  },

  /**
   * Generate embeddings for a query
   * @param query The query text
   * @returns The generated embeddings
   */
  async generateQueryEmbedding(query: string): Promise<number[]> {
    try {
      console.log("Generating mock embedding for query:", query);

      // Create a simple mock embedding based on the query text
      // This is a workaround for the OpenAI API rate limit
      // In a production environment, you would use a proper embedding API
      
      // Create a deterministic but unique embedding based on the text
      // This is not a real embedding but will allow the system to work for testing
      const mockEmbedding: number[] = [];
      
      // Create a 1536-dimensional vector (same as OpenAI's embedding model)
      for (let i = 0; i < 1536; i++) {
        // Use a simple hash function to generate a value between -1 and 1
        const charCode = (i < query.length) ? query.charCodeAt(i % query.length) : 0;
        const value = Math.sin(charCode * (i + 1)) * 0.5;
        mockEmbedding.push(value);
      }
      
      // Normalize the vector to have a magnitude of 1
      const magnitude = Math.sqrt(mockEmbedding.reduce((sum, val) => sum + val * val, 0));
      const normalizedEmbedding = mockEmbedding.map(val => val / magnitude);
      
      console.log('Generated mock query embedding with dimension:', normalizedEmbedding.length);
      return normalizedEmbedding;
    } catch (error) {
      console.error("Error generating mock query embedding:", error);
      throw error;
    }
  },

  /**
   * Retrieve document content by ID
   * @param documentId The document ID
   * @returns The document content
   */
  async getDocumentContent(documentId: string): Promise<string> {
    try {
      console.log("Getting content for document:", documentId);

      // In a real implementation, you would retrieve the actual document content
      // from a content store or regenerate it from the PDF

      // For this example, we'll retrieve the document metadata and return a placeholder
      const { data: document, error } = await supabaseAdmin
        .from("documents")
        .select("title, description")
        .eq("id", documentId)
        .single();

      if (error || !document) {
        throw new Error("Document not found");
      }

      // In production, replace this with actual document content retrieval
      return `Content from document "${document.title}": ${
        document.description || "No description available"
      }. This is a placeholder for the actual content that would be retrieved from the document.`;
    } catch (error) {
      console.error("Error getting document content:", error);
      return "";
    }
  },

  /**
   * Generate a response to a chat message using the LLM
   * @param messages Previous chat messages
   * @param query The user's query
   * @returns The LLM's response
   */
  async generateResponse(
    messages: ChatMessage[],
    query: string
  ): Promise<ChatResponse> {
    try {
      console.log("Generating response for query:", query);

      // Generate embedding for the query
      const queryEmbedding = await this.generateQueryEmbedding(query);

      // Find relevant documents
      const relevantDocs = await this.findRelevantDocuments(queryEmbedding);

      // Get content from relevant documents
      const documentContents = await Promise.all(
        relevantDocs.map(async (doc) => {
          const content = await this.getDocumentContent(doc.id);
          return {
            id: doc.id,
            title: doc.title,
            content,
            similarity: doc.similarity,
          };
        })
      );

      // Create a context string from the document contents
      const context = documentContents
        .map((doc) => `Document: ${doc.title}\n${doc.content}\n\n`)
        .join("");

      // Create system message with context
      const systemMessage: ChatMessage = {
        role: "system",
        content: `You are a helpful assistant that answers questions based on the provided documents. 
        Answer the user's question using ONLY the information from these documents. 
        If you don't know the answer based on these documents, say so clearly.
        Do not make up information or use knowledge outside of these documents.
        
        Here are the relevant documents:
        ${context}`,
      };

      // Combine previous messages with the new query
      const allMessages: ChatMessage[] = [
        systemMessage,
        ...messages.slice(-5), // Keep only the last 5 messages for context
        { role: "user", content: query },
      ];

      // Generate response using AI service (OpenAI or Gemini)
      let answer = "";
      let aiProvider = "OpenAI";
      
      try {
        // Check if API keys are available
        const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
        const geminiApiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
        
        // Log API key status (without revealing the actual keys)
        console.log("OpenAI API key available:", !!openaiApiKey);
        console.log("Gemini API key available:", !!geminiApiKey);
        
        if (!openaiApiKey && !geminiApiKey) {
          throw new Error("No API keys available for AI providers");
        }
        
        if (!useGemini && openaiApiKey) {
          // Try OpenAI first if we have a key
          console.log("Generating response using OpenAI");
          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: allMessages as any,
            temperature: 0.7,
            max_tokens: 1000,
          });

          answer = completion.choices[0].message.content || 
            "Sorry, I could not generate a response.";
        } else if (geminiApiKey) {
          // Use Gemini if OpenAI previously failed or if we're set to use Gemini
          console.log("Generating response using Gemini");
          useGemini = true;
          aiProvider = "Gemini";
          answer = await geminiService.generateChatResponse(allMessages);
        } else {
          throw new Error("No available AI provider with valid API key");
        }
      } catch (error) {
        console.error("Error generating AI response:", error);
        
        // Provide a more helpful error message based on the error
        const errorMessage = (error as Error).message || "Unknown error";
        console.log("Error details:", errorMessage);
        
        // If we haven't tried Gemini yet and we have a Gemini API key, try it as fallback
        const geminiApiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
        if (!useGemini && geminiApiKey) {
          try {
            console.log("Falling back to Gemini after OpenAI error");
            useGemini = true; // Switch to Gemini for future requests
            aiProvider = "Gemini";
            
            answer = await geminiService.generateChatResponse(allMessages);
          } catch (geminiError) {
            console.error("Error calling Gemini API:", geminiError);
            // Fall through to document-based fallback
          }
        }
        
        // If we still don't have an answer, use document content as fallback
        if (!answer) {
          // If both APIs fail, generate a simple fallback response based on document content
          if (documentContents.length > 0) {
            // Create a simple response based on the document content
            const doc = documentContents[0];
            answer = `Based on the document "${doc.title}", I found some relevant information. ` +
              `Here's what I found:\n\n${doc.content.substring(0, 500)}` +
              `\n\n(Note: This is a fallback response due to API limitations.)`;
          } else {
            // Provide a more specific error message
            if (!import.meta.env.VITE_OPENAI_API_KEY && !import.meta.env.VITE_GOOGLE_AI_API_KEY) {
              answer = "API keys for OpenAI and Google Gemini are missing. Please add them to your .env file.";
            } else if (errorMessage.includes("rate limit") || errorMessage.includes("quota")) {
              answer = "I'm sorry, the AI service has reached its rate limit. Please try again later.";
            } else {
              answer = "I'm sorry, I couldn't generate a response due to API limitations. " +
                "Please check your API keys and try again later.";
            }
          }
        }
      }

      // Return the answer along with the sources and AI provider info
      return {
        answer,
        sources: documentContents.map((doc) => ({
          documentId: doc.id,
          title: doc.title,
          relevance: doc.similarity || 0,
        })),
        provider: aiProvider, // Include which AI provider was used
      };
    } catch (error) {
      console.error("Error generating response:", error);
      return {
        answer:
          "Sorry, I encountered an error while generating a response. Please try again later.",
        sources: [],
      };
    }
  },

  /**
   * Save a chat message to the database
   * @param sessionId The chat session ID
   * @param message The message to save
   * @returns Success status
   */
  async saveChatMessage(
    sessionId: string,
    message: ChatMessage
  ): Promise<boolean> {
    try {
      console.log("Saving chat message for session:", sessionId);

      const { error } = await supabaseAdmin.from("chat_messages").insert({
        session_id: sessionId,
        role: message.role,
        content: message.content,
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error saving chat message:", error);
      return false;
    }
  },

  /**
   * Get chat history for a session
   * @param sessionId The session ID
   * @returns Array of chat messages
   */
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting chat history:", error);
      return [];
    }
  },

  /**
   * Clear chat history for a session
   * @param sessionId The session ID to clear history for
   * @returns Success status
   */
  async clearChatHistory(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from("chat_messages")
        .delete()
        .eq("session_id", sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error clearing chat history:", error);
      return false;
    }
  },

  /**
   * Create a new chat session
   * @returns The new session ID
   */
  async createChatSession(): Promise<string> {
    try {
      console.log("Creating new chat session");

      const sessionId = crypto.randomUUID();

      const { error } = await supabaseAdmin.from("chat_sessions").insert({
        id: sessionId,
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      return sessionId;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  },
};

export default chatService;
