import { supabaseAdmin } from '../../../integrations/supabase/adminClient';
import { Document } from '../../../integrations/supabase/types/documentTypes';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Enable browser usage - ensure your API key is properly secured
});

/**
 * Service for processing documents and generating embeddings
 */
export const documentProcessingService = {
  /**
   * Extract text content from a PDF document
   * @param document The document to process
   * @returns The extracted text content
   */
  async extractTextFromPdf(document: Document): Promise<string> {
    try {
      console.log('Extracting text from PDF:', document.id);
      
      // Get the signed URL for the document
      const { data: signedUrl } = await supabaseAdmin.storage
        .from('company_documents')
        .createSignedUrl(document.file_path, 60); // 60 seconds expiry
      
      if (!signedUrl) {
        throw new Error('Failed to generate signed URL for document');
      }
      
      // Use PDF.js or similar library to extract text
      // For this example, we'll use a simple fetch and process approach
      const response = await fetch(signedUrl.signedUrl);
      const pdfData = await response.arrayBuffer();
      
      // In a real implementation, you would use PDF.js or a similar library
      // to extract text from the PDF. For now, we'll simulate this.
      
      // For demonstration purposes, we're returning a placeholder
      // In production, replace this with actual PDF text extraction
      return `Content extracted from ${document.title}. This is a placeholder for the actual text content that would be extracted from the PDF document.`;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  },
  
  /**
   * Generate embeddings for document text
   * @param text The text to generate embeddings for
   * @returns The generated embeddings
   */
  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      console.log('Generating embeddings for text');
      
      // Use OpenAI to generate embeddings
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  },
  
  /**
   * Store embeddings in the database
   * @param documentId The ID of the document
   * @param embeddings The embeddings to store
   * @returns Success status
   */
  async storeEmbeddings(documentId: string, embeddings: number[]): Promise<boolean> {
    try {
      console.log('Storing embeddings for document:', documentId);
      
      // Store embeddings in the document_embeddings table
      const { error } = await supabaseAdmin
        .from('document_embeddings')
        .insert({
          document_id: documentId,
          embedding: embeddings,
          created_at: new Date().toISOString(),
        });
      
      if (error) {
        throw error;
      }
      
      // Mark the document as processed
      const { error: updateError } = await supabaseAdmin
        .from('documents')
        .update({ is_processed: true })
        .eq('id', documentId);
      
      if (updateError) {
        throw updateError;
      }
      
      return true;
    } catch (error) {
      console.error('Error storing embeddings:', error);
      return false;
    }
  },
  
  /**
   * Process a document: extract text, generate embeddings, and store them
   * @param documentId The ID of the document to process
   * @returns Success status
   */
  async processDocument(documentId: string): Promise<boolean> {
    try {
      console.log('Processing document:', documentId);
      
      // Get the document
      const { data: document, error } = await supabaseAdmin
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (error || !document) {
        throw new Error('Document not found');
      }
      
      // Convert to Document type with proper date handling
      const typedDocument: Document = {
        ...document,
        created_at: new Date(document.created_at),
        updated_at: new Date(document.updated_at),
      };
      
      // Extract text from the PDF
      const text = await this.extractTextFromPdf(typedDocument);
      
      // Generate embeddings
      const embeddings = await this.generateEmbeddings(text);
      
      // Store embeddings and mark document as processed
      const success = await this.storeEmbeddings(documentId, embeddings);
      
      return success;
    } catch (error) {
      console.error('Error processing document:', error);
      return false;
    }
  },
  
  /**
   * Process all unprocessed documents
   * @returns Number of successfully processed documents
   */
  async processAllUnprocessedDocuments(): Promise<number> {
    try {
      console.log('Processing all unprocessed documents');
      
      // Get all unprocessed documents
      const { data: documents, error } = await supabaseAdmin
        .from('documents')
        .select('id')
        .eq('is_processed', false);
      
      if (error) {
        throw error;
      }
      
      if (!documents || documents.length === 0) {
        console.log('No unprocessed documents found');
        return 0;
      }
      
      console.log(`Found ${documents.length} unprocessed documents`);
      
      // Process each document
      let successCount = 0;
      for (const doc of documents) {
        const success = await this.processDocument(doc.id);
        if (success) {
          successCount++;
        }
      }
      
      return successCount;
    } catch (error) {
      console.error('Error processing unprocessed documents:', error);
      return 0;
    }
  }
};

export default documentProcessingService;
