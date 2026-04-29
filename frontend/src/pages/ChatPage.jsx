import { useEffect, useState } from 'react';
import { useDocumentStore } from '../hooks/useDocumentStore.js';
import { chatMessage } from '../services/api.js';
import { getRoleByValue } from '../utils/resumeRoles.js';

export function ChatPage() {
  const { selectedRole } = useDocumentStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // initial welcome
    const roleLabel = getRoleByValue(selectedRole).label;
    setMessages([{ from: 'bot', text: `Hi — I can run a quick interview for ${roleLabel}. Type 'interview' to get questions.` }]);
  }, [selectedRole]);

  const send = async (text) => {
    setMessages((m) => [...m, { from: 'user', text }]);
    setLoading(true);
    try {
      const res = await chatMessage({ role: selectedRole, message: text });
      const reply = res.response;
      if (Array.isArray(reply)) {
        // append all questions in one update
        setMessages((m) => [...m, ...reply.map((q) => ({ from: 'bot', text: q }))]);
      } else if (reply && typeof reply === 'object') {
        setMessages((m) => [...m, { from: 'bot', text: JSON.stringify(reply) }]);
      } else {
        setMessages((m) => [...m, { from: 'bot', text: String(reply) }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: 'Error: could not reach chat service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold">Interview Assistant</h2>
        <p className="mt-2 text-sm text-slate-600">Quickly generate role-specific interview questions or run a short mock interview.</p>

        <div className="mt-6 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`rounded-lg p-3 ${m.from === 'bot' ? 'bg-slate-50' : 'bg-ink text-white'}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input id="chat-input" className="flex-1 rounded-full border px-4 py-2" placeholder="Type 'interview' or ask for questions" />
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('chat-input');
              if (el && el.value) {
                send(el.value);
                el.value = '';
              }
            }}
            disabled={loading}
            className="rounded-full bg-ink px-4 py-2 text-white"
          >
            Send
          </button>
        </div>
      </section>

      <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold">Quick actions</h3>
        <div className="mt-4 flex flex-col gap-2">
          <button className="rounded-full border px-4 py-2 text-sm" onClick={() => send('interview')}>Start interview</button>
          <button className="rounded-full border px-4 py-2 text-sm" onClick={() => send('questions')}>Get questions</button>
        </div>
      </aside>
    </div>
  );
}
