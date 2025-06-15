import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';

const DocumentProcessor: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const processDocuments = async () => {
    try {
      setIsProcessing(true);
      setResult(null);
      
      const response = await fetch('/api/process-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: `Successfully processed ${data.processedCount} documents`,
          variant: 'default',
        });
        setResult(`Successfully processed ${data.processedCount} documents`);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to process documents',
          variant: 'destructive',
        });
        setResult(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error processing documents:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      setResult(`Error: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-medium mb-4">Document Processor</h2>
      <p className="text-sm text-gray-600 mb-4">
        Process all unprocessed documents to make them available for AI chat.
      </p>
      
      <Button 
        onClick={processDocuments} 
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Process Documents'
        )}
      </Button>
      
      {result && (
        <div className={`mt-4 p-3 rounded text-sm ${result.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {result}
        </div>
      )}
    </div>
  );
};

export default DocumentProcessor;
