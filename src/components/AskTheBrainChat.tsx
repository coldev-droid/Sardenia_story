import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { MessageSquareCode, Send, Sparkles, RefreshCw, Bot, User } from 'lucide-react';

export const AskTheBrainChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Greetings, Author. I am 'The Brain', your master literary intelligence for your 5 Sardinia magical adventure books. Ask me anything about plot pacing, Sardinian mythology, character arcs, or how to make your manuscript award-winning.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/brain-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to consult The Brain');

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: data.advice,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: `Error connecting to The Brain: ${err.message || 'Please check your API key.'}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 p-6 rounded-2xl border border-amber-900/40 shadow-xl flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <MessageSquareCode className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
            Ask The Brain Co-Author
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Consult your AI literary strategist for story twists, character development, and Sardinian lore integration.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-xl overflow-hidden flex flex-col h-[550px]">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${isAssistant ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isAssistant
                      ? 'bg-amber-600/20 border border-amber-500/40 text-amber-400'
                      : 'bg-stone-800 border border-stone-700 text-stone-200'
                  }`}
                >
                  {isAssistant ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div
                  className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-stone-950 border border-stone-800 text-stone-200 font-serif'
                      : 'bg-amber-600 text-stone-100'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>
                  <div className={`text-[10px] mt-2 ${isAssistant ? 'text-stone-400' : 'text-amber-200'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-400 text-xs flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>The Brain is formulating literary guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-stone-950 border-t border-stone-800 flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask The Brain about plot structure, Nuragic lore, or character arcs..."
            className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-100 font-medium text-sm transition shadow-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
