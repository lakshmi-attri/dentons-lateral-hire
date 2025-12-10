"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Upload, Mic, MicOff, Send, FileText, Loader2, Bot, User, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string }>>([
    {
      type: "ai",
      content: "Hi! I'm your Application Assistant. I can help you fill out your application by analyzing your documents, listening to your voice, or answering your questions. How can I assist you today?",
    },
  ]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
          content: "I understand your request. I can help you with that. Would you like me to fill in your application fields, or do you need assistance with something specific?",
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setMessages((prev) => [
      ...prev,
      { type: "user", content: `Uploaded: ${file.name}` },
      { type: "ai", content: "Processing your document..." },
    ]);

    // Simulate processing (in real app, this would call an API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          type: "ai",
          content: `I've analyzed your ${file.name}. I found information about your education, work history, and contact details. Would you like me to auto-fill your application with this information?`,
        },
      ]);
      setIsProcessing(false);
    }, 2000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        setMessages((prev) => [
          ...prev,
          { type: "user", content: "Voice recording received" },
          { type: "ai", content: "Processing your voice input..." },
        ]);

        // Simulate processing (in real app, this would call an API)
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              type: "ai",
              content:
                "I've transcribed your voice input and extracted relevant information. Should I fill in the application fields with this data?",
            },
          ]);
          setIsProcessing(false);
        }, 2000);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "Sorry, I couldn't access your microphone. Please check your browser permissions.",
        },
      ]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAutoFill = () => {
    setMessages((prev) => [
      ...prev,
      { type: "user", content: "Yes, please auto-fill my application" },
      { type: "ai", content: "Perfect! I'm filling in your application fields now. Please review and adjust as needed." },
    ]);
    // In real app, this would trigger auto-fill functionality
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
        aria-label="Open Application Assistant"
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
                  <h3 className="font-semibold text-white text-sm">Application Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-xs text-white/90">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-white hover:bg-white/20 transition-all p-1.5 rounded-lg"
                aria-label="Close Application Assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

          {/* Chat Messages */}
          <div 
            className="flex-1 overflow-y-auto bg-white"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
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
          <div className={cn(
            "border-t border-[#e5e0e7] bg-[#fafafa] p-4 transition-all duration-200",
            dragActive && "bg-primary/5 border-primary border-dashed"
          )}>
            {/* File Upload and Voice Recording Icons */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-[#f0eef1] text-[#7c6b80] hover:text-[#1c151d] transition-all hover:scale-110 active:scale-95"
                aria-label="Upload file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "p-2 rounded-lg transition-all hover:scale-110 active:scale-95",
                  isRecording
                    ? "bg-red-100 text-red-600 hover:bg-red-200 shadow-lg ring-2 ring-red-200"
                    : "hover:bg-[#f0eef1] text-[#7c6b80] hover:text-[#1c151d]"
                )}
                disabled={isProcessing}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4 animate-pulse" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Text Input */}
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Application Assistant..."
                  className="min-h-[44px] max-h-[200px] resize-none pr-12 bg-[#f7f6f8] border-[#e5e0e7] focus:border-primary focus:bg-white rounded-xl transition-all shadow-sm focus:shadow-md"
                  rows={1}
                  disabled={isProcessing}
                />
                {isRecording && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-full">
                    <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-xs text-red-600 font-medium">Recording</span>
                  </div>
                )}
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

            {/* File input (hidden) */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </>
  );
}

