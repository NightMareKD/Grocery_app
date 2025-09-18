import { useEffect, useRef, useState } from 'react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { askRecipe } from '../api/chat';

export default function RecipeChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me for recipes. For example: “quick dinner with chicken and rice”.' }
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setSending(true);
    try {
      const reply = await askRecipe(text);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not fetch a recipe right now.' }]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-8 right-24 z-50 h-14 w-14 rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label={open ? 'Close recipe chat' : 'Open recipe chat'}
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6 mx-auto" />
      </button>

      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-[360px] max-w-[90vw] rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
            <div className="font-semibold text-slate-800">Recipe Assistant</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-slate-100" aria-label="Close">
              <XMarkIcon className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          <div ref={listRef} className="h-72 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask for a recipe..."
                rows={1}
                className="flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={send}
                disabled={sending || !input.trim()}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-white text-sm disabled:opacity-50 hover:bg-emerald-700"
              >
                <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
                Send
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Shift+Enter for new line • Enter to send</p>
          </div>
        </div>
      )}
    </>
  );
}