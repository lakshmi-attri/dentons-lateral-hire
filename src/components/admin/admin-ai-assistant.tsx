"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AdminAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string }>>([
    {
      type: "ai",
      content: "Hello! I'm your AI assistant for lateral partner recruitment. I can help you analyze candidates, identify opportunities, and answer questions about your pipeline.\n\nTry asking me:\n• Which candidates have the highest portable revenue?\n• Show me candidates with potential conflicts\n• Compare candidates\n• What practice areas are most represented?\n• Who has the longest client relationships?",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !isProcessing) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "I understand your request. Let me analyze the candidate data and provide you with insights. Would you like me to search for specific information or compare candidates?",
        },
      ]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
        aria-label="Open Lateral Hiring Assistant"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Chat Window */}
      <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] animate-in fade-in slide-in-from-bottom-4 slide-in-from-right-4 duration-300">
        <div className="flex flex-col h-full shadow-2xl bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Lateral Hiring Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-xs text-white/90">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-white hover:bg-white/20 transition-all p-1.5 rounded-lg"
                aria-label="Close Lateral Hiring Assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

          {/* Chat Messages */}
          <div 
            className="flex-1 overflow-y-auto bg-white"
          >
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-110",
                      message.type === "user"
                        ? "bg-primary text-white ring-2 ring-primary/20"
                        : "bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-2 ring-primary/10"
                    )}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md",
                        message.type === "user"
                          ? "bg-gradient-to-br from-primary to-primary/90 text-white"
                          : "bg-white text-[#1c151d] border border-[#e5e0e7]"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center shrink-0 ring-2 ring-primary/10">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white border border-[#e5e0e7] rounded-2xl px-4 py-3 inline-flex items-center gap-2 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-[#7c6b80]">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-[#e5e0e7] bg-[#fafafa] p-4 transition-all duration-200">
            {/* Text Input */}
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about candidates..."
                  className="min-h-[44px] max-h-[200px] resize-none pr-12 bg-[#f7f6f8] border-[#e5e0e7] focus:border-primary focus:bg-white rounded-xl transition-all shadow-sm focus:shadow-md"
                  rows={1}
                  disabled={isProcessing}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="h-[44px] w-[44px] p-0 rounded-xl bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

