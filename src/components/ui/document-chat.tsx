import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Loader2, Send, X, MessageSquare, Phone, FileText, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { useLanguage } from '../../contexts/LanguageContext';
import { chatService } from '../../integrations/ai/services/chatService';

// Define a simplified API chat message type for UI purposes
interface APIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DocumentChatProps {
  className?: string;
}

type ChatMethod = 'direct' | 'whatsapp';

const DocumentChat: React.FC<DocumentChatProps> = ({ className }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<APIChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatMethod, setChatMethod] = useState<ChatMethod>('direct');
  const [sources, setSources] = useState<
    Array<{ documentId: string; title: string; relevance: number }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  useEffect(() => {
    const initSession = async () => {
      try {
        // Check for existing session in localStorage
        const existingSessionId = localStorage.getItem("chat_session_id");

        if (existingSessionId) {
          setSessionId(existingSessionId);
          // Load existing messages
          const history = await chatService.getChatHistory(existingSessionId);
          // Convert DB messages to API messages format
          const apiMessages = history.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
          setMessages(apiMessages);
        } else {
          // Create new session
          const newSessionId = await chatService.createChatSession();
          setSessionId(newSessionId);
          localStorage.setItem("chat_session_id", newSessionId);
        }
      } catch (error) {
        console.error("Error initializing chat session:", error);
      }
    };

    initSession();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChatOpen = () => {
    setIsOpen(true);
  };

  const handleChatClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Clear chat history
  const handleClearChat = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      // Clear chat history in the database
      const success = await chatService.clearChatHistory(sessionId);
      
      if (success) {
        // Clear messages in the UI
        setMessages([]);
        setSources([]);
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !sessionId) return;

    // If WhatsApp is selected, redirect to WhatsApp
    if (chatMethod === 'whatsapp') {
      const whatsappNumber = '1234567890'; // Replace with your actual WhatsApp number
      const encodedMessage = encodeURIComponent(input);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      setInput("");
      return;
    }

    // Continue with direct chat
    const userMessage: APIChatMessage = {
      role: "user",
      content: input,
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Save user message to database with required fields
      if (sessionId) {
        await chatService.saveChatMessage(sessionId, {
          role: userMessage.role,
          content: userMessage.content
        });
      }

      // Generate response
      const response = await chatService.generateResponse(messages, input);

      // Add assistant message to chat
      const assistantMessage: APIChatMessage = {
        role: "assistant",
        content: response.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSources(response.sources);

      // Save assistant message to database with required fields
      if (sessionId) {
        await chatService.saveChatMessage(sessionId, {
          role: assistantMessage.role,
          content: assistantMessage.content
        });
      }
    } catch (error) {
      console.error("Error generating response:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("Sorry, I encountered an error. Please try again later."),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleChatOpen}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
          aria-label={t("Chat with us")}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="white"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="white"
                className="h-5 w-5"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <h3 className="font-medium">{t("Chat with us")}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearChat}
                className="text-white hover:text-gray-200"
                aria-label={t("Clear chat history")}
                disabled={loading || messages.length === 0}
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleChatClose}
                className="text-white hover:text-gray-200"
                aria-label={t("Close chat")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t("Ask me anything about our documents!")}</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {/* Sources section */}
            {sources.length > 0 && (
              <div className="border-t border-gray-200 pt-2 mt-4">
                <p className="text-xs text-gray-500 mb-1">{t("Sources")}:</p>
                <div className="space-y-1">
                  {sources.map((source, index) => (
                    <div key={index} className="text-xs flex items-center">
                      <FileText className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-gray-600">{source.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  <span className="text-gray-500 text-sm">
                    {t("Thinking...")}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Method Selector */}
          <div className="p-3 border-t border-gray-200">
            <Select value={chatMethod} onValueChange={(value) => setChatMethod(value as ChatMethod)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select chat method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>{t("Direct Chat")}</span>
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{t("WhatsApp")}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder={chatMethod === 'direct' 
                  ? t("Ask a question about our documents...") 
                  : t("Type your WhatsApp message...")}
                value={input}
                onChange={handleInputChange}
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="shrink-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">{t("Send")}</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DocumentChat;
