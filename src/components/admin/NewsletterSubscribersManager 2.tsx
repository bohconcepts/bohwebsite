import { useState, useEffect } from 'react';
import { 
  getNewsletterSubscribers, 
  deleteNewsletterSubscriber,
  updateNewsletterSubscriber,
  getNewsletterStats
} from '@/integrations/supabase/services/newsletterService';
import { NewsletterSubscriber } from '@/integrations/supabase/types/newsletter-subscribers';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, MoreHorizontal, Mail, Trash2, CheckCircle, XCircle } from 'lucide-react';

export const NewsletterSubscribersManager = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationFilter, setConfirmationFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    unconfirmed: 0
  });

  // Fetch newsletter subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        const { success, data, error } = await getNewsletterSubscribers();
        if (success && data) {
          setSubscribers(data);
          
          // Also fetch stats
          const statsResult = await getNewsletterStats();
          if (statsResult.success && statsResult.data) {
            setStats(statsResult.data);
          }
        } else {
          toast({
            title: 'Error',
            description: error || 'Failed to load newsletter subscribers',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching newsletter subscribers:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubscribers();
  }, [toast]);

  // Filter subscribers based on search term and confirmation status
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      searchTerm === '' || 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesConfirmation = 
      confirmationFilter === 'all' || 
      (confirmationFilter === 'confirmed' && subscriber.confirmed) ||
      (confirmationFilter === 'unconfirmed' && !subscriber.confirmed);
    
    return matchesSearch && matchesConfirmation;
  });

  // Handle delete subscriber
  const handleDelete = async () => {
    if (!selectedSubscriber) return;
    
    setDeleteLoading(true);
    try {
      const { success, error } = await deleteNewsletterSubscriber(selectedSubscriber.id);
      
      if (success) {
        setSubscribers(prev => prev.filter(s => s.id !== selectedSubscriber.id));
        setDeleteDialogOpen(false);
        setSelectedSubscriber(null);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          confirmed: selectedSubscriber.confirmed ? prev.confirmed - 1 : prev.confirmed,
          unconfirmed: !selectedSubscriber.confirmed ? prev.unconfirmed - 1 : prev.unconfirmed
        }));
        
        toast({
          title: 'Success',
          description: 'Subscriber deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: error || 'Failed to delete subscriber',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle toggle confirmation status
  const handleToggleConfirmation = async (subscriber: NewsletterSubscriber) => {
    try {
      const newStatus = !subscriber.confirmed;
      const { success, error } = await updateNewsletterSubscriber(subscriber.id, {
        confirmed: newStatus
      });
      
      if (success) {
        // Update local state
        setSubscribers(prev => 
          prev.map(s => s.id === subscriber.id ? {...s, confirmed: newStatus} : s)
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          confirmed: newStatus ? prev.confirmed + 1 : prev.confirmed - 1,
          unconfirmed: newStatus ? prev.unconfirmed - 1 : prev.unconfirmed + 1
        }));
        
        toast({
          title: 'Success',
          description: `Subscriber ${newStatus ? 'confirmed' : 'unconfirmed'} successfully`,
        });
      } else {
        toast({
          title: 'Error',
          description: error || 'Failed to update subscriber status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold">Newsletter Subscribers</h2>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subscribers..."
              className="pl-8 w-[200px] sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => setConfirmationFilter(confirmationFilter === 'confirmed' ? 'all' : 'confirmed')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.confirmed}</div>
            {confirmationFilter === 'confirmed' && (
              <Badge variant="outline">Filtered</Badge>
            )}
          </CardContent>
        </Card>
        
        <Card 
          className="bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => setConfirmationFilter(confirmationFilter === 'unconfirmed' ? 'all' : 'unconfirmed')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Unconfirmed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.unconfirmed}</div>
            {confirmationFilter === 'unconfirmed' && (
              <Badge variant="outline">Filtered</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers</CardTitle>
          <CardDescription>
            Manage your newsletter subscribers and their confirmation status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subscribers found.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Subscribed</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        {subscriber.confirmed ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Unconfirmed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscriber.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleToggleConfirmation(subscriber)}
                            >
                              {subscriber.confirmed ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  <span>Mark as Unconfirmed</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>Mark as Confirmed</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                window.open(`mailto:${subscriber.email}`, '_blank');
                              }}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Send Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedSubscriber(subscriber);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscriber</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscriber? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubscriber && (
            <div className="py-4">
              <p className="font-medium">{selectedSubscriber.email}</p>
              <p className="text-sm text-muted-foreground">
                Subscribed on {format(new Date(selectedSubscriber.created_at), 'MMMM d, yyyy')}
              </p>
            </div>
          )}
          
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
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterSubscribersManager;
