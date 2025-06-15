import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Loader2, Send, FileText, MessageSquare, Phone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { useLanguage } from '../../contexts/LanguageContext';
import { chatService, ChatMessage } from '../../integrations/ai/services/chatService';

interface DocumentChatProps {
  className?: string;
}

type ChatMethod = 'direct' | 'whatsapp';

const DocumentChat: React.FC<DocumentChatProps> = ({ className }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
          setMessages(history);
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
    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Save user message
      await chatService.saveChatMessage(sessionId, userMessage);

      // Generate response
      const response = await chatService.generateResponse(messages, input);

      // Add assistant message to chat
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSources(response.sources);

      // Save assistant message
      await chatService.saveChatMessage(sessionId, assistantMessage);
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
        <Button
          onClick={handleChatOpen}
          className="rounded-full p-4 shadow-lg bg-primary hover:bg-primary/90"
          aria-label={t("Ask about our documents")}
        >
          <FileText className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <h3 className="font-medium">{t("Document Assistant")}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChatClose}
              className="h-8 w-8 p-0 rounded-full text-white hover:bg-primary/90"
              aria-label={t("Close chat")}
            >
              <span className="sr-only">{t("Close")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
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
