import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Search,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  FileUp,
  Info,
} from "lucide-react";
import {
  documentService,
  Document,
} from "@/integrations/supabase/services/documentService";
import { adminService } from "@/integrations/supabase/services/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/layout/AdminLayout";

const AdminDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    loadDocuments();
  }, [navigate]);

  // Load documents
  const loadDocuments = async () => {
    setIsLoading(true);
    const docs = await documentService.getDocuments();
    setDocuments(docs);
    setIsLoading(false);
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description &&
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is a PDF
      if (file.type !== "application/pdf") {
        setErrors({
          ...errors,
          file: "Only PDF files are allowed",
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({
          ...errors,
          file: "File size must be less than 10MB",
        });
        return;
      }
      
      setUploadData({
        ...uploadData,
        file,
      });
      setErrors({
        ...errors,
        file: "",
      });
    }
  };

  // Handle upload form change
  const handleUploadFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUploadData({
      ...uploadData,
      [name]: value,
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate upload form
  const validateUploadForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!uploadData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!uploadData.file) {
      newErrors.file = "Please select a PDF file";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle document upload
  const handleUpload = async () => {
    if (!validateUploadForm()) return;
    
    setIsUploading(true);
    
    try {
      const result = await documentService.uploadDocument(
        uploadData.file!,
        uploadData.title,
        uploadData.description
      );
      
      if (result) {
        toast.success("Document uploaded successfully");
        setShowUploadDialog(false);
        setUploadData({
          title: "",
          description: "",
          file: null,
        });
        loadDocuments();
      } else {
        toast.error("Failed to upload document");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("An error occurred while uploading the document");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle document deletion
  const handleDelete = async () => {
    if (!currentDocument) return;
    
    setIsDeleting(true);
    
    try {
      const success = await documentService.deleteDocument(currentDocument.id);
      
      if (success) {
        toast.success("Document deleted successfully");
        setShowDeleteDialog(false);
        setCurrentDocument(null);
        loadDocuments();
      } else {
        toast.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("An error occurred while deleting the document");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle document download
  const handleDownload = async (document: Document) => {
    try {
      const url = await documentService.getDocumentUrl(document.file_path);
      
      if (url) {
        window.open(url, "_blank");
      } else {
        toast.error("Failed to generate download link");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("An error occurred while generating the download link");
    }
  };

  return (
    <>
      <Helmet>
        <title>Document Management | Admin Panel</title>
      </Helmet>

      <AdminLayout title="Document Management">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-blue" />
            <h1 className="text-xl font-semibold">Company Documents</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-2.5 top-2.5"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            <Button onClick={() => setShowUploadDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Document Library</CardTitle>
            <CardDescription>
              Upload and manage company documents for the AI chat feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.title}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {doc.description || "-"}
                        </TableCell>
                        <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                        <TableCell>
                          {doc.created_at.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {doc.is_processed ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Processed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                              title="Download"
                            >
                              <Download className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCurrentDocument(doc);
                                setShowDeleteDialog(true);
                              }}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  No documents found
                </h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery
                    ? "No documents match your search criteria"
                    : "Upload your first document to get started"}
                </p>
                {searchQuery ? (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                ) : (
                  <Button
                    className="mt-4"
                    onClick={() => setShowUploadDialog(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="text-sm text-gray-500">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 && "s"}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Info className="h-4 w-4 mr-1" />
              Only PDF files are supported
            </div>
          </CardFooter>
        </Card>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a PDF document to be processed for the AI chat feature
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter document title"
                  value={uploadData.title}
                  onChange={handleUploadFormChange}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter document description"
                  value={uploadData.description}
                  onChange={handleUploadFormChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">PDF File</Label>
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  {uploadData.file ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-8 w-8 text-brand-blue mb-2" />
                      <p className="text-sm font-medium">{uploadData.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadData.file.size)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          setUploadData({
                            ...uploadData,
                            file: null,
                          })
                        }
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium">
                        Click to select a PDF file
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        or drag and drop here
                      </span>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
                {errors.file && (
                  <p className="text-sm text-red-500">{errors.file}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  setUploadData({
                    title: "",
                    description: "",
                    file: null,
                  });
                  setErrors({});
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this document? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            {currentDocument && (
              <div className="py-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h3 className="font-medium">{currentDocument.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentDocument.description || "No description"}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{formatFileSize(currentDocument.file_size)}</span>
                    <span>
                      Uploaded on{" "}
                      {currentDocument.created_at.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setCurrentDocument(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
};

export default AdminDocuments;
