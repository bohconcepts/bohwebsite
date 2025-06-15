// import { supabaseAdmin } from '../../../integrations/supabase/adminClient';
// import { Document } from '../../../integrations/supabase/types/documentTypes';

// // Note: OpenAI import removed as we're using mock embeddings
// // due to API rate limits

// /**
//  * Service for processing documents and generating embeddings
//  */
// export const documentProcessingService = {
//   /**
//    * Extract text content from a PDF document
//    * @param document The document to process
//    * @returns The extracted text content
//    */
//   async extractTextFromPdf(document: Document): Promise<string> {
//     try {
//       console.log('Extracting text from PDF:', document.id);

//       // Get the signed URL for the document
//       const { data: signedUrl } = await supabaseAdmin.storage
//         .from('company_documents')
//         .createSignedUrl(document.file_path, 60); // 60 seconds expiry

//       if (!signedUrl) {
//         throw new Error('Failed to generate signed URL for document');
//       }

//       // Use PDF.js or similar library to extract text
//       // For this example, we'll use a simple fetch approach
//       await fetch(signedUrl.signedUrl);

//       // In a real implementation, you would use PDF.js or a similar library
//       // to extract text from the PDF. For now, we'll simulate this.
//       // Example code for actual implementation:
//       // const response = await fetch(signedUrl.signedUrl);
//       // const pdfData = await response.arrayBuffer();
//       // const pdf = await pdfjs.getDocument({data: pdfData}).promise;
//       // ... extract text from pages

//       // For demonstration purposes, we're returning a placeholder
//       // In production, replace this with actual PDF text extraction
//       return `Content extracted from ${document.title}. This is a placeholder for the actual text content that would be extracted from the PDF document.`;
//     } catch (error) {
//       console.error('Error extracting text from PDF:', error);
//       throw error;
//     }
//   },

//   /**
//    * Generate embeddings for document text
//    * @param text The text to generate embeddings for
//    * @returns The generated embeddings
//    */
//   async generateEmbeddings(text: string): Promise<number[]> {
//     try {
//       console.log('Generating mock embeddings for text');

//       // Create a simple mock embedding based on the text
//       // This is a workaround for the OpenAI API rate limit
//       // In a production environment, you would use a proper embedding API

//       // Create a deterministic but unique embedding based on the text
//       // This is not a real embedding but will allow the system to work for testing
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

//       console.log('Generated mock embedding with dimension:', normalizedEmbedding.length);
//       return normalizedEmbedding;
//     } catch (error) {
//       console.error('Error generating mock embeddings:', error);
//       throw error;
//     }
//   },

//   /**
//    * Store embeddings in the database
//    * @param documentId The ID of the document
//    * @param embeddings The embeddings to store
//    * @returns Success status
//    */
//   async storeEmbeddings(documentId: string, embeddings: number[]): Promise<boolean> {
//     try {
//       console.log('Storing embeddings for document:', documentId);

//       // First check if there's already an embedding for this document
//       const { data: existingEmbedding } = await supabaseAdmin
//         .from('document_embeddings')
//         .select('id')
//         .eq('document_id', documentId)
//         .maybeSingle();

//       // If there's an existing embedding, update it
//       if (existingEmbedding) {
//         console.log('Updating existing embedding for document:', documentId);
//         const { error } = await supabaseAdmin
//           .from('document_embeddings')
//           .update({
//             embedding: embeddings,
//             created_at: new Date().toISOString(),
//           })
//           .eq('id', existingEmbedding.id);

//         if (error) {
//           console.error('Error updating embedding:', error);
//           throw error;
//         }
//       } else {
//         // Store embeddings in the document_embeddings table
//         console.log('Creating new embedding for document:', documentId);
//         const { error } = await supabaseAdmin.rpc('insert_document_embedding', {
//           p_document_id: documentId,
//           p_embedding: embeddings
//         });

//         if (error) {
//           console.error('Error inserting embedding via RPC:', error);

//           // Fallback to direct insert if RPC fails
//           const { error: insertError } = await supabaseAdmin
//             .from('document_embeddings')
//             .insert({
//               document_id: documentId,
//               embedding: embeddings,
//               created_at: new Date().toISOString(),
//             });

//           if (insertError) {
//             console.error('Error inserting embedding directly:', insertError);
//             throw insertError;
//           }
//         }
//       }

//       // Mark the document as processed
//       const { error: updateError } = await supabaseAdmin
//         .from('documents')
//         .update({ is_processed: true })
//         .eq('id', documentId);

//       if (updateError) {
//         console.error('Error updating document status:', updateError);
//         throw updateError;
//       }

//       console.log('Successfully stored embeddings for document:', documentId);
//       return true;
//     } catch (error) {
//       console.error('Error storing embeddings:', error);
//       return false;
//     }
//   },

//   /**
//    * Process a document: extract text, generate embeddings, and store them
//    * @param documentId The ID of the document to process
//    * @returns Success status
//    */
//   async processDocument(documentId: string): Promise<boolean> {
//     try {
//       console.log('Processing document:', documentId);

//       // Get the document
//       const { data: document, error } = await supabaseAdmin
//         .from('documents')
//         .select('*')
//         .eq('id', documentId)
//         .single();

//       if (error || !document) {
//         throw new Error('Document not found');
//       }

//       // Convert to Document type with proper date handling
//       const typedDocument: Document = {
//         ...document,
//         created_at: new Date(document.created_at),
//         updated_at: new Date(document.updated_at),
//       };

//       // Extract text from the PDF
//       const text = await this.extractTextFromPdf(typedDocument);

//       // Generate embeddings
//       const embeddings = await this.generateEmbeddings(text);

//       // Store embeddings and mark document as processed
//       const success = await this.storeEmbeddings(documentId, embeddings);

//       return success;
//     } catch (error) {
//       console.error('Error processing document:', error);
//       return false;
//     }
//   },

//   /**
//    * Process all unprocessed documents
//    * @returns Number of successfully processed documents
//    */
//   async processAllUnprocessedDocuments(): Promise<number> {
//     try {
//       console.log('Processing all unprocessed documents');

//       // Get all unprocessed documents
//       const { data: documents, error } = await supabaseAdmin
//         .from('documents')
//         .select('id')
//         .eq('is_processed', false);

//       if (error) {
//         throw error;
//       }

//       if (!documents || documents.length === 0) {
//         console.log('No unprocessed documents found');
//         return 0;
//       }

//       console.log(`Found ${documents.length} unprocessed documents`);

//       // Process each document
//       let successCount = 0;
//       for (const doc of documents) {
//         const success = await this.processDocument(doc.id);
//         if (success) {
//           successCount++;
//         }
//       }

//       return successCount;
//     } catch (error) {
//       console.error('Error processing unprocessed documents:', error);
//       return 0;
//     }
//   }
// };

// export default documentProcessingService;
