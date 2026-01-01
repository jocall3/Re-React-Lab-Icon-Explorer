
import React, { useState, useEffect, useRef } from 'react';
import { IconGallery } from './components/IconGallery';
import { HookLab } from './components/HookLab';
import { geminiService } from './services/gemini';
import { ChatMessage } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hooks' | 'icons'>('hooks');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hi! I've analyzed your custom React polyfill code. It uses a singleton cache system for hooks and includes a massive emoji mapping. What would you like to know about it?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await geminiService.sendMessage(userMsg);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 overflow-hidden max-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
            <i className="fa-solid fa-atom"></i>
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight">Re-React Lab</h1>
            <span className="text-[10px] uppercase font-bold text-slate-500">v0.1 Polyfill UI</span>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('hooks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'hooks' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <i className="fa-solid fa-vial"></i>
            <span className="font-medium text-sm">Hook Runtime Lab</span>
          </button>
          <button 
            onClick={() => setActiveTab('icons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'icons' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <i className="fa-solid fa-icons"></i>
            <span className="font-medium text-sm">Icon Registry</span>
          </button>
        </nav>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-400">Gemini 3 Pro Online</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            AI Assistant is calibrated for the provided polyfill code logic.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span className="text-slate-400">Dashboard</span>
            <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
            <span className="text-blue-600 capitalize">{activeTab} View</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fa-solid fa-bell"></i>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/32/32" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-4 lg:p-8 gap-8">
          {/* Active Tool View */}
          <div className="flex-[3] min-h-0 flex flex-col gap-6">
            {activeTab === 'hooks' ? <HookLab /> : <IconGallery />}
          </div>

          {/* AI Side Panel */}
          <div className="flex-[2] min-h-0 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-wand-magic-sparkles text-blue-600"></i>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Logic Analyzer</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">AI-GEN</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the code structure..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
