import { Contact } from '@/integrations/supabase/types/contacts';
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageDetailProps {
  selectedMessage: Contact | null;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  formatDate: (dateStr: string) => string;
}

export const MessageDetail = ({
  selectedMessage,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onRestore,
  onDelete,
  onBack,
  formatDate,
}: MessageDetailProps) => {
  return (
    <div className="overflow-y-auto p-6 bg-gray-50">
      <AnimatePresence mode="wait">
        {selectedMessage ? (
          <motion.div
            key={selectedMessage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
              <div className="flex space-x-2">
                {selectedMessage.read ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsUnread(selectedMessage.id)}
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Mark unread
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(selectedMessage.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Mark read
                  </Button>
                )}

                {selectedMessage.archived ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRestore(selectedMessage.id)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Restore
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onArchive(selectedMessage.id)}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => onDelete(selectedMessage.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedMessage.email}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {formatDate(selectedMessage.created_at)}
                </p>
              </div>

              <div className="border-t pt-4 mt-2">
                <p className="whitespace-pre-line">{selectedMessage.message}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-500"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to list
              </Button>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-blue bg-brand-blue/10 rounded-md hover:bg-brand-blue/20"
              >
                <Mail className="h-4 w-4 mr-1" />
                Reply via Email
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-gray-500"
          >
            <MessageSquare className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg">Select a message to view details</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
