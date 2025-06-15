import { supabase } from '../client';
import { supabaseAdmin } from '../adminClient';
import { v4 as uuidv4 } from 'uuid';

// Document interface
export interface Document {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  is_processed: boolean;
  is_active: boolean;
}

// Document service
export const documentService = {
  // Upload a document
  uploadDocument: async (
    file: File,
    title: string,
    description?: string
  ): Promise<Document | null> => {
    try {
      console.log('Uploading document:', title);
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      
      // Upload the file to Supabase Storage using admin client to bypass RLS
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('company_documents')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading document:', uploadError);
        return null;
      }
      
      console.log('Document uploaded successfully:', uploadData.path);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return null;
      }
      
      // Insert document metadata into the documents table using admin client to bypass RLS
      const { data: documentData, error: documentError } = await supabaseAdmin
        .from('documents')
        .insert({
          title,
          description,
          file_path: uploadData.path,
          file_size: file.size,
          file_type: file.type,
          created_by: user.id,
          is_processed: false,
          is_active: true
        })
        .select('*')
        .single();
      
      if (documentError) {
        console.error('Error inserting document metadata:', documentError);
        // Delete the uploaded file if metadata insertion fails
        await supabase.storage
          .from('company_documents')
          .remove([uploadData.path]);
        return null;
      }
      
      console.log('Document metadata inserted successfully:', documentData);
      
      return {
        ...documentData,
        created_at: new Date(documentData.created_at),
        updated_at: new Date(documentData.updated_at)
      };
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      return null;
    }
  },
  
  // Get all documents
  getDocuments: async (): Promise<Document[]> => {
    try {
      console.log('Fetching all documents');
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching documents:', error);
        return [];
      }
      
      console.log(`Found ${data.length} documents`);
      
      return data.map(doc => ({
        ...doc,
        created_at: new Date(doc.created_at),
        updated_at: new Date(doc.updated_at)
      }));
    } catch (error) {
      console.error('Error in getDocuments:', error);
      return [];
    }
  },
  
  // Get a document by ID
  getDocumentById: async (id: string): Promise<Document | null> => {
    try {
      console.log('Fetching document by ID:', id);
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching document:', error);
        return null;
      }
      
      console.log('Document found:', data);
      
      return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error in getDocumentById:', error);
      return null;
    }
  },
  
  // Update a document
  updateDocument: async (
    id: string,
    updates: Partial<Omit<Document, 'id' | 'created_at' | 'updated_at' | 'file_path' | 'file_size' | 'file_type'>>
  ): Promise<boolean> => {
    try {
      console.log('Updating document:', id, updates);
      
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating document:', error);
        return false;
      }
      
      console.log('Document updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateDocument:', error);
      return false;
    }
  },
  
  // Delete a document
  deleteDocument: async (id: string): Promise<boolean> => {
    try {
      console.log('Deleting document:', id);
      
      // Get the document to find the file path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_path')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching document for deletion:', fetchError);
        return false;
      }
      
      // Delete the file from storage using admin client to bypass RLS
      const { error: storageError } = await supabaseAdmin.storage
        .from('company_documents')
        .remove([document.file_path]);
      
      if (storageError) {
        console.error('Error deleting document file:', storageError);
        return false;
      }
      
      // Delete the document metadata
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error('Error deleting document metadata:', deleteError);
        return false;
      }
      
      console.log('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteDocument:', error);
      return false;
    }
  },
  
  // Get a document download URL
  getDocumentUrl: async (filePath: string): Promise<string | null> => {
    try {
      console.log('Getting download URL for document:', filePath);
      
      const { data, error } = await supabaseAdmin.storage
        .from('company_documents')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }
      
      console.log('Signed URL created successfully');
      return data.signedUrl;
    } catch (error) {
      console.error('Error in getDocumentUrl:', error);
      return null;
    }
  },
  
  // Mark a document as processed (after LLM processing)
  markDocumentAsProcessed: async (id: string): Promise<boolean> => {
    try {
      console.log('Marking document as processed:', id);
      
      const { error } = await supabase
        .from('documents')
        .update({ is_processed: true })
        .eq('id', id);
      
      if (error) {
        console.error('Error marking document as processed:', error);
        return false;
      }
      
      console.log('Document marked as processed successfully');
      return true;
    } catch (error) {
      console.error('Error in markDocumentAsProcessed:', error);
      return false;
    }
  }
};
