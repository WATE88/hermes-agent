import { useEffect, useState, useRef } from "react";
import { Send, Loader2, Circle, Bot, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是 Hermes AI 助手。有什么可以帮助你的吗？",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();

      // Handle both formats: with or without "ok" field
      if (response.ok && (data.message || data.ok)) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message || "收到响应",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setConnected(true);
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `错误: ${data.error || data.detail || "未知错误"}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `连接错误: ${err instanceof Error ? err.message : "无法连接到服务器"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "你好！我是 Hermes AI 助手。有什么可以帮助你的吗？",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Hermes Chat</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Circle
                className={`h-2 w-2 ${connected ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500"}`}
              />
              <span>{connected ? "在线" : "离线"}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat}>
          <RefreshCw className="h-4 w-4 mr-1" />
          新会话
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-primary" : "bg-secondary"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-secondary-foreground" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              <div className="text-xs opacity-50 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">思考中...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            disabled={loading}
            className="flex-1 h-10"
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            size="lg"
            className="px-4"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
