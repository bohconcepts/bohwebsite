import { documentProcessingService } from '../../integrations/ai/services/documentProcessingService';

export async function POST() {
  try {
    // Process all unprocessed documents
    const processedCount = await documentProcessingService.processAllUnprocessedDocuments();
    
    return new Response(JSON.stringify({
      success: true,
      message: `Successfully processed ${processedCount} documents`,
      processedCount
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error processing documents:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error processing documents',
      error: (error as Error).message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
