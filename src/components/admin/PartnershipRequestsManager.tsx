import { useState, useEffect } from 'react';
import { 
  getPartnershipRequests, 
  deletePartnershipRequest 
} from '@/integrations/supabase/services/partnershipService';
import { PartnershipRequest } from '@/integrations/supabase/types/partnership-requests';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MoreVertical, Trash2, Eye, Mail, ExternalLink } from 'lucide-react';

export const PartnershipRequestsManager = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [partnershipTypeFilter, setPartnershipTypeFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch partnership requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { success, data, error } = await getPartnershipRequests();
        if (success && data) {
          setRequests(data);
        } else {
          toast({
            title: 'Error',
            description: error || 'Failed to load partnership requests',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching partnership requests:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequests();
  }, [toast]);

  // Filter requests based on search term and partnership type
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      searchTerm === '' || 
      request.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.industry && request.industry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = 
      partnershipTypeFilter === 'all' || 
      request.partnership_type === partnershipTypeFilter;
      
    return matchesSearch && matchesType;
  });

  // Handle delete request
  const handleDelete = async () => {
    if (!selectedRequest) return;
    
    setDeleteLoading(true);
    try {
      const { success, error } = await deletePartnershipRequest(selectedRequest.id);
      
      if (success) {
        setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
        toast({
          title: 'Success',
          description: 'Partnership request deleted successfully',
        });
        setDeleteDialogOpen(false);
      } else {
        toast({
          title: 'Error',
          description: error || 'Failed to delete partnership request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting partnership request:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get unique partnership types for filter
  const partnershipTypes = ['all', ...new Set(requests
    .filter(r => r.partnership_type)
    .map(r => r.partnership_type as string))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold">Partnership Requests</h2>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search requests..."
              className="pl-8 w-[200px] sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={partnershipTypeFilter} onValueChange={setPartnershipTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {partnershipTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partnership Requests</CardTitle>
          <CardDescription>
            Manage incoming partnership requests from potential partners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No partnership requests found.
            </div>
          ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Partnership Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.company_name}</TableCell>
                        <TableCell>{request.contact_person}</TableCell>
                        <TableCell>
                          {request.partnership_type ? (
                            <Badge variant="outline" className="capitalize">
                              {request.partnership_type}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not specified</span>
                          )}
                        </TableCell>
                      <TableCell>
                        {format(new Date(request.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  window.location.href = `mailto:${request.email}?subject=RE: Partnership Request - ${request.company_name}`;
                                }}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Email Contact
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          }
        </CardContent>
      </Card>

      {/* View Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Partnership Request Details</DialogTitle>
            <DialogDescription>
              Request from {selectedRequest?.company_name} on{' '}
              {selectedRequest?.created_at && format(new Date(selectedRequest.created_at), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Company</h4>
                  <p className="font-medium">{selectedRequest.company_name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Person</h4>
                  <p>{selectedRequest.contact_person}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                  <p className="break-all">{selectedRequest.email}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                  <p>{selectedRequest.phone}</p>
                </div>
                
                {selectedRequest.website && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Website</h4>
                    <div className="flex items-center">
                      <a 
                        href={selectedRequest.website.startsWith('http') ? selectedRequest.website : `https://${selectedRequest.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        {selectedRequest.website}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedRequest.industry && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
                    <p className="capitalize">{selectedRequest.industry}</p>
                  </div>
                )}
                
                {selectedRequest.partnership_type && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Partnership Type</h4>
                    <p className="capitalize">{selectedRequest.partnership_type}</p>
                  </div>
                )}
              </div>
              
              {selectedRequest.message && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Message</h4>
                  <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {selectedRequest.message}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                window.location.href = `mailto:${selectedRequest?.email}?subject=RE: Partnership Request - ${selectedRequest?.company_name}`;
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Partnership Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this partnership request from {selectedRequest?.company_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
