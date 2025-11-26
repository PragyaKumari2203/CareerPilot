import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm your AI Career Assistant 🤖\n\nI can help you with resume tips, career advice, skill recommendations, and interview preparation. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "How can I improve my resume?",
    "What skills should I learn?",
    "Tips for job interviews",
    "Career path suggestions",
  ];

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ✅ Handle sending message + fetch Gemini response
  const handleSendMessage = async (customInput?: string) => {
    const query = customInput ?? input;
    if (!query.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Send message to backend (Gemini API route)
      const res = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const aiResponse = data.reply ?? "Sorry, I couldn’t get a response.";

      // Add assistant reply
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "⚠️ Error: Unable to fetch AI response.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ✅ Quick prompt handler
  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 size-12 sm:size-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50">
        <MessageSquare className="size-6" />
      </button>
    );
  }

  // Main chat window
  return (
    <Card className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[500px] sm:h-[600px] max-w-[calc(100vw-2rem)] shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="size-6 sm:size-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
  <Sparkles className="size-3 sm:size-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base">AI Career Assistant</h4>
<p className="text-xs text-primary-foreground/80 hidden sm:block">Always here to help</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="p-3 sm:p-4 h-[350px] sm:h-[450px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="size-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="size-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
  <div className="p-3 sm:p-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs px-3 py-1 bg-accent hover:bg-accent/80 rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button onClick={() => handleSendMessage()} size="sm">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}