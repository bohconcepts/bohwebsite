import { useState, useEffect } from "react";
import { Contact } from "@/integrations/supabase/types/contacts";
import {
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} from "@/integrations/supabase/services/contactService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "./SearchBar";
import { MessageList } from "./MessageList";
import { MessageDetail } from "./MessageDetail";
import { useToast } from "@/hooks/use-toast";

interface MessageManagementProps {}

export const MessageManagement = ({}: MessageManagementProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Contact[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    archived: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);

  // Filter messages based on active tab and search query
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      searchQuery === "" ||
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "inbox") return !message.archived && matchesSearch;
    if (activeTab === "archived") return message.archived && matchesSearch;
    return matchesSearch;
  });

  const handleSelectMessage = (message: Contact) => {
    if (!message.read) {
      handleMarkAsRead(message.id);
    }
    setSelectedMessage(message);
  };

  // Load messages
  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getContactMessages();

      if (error) {
        toast({
          title: "Error",
          description: `Failed to load messages: ${error}`,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setMessages(data);

        // Calculate stats
        const total = data.length;
        const unread = data.filter((msg) => !msg.read).length;
        const archived = data.filter((msg) => msg.archived).length;

        setStats({
          total,
          unread,
          archived,
        });
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle message actions
  const handleMarkAsRead = async (id: string) => {
    try {
      const { success, error } = await updateContactMessage(id, { read: true });

      if (success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
        );
        setStats((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      } else if (error) {
        toast({
          title: "Error",
          description: `Failed to mark as read: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsUnread = async (id: string) => {
    try {
      const { success, error } = await updateContactMessage(id, {
        read: false,
      });

      if (success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, read: false } : msg))
        );
        setStats((prev) => ({ ...prev, unread: prev.unread + 1 }));
      } else if (error) {
        toast({
          title: "Error",
          description: `Failed to mark as unread: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error marking as unread:", error);
      toast({
        title: "Error",
        description: "Failed to mark as unread",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const { success, error } = await updateContactMessage(id, {
        archived: true,
      });

      if (success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, archived: true } : msg))
        );
        setStats((prev) => ({ ...prev, archived: prev.archived + 1 }));

        // If the archived message was selected, clear selection
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else if (error) {
        toast({
          title: "Error",
          description: `Failed to archive message: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error archiving message:", error);
      toast({
        title: "Error",
        description: "Failed to archive message",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const { success, error } = await updateContactMessage(id, {
        archived: false,
      });

      if (success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, archived: false } : msg))
        );
        setStats((prev) => ({
          ...prev,
          archived: Math.max(0, prev.archived - 1),
        }));
      } else if (error) {
        toast({
          title: "Error",
          description: `Failed to restore message: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error restoring message:", error);
      toast({
        title: "Error",
        description: "Failed to restore message",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { success, error } = await deleteContactMessage(id);

      if (success) {
        const deletedMessage = messages.find((msg) => msg.id === id);
        setMessages((prev) => prev.filter((msg) => msg.id !== id));

        // Update stats
        setStats((prev) => ({
          total: prev.total - 1,
          unread:
            deletedMessage && !deletedMessage.read
              ? prev.unread - 1
              : prev.unread,
          archived:
            deletedMessage && deletedMessage.archived
              ? prev.archived - 1
              : prev.archived,
        }));

        // If the deleted message was selected, clear selection
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }

        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
      } else if (error) {
        toast({
          title: "Error",
          description: `Failed to delete message: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  // Format date string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Load messages on component mount
  useEffect(() => {
    loadMessages();
  }, []);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Message Management</CardTitle>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onClearSearch={handleClearSearch}
            onRefresh={loadMessages}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="inbox"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="border-b px-6">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="inbox"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-brand-blue data-[state=active]:shadow-none rounded-none"
              >
                Inbox
                {stats.unread > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {stats.unread}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-brand-blue data-[state=active]:shadow-none rounded-none"
              >
                Archived
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid md:grid-cols-2 h-[600px]">
            {/* Message List */}
            <div className="border-r overflow-y-auto">
              <TabsContent value="inbox" className="m-0 h-full">
                <MessageList
                  messages={filteredMessages}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                  selectedMessage={selectedMessage}
                  activeTab={activeTab}
                  onSelectMessage={handleSelectMessage}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAsUnread={handleMarkAsUnread}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  onClearSearch={handleClearSearch}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="archived" className="m-0 h-full">
                <MessageList
                  messages={filteredMessages}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                  selectedMessage={selectedMessage}
                  activeTab={activeTab}
                  onSelectMessage={handleSelectMessage}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAsUnread={handleMarkAsUnread}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  onClearSearch={handleClearSearch}
                  formatDate={formatDate}
                />
              </TabsContent>
            </div>

            {/* Message Detail View */}
            <MessageDetail
              selectedMessage={selectedMessage}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onArchive={handleArchive}
              onRestore={handleRestore}
              onDelete={handleDelete}
              onBack={() => setSelectedMessage(null)}
              formatDate={formatDate}
            />
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
