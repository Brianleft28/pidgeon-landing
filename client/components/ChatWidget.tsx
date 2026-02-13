import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { useTranslation } from '../App';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const LOCAL_STORAGE_KEY = 'pidgeonChatHistory';

export const ChatWidget: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          // FIX: The original type cast `as Message[]` was unsafe and hid a type error.
          // We must validate the data from localStorage to ensure it matches the `Message` type.
          const validHistory: Message[] = parsedHistory.filter(
              (m: any): m is Message =>
              (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
          );

          if (validHistory.length > 0) {
              setMessages(validHistory);
              return;
          }
        }
      }
      setMessages([{ role: 'assistant', content: t.chat.initial }]);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages([{ role: 'assistant', content: t.chat.initial }]);
    }
  }, [t.chat.initial]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 1 || (messages.length === 1 && messages[0].content !== t.chat.initial)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [messages, t.chat.initial]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    // FIX: Explicitly type newUserMessage and currentMessages to prevent type widening issues
    // that can occur during complex type inference within the same function scope.
    const newUserMessage: Message = { role: 'user', content: userMsg };
    const currentMessages: Message[] = [...messages, newUserMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const history = currentMessages.slice(0, -1)
          .filter(m => m.content)
          .map(msg => {
            // FIX: Explicitly define the role type to prevent potential mis-inference by TypeScript.
            // The role for the Gemini API history must be 'user' or 'model'.
            const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';
            return {
              role,
              parts: [{ text: msg.content }]
            };
          });

        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          history: history,
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
            systemInstruction: "You are the advanced AI Core of Pidgeon Solutions. Your persona is technical, precise, and helpful. You reside in a terminal interface. You are an expert in software architecture, automation, and digital infrastructure. Keep responses concise and technical unless asked to explain simply."
          }
        });
      }

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => {
            const updatedMessages = [...prev];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = fullText;
            }
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: t.chat.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ role: 'assistant', content: t.chat.initial }]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    chatSessionRef.current = null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto transition-all duration-300 ease-out origin-bottom-right mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/95 backdrop-blur-md shadow-2xl flex flex-col font-mono text-sm
          ${isOpen ? 'w-80 sm:w-96 h-[500px] opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-90'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-bold text-slate-400">PIDGEON CORE // TERMINAL</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearChat}
              title="Clear chat history"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] break-words ${
                  msg.role === 'user' 
                    ? 'text-emerald-400' 
                    : 'text-slate-300'
                }`}
              >
                <span className="mr-2 opacity-50">{msg.role === 'user' ? '>' : '#'}</span>
                {msg.content}
                {isLoading && msg.role === 'assistant' && idx === messages.length - 1 && (
                  <span className="inline-block w-2 h-4 ml-1 align-middle bg-emerald-500 animate-pulse"></span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">{'>'}</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chat.placeholder}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-mono"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 border border-slate-700 ${
          isOpen ? 'bg-slate-800 text-white' : 'bg-slate-900 text-emerald-500 hover:bg-slate-800 hover:text-emerald-400'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        )}
      </button>
    </div>
  );
};