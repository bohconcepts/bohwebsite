/**
 * Types for chat-related database tables
 */

export interface ChatTypes {
  // Chat Sessions Table
  Sessions: {
    Row: {
      id: string;
      user_id?: string;
      created_at: string;
      updated_at?: string;
      metadata?: Record<string, any>;
    };
    Insert: {
      id?: string;
      user_id?: string;
      created_at?: string;
      updated_at?: string;
      metadata?: Record<string, any>;
    };
    Update: {
      id?: string;
      user_id?: string;
      created_at?: string;
      updated_at?: string;
      metadata?: Record<string, any>;
    };
  };

  // Chat Messages Table
  Messages: {
    Row: {
      id: string;
      session_id: string;
      role: string;
      content: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      session_id: string;
      role: string;
      content: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      session_id?: string;
      role?: string;
      content?: string;
      created_at?: string;
    };
  };

  // Document Embeddings Table
  Embeddings: {
    Row: {
      id: string;
      document_id: string;
      embedding: number[];
      created_at: string;
      updated_at?: string;
    };
    Insert: {
      id?: string;
      document_id: string;
      embedding: number[];
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      document_id?: string;
      embedding?: number[];
      created_at?: string;
      updated_at?: string;
    };
  };
}

// Application-level types
export interface ChatSession {
  id: string;
  userId?: string;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface DocumentEmbedding {
  id: string;
  documentId: string;
  embedding: number[];
  createdAt: Date;
  updatedAt?: Date;
}
