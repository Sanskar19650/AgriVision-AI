import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Volume2,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Sprout,
  ShieldAlert,
  HelpCircle,
  VolumeX
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { askGeminiAgronomist } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useAuth } from '../context/AuthContext';

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste ${user?.fullName || 'Farmer'}! I am your AgriVision AI Agronomist, powered by Google Gemini 3.8 Flash.\n\nI can assist you with:\n• **Plant Pathology:** Identifying diseases, deficiency symptoms, and organic fungicide recipes.\n• **Soil Nutrition:** Custom NPK calculation, biofertilizer consortiums, and micro-nutrients.\n• **Government Schemes:** Subsidies for drip irrigation (PMKSY), crop insurance (PMFBY), and Soil Health Cards.\n• **Weather Strategy:** Safe foliar spraying windows and rain precautions.\n\nWhat crop or field challenge are you facing today?`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'How to treat leaf curl in chilli organically?',
    'Optimal fertilizer schedule for high-yield wheat?',
    'What biological control works best against aphids?',
    'How to apply for PMKSY 55% subsidy on drip irrigation?',
    'What crops are best suited for black soil in Maharashtra?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'model' as const,
        parts: m.text
      }));

      const res = await askGeminiAgronomist(query, history);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toISOString(),
        category: res.category
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ I encountered an error communicating with the agronomy engine: ${err.message}. Please check your connection or try again.`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown before speaking
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: 'welcome-fresh',
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you with your crops today?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              AI Agricultural Assistant
            </h1>
            <Badge variant="emerald" size="sm">Gemini 3.8 Flash Agronomist</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Multilingual agronomy advisor specializing in Indian farming practices, organic remedies, and government schemes.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-stone-400" />
          Clear Chat
        </button>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="font-bold text-stone-400 shrink-0 uppercase tracking-wider text-[10px] pl-1">
          Suggestions:
        </span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-stone-700 whitespace-nowrap transition-all shadow-2xs font-medium text-xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col h-[560px]">
        
        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {isUser ? <Sprout className="w-5 h-5" /> : <BotMessageSquare className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-stone-50 border border-stone-200/80 text-stone-800 rounded-tl-none shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>

                  {!isUser && (
                    <div className="flex items-center gap-2 pt-1 pl-1 text-[11px] text-stone-400">
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="hover:text-stone-700 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <span>•</span>

                      <button
                        onClick={() => handleSpeak(m.text)}
                        className="hover:text-stone-700 flex items-center gap-1 transition-colors"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-rose-500 font-semibold">Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Listen (TTS)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                <span>Consulting Gemini agricultural knowledgebase...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-stone-200/80 bg-stone-50/50 rounded-b-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pest management, fertilizer ratios, rainfall, or subsidies..."
              className="flex-1 px-4 py-3 rounded-2xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-xs bg-white outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
