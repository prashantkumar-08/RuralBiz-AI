import React, { useState, useRef, useEffect } from 'react';
import { getTranslation } from '../../i18n/translations';
import { Send, Mic, Volume2, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft, Bot, Sparkles, CheckCheck } from 'lucide-react';

export default function WhatsAppChat({ currentLang }) {
  const t = (key) => getTranslation(currentLang, key);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste! 🙏 I am your **RuralBiz AI WhatsApp Advisor**.\n\nI can help you:\n• Start a profitable business with **₹1 Lakh**\n• Calculate your **35% PMEGP subsidy**\n• Check **Mandi prices** and bank loans\n\nWhat business or capital are you planning for?`,
      time: '10:02 AM',
      quickReplies: ['₹1 Lakh Best Businesses', 'Dairy Farming Feasibility', '35% PMEGP Subsidy', 'Mandi Commodity Rates']
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, language: currentLang })
      });
      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.text,
        source: data.source,
        quickReplies: data.quickReplies || ['PMEGP Subsidy', 'Calculate Loan', 'Mandi Rates'],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Namaste! With ₹1 Lakh capital, Dairy Farming or a Spices Grinding Unit offers up to 35% PMEGP government subsidy and high daily rural demand.',
          quickReplies: ['Dairy Farming', 'Spices Unit', 'Calculate EMI'],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simulate rural voice note input
  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSend('I have ₹1 Lakh capital. What business can I start in my village?');
    }, 2000);
  };

  // Text-to-speech audio playback
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#•-]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Mobile WhatsApp Outer Frame */}
      <div className="bg-[#efeae2] rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col h-[700px]">
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-lg font-bold border-2 border-white/20">
                🌾
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm leading-none">RuralBiz AI Mitra</span>
                <span className="bg-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-semibold text-emerald-200 uppercase">
                  Official
                </span>
              </div>
              <span className="text-[11px] text-emerald-200">Online • SIH 2026 Advisory Bot</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-emerald-100">
            <button
              onClick={() => handleSpeak(messages[messages.length - 1]?.text || 'Namaste')}
              title="Voice Readout"
              className="hover:text-white p-1 rounded-full hover:bg-emerald-800"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <Video className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" />
            <Phone className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" />
            <MoreVertical className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" />
          </div>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="text-center my-2">
            <span className="bg-amber-100/90 text-amber-950 text-[10px] font-semibold px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
              🔒 End-to-End Encrypted • Powered by Gemini & Heuristic Rules
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs relative ${
                  msg.sender === 'user'
                    ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                    : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                }`}
              >
                {/* Message Text formatted */}
                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                {/* Footer Time & Checks */}
                <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-slate-400">
                  {msg.source && (
                    <span className="text-[9px] font-semibold text-emerald-700 mr-1">
                      {msg.source}
                    </span>
                  )}
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && (
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
              </div>

              {/* Bot Quick Reply Buttons */}
              {msg.sender === 'bot' && msg.quickReplies && (
                <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                  {msg.quickReplies.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => handleSend(reply)}
                      className="bg-white hover:bg-emerald-50 text-rural-dark text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-300 shadow-2xs transition-all hover:scale-102"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 bg-white text-slate-500 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none w-fit border border-slate-100 shadow-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-200" />
              <span className="font-medium text-[11px] text-slate-500">RuralBiz AI is structuring advice...</span>
            </div>
          )}

          {isRecording && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-3 animate-pulse">
              <Mic className="w-4 h-4 text-red-600 animate-ping" />
              <span>Listening to voice query: "I have ₹1 Lakh capital. What business can I start in my village?"...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Message Input Bar */}
        <div className="bg-[#f0f2f5] p-3 flex items-center gap-2 border-t border-slate-200 flex-shrink-0">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 p-1.5 rounded-full"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 p-1.5 rounded-full"
            title="Attach Document / DPR"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('typeMessagePlaceholder')}
            className="flex-1 bg-white text-xs py-2.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:border-rural text-slate-800 placeholder-slate-400"
          />

          {input.trim() ? (
            <button
              type="button"
              onClick={() => handleSend()}
              className="bg-[#00a884] hover:bg-[#008069] text-white p-2.5 rounded-full shadow-md transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSimulateVoice}
              title="Voice Input (Mic)"
              className={`p-2.5 rounded-full text-white shadow-md transition-all ${
                isRecording ? 'bg-red-600 scale-110 animate-ping' : 'bg-[#00a884] hover:bg-[#008069]'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
