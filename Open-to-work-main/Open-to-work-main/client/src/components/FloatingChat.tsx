import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const API_URL = "http://localhost:5000";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"info" | "chat">("info");
  const [messages, setMessages] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleStartChat = () => {
    if (!name.trim() || !email.trim()) {
      alert("Please enter your name and email");
      return;
    }
    setStep("chat");
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    const currentMessage = message;
    setMessage("");
    setMessages((prev) => [...prev, currentMessage]);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: "Live Chat Message",
          message: currentMessage,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch (err) {
      console.error("Chat send error:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center justify-center"
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 text-primary-foreground">
            <h3 className="font-bold text-lg">Chat with Us</h3>
            <p className="text-sm text-primary-foreground/90">We're here to help!</p>
          </div>

          {/* STEP 1 — Ask name & email */}
          {step === "info" && (
            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-600 mb-2">
                Please introduce yourself before chatting 👋
              </p>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Your Name</label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleStartChat} className="w-full">
                Start Chat →
              </Button>
            </div>
          )}

          {/* STEP 2 — Chat */}
          {step === "chat" && (
            <>
              <div className="p-4 h-64 overflow-y-auto bg-muted/20 space-y-3">
                {/* Welcome message */}
                <div className="bg-white p-3 rounded-lg shadow-sm text-sm text-gray-700 w-fit max-w-[80%]">
                  Hello {name}! How can we help you today?
                </div>

                {/* User messages */}
                {messages.map((msg, i) => (
                  <div key={i} className="flex justify-end">
                    <div className="bg-blue-500 text-white p-3 rounded-lg text-sm max-w-[80%]">
                      {msg}
                    </div>
                  </div>
                ))}

                {/* After send confirmation */}
                {sent && (
                  <div className="bg-white p-3 rounded-lg shadow-sm text-sm text-gray-700 w-fit max-w-[80%]">
                    Thanks! We received your message and will get back to you soon. ✅
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChat;