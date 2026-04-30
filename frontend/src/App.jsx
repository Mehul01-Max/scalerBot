import { useState, useRef, useEffect, useCallback } from 'react';
import { PERSONAS } from './personas';
import { sendMessage, changePersona } from './api';

/* ── Inline SVG Icons ── */
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ── Simple markdown-ish renderer ── */
function renderContent(text) {
  if (typeof text !== 'string') return String(text);

  // Split by newlines, process each line
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  for (const line of lines) {
    let processed = line
      // Bold: **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Inline code: `code`
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bullet points
    if (/^\s*[-•]\s/.test(processed)) {
      processed = processed.replace(/^\s*[-•]\s/, '');
      elements.push(
        <li key={i} dangerouslySetInnerHTML={{ __html: processed }} />
      );
    } else if (processed.trim() === '') {
      elements.push(<br key={i} />);
    } else {
      elements.push(
        <p key={i} dangerouslySetInnerHTML={{ __html: processed }} />
      );
    }
    i++;
  }

  return elements;
}

/* ── App Component ── */
export default function App() {
  const [activePersona, setActivePersona] = useState('Anshuman');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const persona = PERSONAS[activePersona];

  // Sync backend persona on first load (fixes desync when page is reopened)
  useEffect(() => {
    changePersona(activePersona).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Auto-dismiss error
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // Switch persona
  const handlePersonaSwitch = useCallback(
    async (key) => {
      if (key === activePersona || loading) return;
      try {
        await changePersona(key);
        setActivePersona(key);
        setMessages([]);
        setInput('');
        inputRef.current?.focus();
      } catch {
        setError('Failed to switch persona. Is the backend running?');
      }
    },
    [activePersona, loading]
  );

  // Send message
  const handleSend = useCallback(
    async (text) => {
      const query = (text || input).trim();
      if (!query || loading) return;

      setInput('');
      setMessages((prev) => [...prev, { role: 'user', content: query }]);
      setLoading(true);
      setError(null);

      try {
        const reply = await sendMessage(query);
        setMessages((prev) => [...prev, { role: 'bot', content: reply }]);
      } catch {
        setError('Something went wrong. Please check the backend and try again.');
      } finally {
        setLoading(false);
      }
    },
    [input, loading]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header__brand">
          <div className="header__logo">S</div>
          <div>
            <div className="header__title">ScalerBot</div>
            <div className="header__subtitle">Talk to Scaler's founders</div>
          </div>
        </div>

        <nav className="persona-tabs" id="persona-switcher">
          {Object.entries(PERSONAS).map(([key, p]) => (
            <button
              key={key}
              id={`persona-tab-${key}`}
              className={`persona-tab ${key === activePersona ? 'persona-tab--active' : ''}`}
              onClick={() => handlePersonaSwitch(key)}
              style={{
                '--tab-color': p.color,
              }}
            >
              <span
                className="persona-tab__dot"
                style={{ background: key === activePersona ? '#fff' : p.color }}
              />
              {p.shortName}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Chat / Welcome ── */}
      <div className="chat" ref={chatRef}>
        {!hasMessages && !loading ? (
          <div className="welcome">
            <div
              className="welcome__avatar"
              style={{ background: persona.color }}
            >
              {persona.emoji}
            </div>
            <h1 className="welcome__heading">{persona.name}</h1>
            <p className="welcome__desc">{persona.description}</p>

            <div className="chips" id="suggestion-chips">
              {persona.chips.map((chip, i) => (
                <button
                  key={i}
                  className="chip"
                  id={`chip-${activePersona}-${i}`}
                  onClick={() => handleSend(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message message--${msg.role === 'user' ? 'user' : 'bot'}`}
              >
                <div
                  className={`message__avatar ${msg.role === 'user' ? 'message__avatar--user' : ''}`}
                  style={
                    msg.role !== 'user'
                      ? { background: persona.color, fontSize: '14px' }
                      : undefined
                  }
                >
                  {msg.role === 'user' ? 'U' : persona.emoji}
                </div>
                <div className="message__bubble">
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="typing">
                <div
                  className="message__avatar"
                  style={{ background: persona.color, fontSize: '14px' }}
                >
                  {persona.emoji}
                </div>
                <div className="typing__dots">
                  <span className="typing__dot" />
                  <span className="typing__dot" />
                  <span className="typing__dot" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Input ── */}
      <div className="input-bar">
        <form className="input-bar__form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            id="chat-input"
            className="input-bar__input"
            type="text"
            placeholder={`Ask ${persona.shortName} something…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="input-bar__send"
            id="send-button"
            disabled={loading || !input.trim()}
          >
            <SendIcon />
          </button>
        </form>
      </div>

      {/* ── Error Toast ── */}
      {error && (
        <div className="error-toast" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
