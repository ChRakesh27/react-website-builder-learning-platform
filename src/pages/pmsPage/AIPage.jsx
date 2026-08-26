import { useState, useRef, useEffect } from 'react';
import { aiApi } from '../../api/ai';
import { auth } from '../../api/auth';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI project assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    const nextMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(nextMessages);

    try {
      const { data: user } = await auth.currentUser();
      const history = nextMessages.slice(-5).map(({ role, content }) => ({ role, content }));
      const response = await aiApi.chat(userMessage, history, user?.id);
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your request. Make sure the AI backend is running on localhost:5000.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto border rounded-xl overflow-hidden bg-background shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Bot className="size-5" />
        </div>
        <div>
          <h2 className="font-semibold">AI Assistant</h2>
          <p className="text-xs text-muted-foreground">Powered by Pydantic AI & GPT-4-Nano</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`shrink-0 size-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border'
            }`}>
              {msg.role === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}
            </div>
            <div className={`p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted/50 rounded-tl-sm whitespace-pre-wrap'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="shrink-0 size-8 rounded-full flex items-center justify-center bg-muted border">
              <Bot className="size-4" />
            </div>
            <div className="p-4 rounded-2xl bg-muted/50 rounded-tl-sm flex items-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2 relative items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your projects, tasks, or request an action..."
            rows={3}
            className="flex-1 p-3 px-4 rounded-2xl border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1 top-1 bottom-1 aspect-square rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            <Send className="size-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
