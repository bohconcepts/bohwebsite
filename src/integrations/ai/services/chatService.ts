import { supabaseAdmin } from '../../../integrations/supabase/adminClient';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Enable browser usage - ensure your API key is properly secured
});

// Define chat message types
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
      console.log("Generating embedding for query:", query);

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
        encoding_format: "float",
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating query embedding:", error);
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

      // Generate response using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: allMessages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const answer =
        completion.choices[0].message.content ||
        "Sorry, I could not generate a response.";

      // Return the answer along with the sources
      return {
        answer,
        sources: documentContents.map((doc) => ({
          documentId: doc.id,
          title: doc.title,
          relevance: doc.similarity,
        })),
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
   * @param sessionId The chat session ID
   * @returns Array of chat messages
   */
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      console.log("Getting chat history for session:", sessionId);

      const { data, error } = await supabaseAdmin
        .from("chat_messages")
        .select("role, content, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      return data.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      }));
    } catch (error) {
      console.error("Error getting chat history:", error);
      return [];
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
