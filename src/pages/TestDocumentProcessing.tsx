// import { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { COMPANY_NAME } from '@/lib/constants';
// import DocumentProcessor from '@/components/admin/DocumentProcessor';
// import { supabaseAdmin } from '@/integrations/supabase/adminClient';
// import { Button } from '@/components/ui/button';
// import { Loader2, RefreshCw } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';

// interface Document {
//   id: string;
//   title: string;
//   is_processed: boolean;
// }

// interface Embedding {
//   id: string;
//   document_id: string;
//   created_at: string;
// }

// const TestDocumentProcessing = () => {
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [embeddings, setEmbeddings] = useState<Embedding[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       // Fetch documents
//       const { data: docsData, error: docsError } = await supabaseAdmin
//         .from('documents')
//         .select('id, title, is_processed')
//         .order('created_at', { ascending: false });

//       if (docsError) throw docsError;
//       setDocuments(docsData || []);

//       // Fetch embeddings
//       const { data: embData, error: embError } = await supabaseAdmin
//         .from('document_embeddings')
//         .select('id, document_id, created_at')
//         .order('created_at', { ascending: false });

//       if (embError) throw embError;
//       setEmbeddings(embData || []);

//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to fetch data',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Helmet>
//         <title>{`${COMPANY_NAME} | Test Document Processing`}</title>
//       </Helmet>

//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Test Document Processing</h1>
//         <Button onClick={fetchData} variant="outline" size="sm">
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Refresh Data
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <DocumentProcessor onProcessingComplete={fetchData} />

//           <div className="mt-6 bg-white shadow rounded-lg p-4">
//             <h2 className="text-lg font-medium mb-4">Database Status</h2>

//             {loading ? (
//               <div className="flex justify-center py-4">
//                 <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-medium">Documents ({documents.length})</h3>
//                   <ul className="mt-2 space-y-2">
//                     {documents.map(doc => (
//                       <li key={doc.id} className="p-2 bg-gray-50 rounded">
//                         <div className="flex justify-between">
//                           <span className="font-medium">{doc.title}</span>
//                           <span className={`text-sm ${doc.is_processed ? 'text-green-600' : 'text-yellow-600'}`}>
//                             {doc.is_processed ? 'Processed' : 'Unprocessed'}
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">ID: {doc.id}</div>
//                       </li>
//                     ))}
//                     {documents.length === 0 && (
//                       <li className="text-gray-500 text-sm">No documents found</li>
//                     )}
//                   </ul>
//                 </div>

//                 <div>
//                   <h3 className="font-medium">Embeddings ({embeddings.length})</h3>
//                   <ul className="mt-2 space-y-2">
//                     {embeddings.map(emb => (
//                       <li key={emb.id} className="p-2 bg-gray-50 rounded">
//                         <div className="flex justify-between">
//                           <span className="font-medium">Document ID: {emb.document_id}</span>
//                           <span className="text-sm text-green-600">
//                             Embedding exists
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">Created: {new Date(emb.created_at).toLocaleString()}</div>
//                       </li>
//                     ))}
//                     {embeddings.length === 0 && (
//                       <li className="text-gray-500 text-sm">No embeddings found</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-white shadow rounded-lg p-4">
//           <h2 className="text-lg font-medium mb-4">Instructions</h2>

//           <div className="prose">
//             <ol className="list-decimal pl-5 space-y-2">
//               <li>Click the <strong>Process Documents</strong> button to process any unprocessed documents.</li>
//               <li>After processing, click <strong>Refresh Data</strong> to see the updated status.</li>
//               <li>Once documents are processed and embeddings are created, the document chat should work correctly.</li>
//               <li>If you encounter any errors, check the browser console for detailed error messages.</li>
//             </ol>

//             <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded">
//               <h3 className="font-medium">Troubleshooting</h3>
//               <ul className="list-disc pl-5 mt-2 space-y-1">
//                 <li>If embeddings aren't being created, check that the pgvector extension is enabled.</li>
//                 <li>If the chat still doesn't work, try refreshing the page after processing documents.</li>
//                 <li>Make sure your OpenAI API key is correctly set in the environment variables.</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestDocumentProcessing;
