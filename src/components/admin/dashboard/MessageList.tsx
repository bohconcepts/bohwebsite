import { Contact } from "@/integrations/supabase/types/contacts";
import {
  Mail,
  Archive,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageListProps {
  messages: Contact[];
  isLoading: boolean;
  searchQuery: string;
  selectedMessage: Contact | null;
  activeTab: string;
  onSelectMessage: (message: Contact) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onClearSearch: () => void;
  formatDate: (dateStr: string) => string;
}

export const MessageList = ({
  messages,
  isLoading,
  searchQuery,
  selectedMessage,
  activeTab,
  onSelectMessage,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onRestore,
  onDelete,
  onClearSearch,
  formatDate,
}: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        {activeTab === "inbox" ? (
          <Mail className="h-12 w-12 mb-2 text-gray-300" />
        ) : (
          <Archive className="h-12 w-12 mb-2 text-gray-300" />
        )}
        <p>No {activeTab === "inbox" ? "" : "archived "}messages found</p>
        {searchQuery && (
          <Button
            variant="ghost"
            className="mt-2 text-brand-blue"
            onClick={onClearSearch}
          >
            Clear search
          </Button>
        )}
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {messages.map((message) => (
        <li
          key={message.id}
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedMessage?.id === message.id ? "bg-gray-50" : ""
          } ${!message.read ? "border-l-4 border-brand-orange" : ""}`}
          onClick={() => onSelectMessage(message)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-medium ${!message.read ? "font-bold" : ""}`}>
                {message.subject}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                From: {message.name} ({message.email})
              </p>
            </div>
            <div className="flex items-center">
              {!message.read && <Badge className="bg-brand-orange">New</Badge>}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {message.read ? (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsUnread(message.id);
                      }}
                    >
                      <EyeOff className="mr-2 h-4 w-4" />
                      Mark as unread
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(message.id);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Mark as read
                    </DropdownMenuItem>
                  )}

                  {activeTab === "inbox" ? (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive(message.id);
                      }}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(message.id);
                      }}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Restore to inbox
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(message.id);
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {formatDate(message.created_at)}
          </p>
        </li>
      ))}
    </ul>
  );
};
