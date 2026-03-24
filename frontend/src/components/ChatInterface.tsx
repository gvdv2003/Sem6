import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PersonaData {
  slug: string;
  display_name: string;
  description: string;
  avatar: {
    portrait: string;
    background: string;
  };
  predefined_prompts: string[];
}

interface ChatInterfaceProps {
  personaSlug: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ personaSlug }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch persona data on mount/slug change
  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const res = await fetch(`http://localhost:8000/personas/${personaSlug}`);
        if (!res.ok) throw new Error('Failed to load persona');
        const data = await res.json();
        setPersona(data);
      } catch (err) {
        console.error(err);
        setError('Could not load persona character.');
      }
    };
    void fetchPersona();
  }, [personaSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
  }, [input]);

  const submitMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    const agUiMessages = nextMessages.map((m, idx) => ({
      id: String(idx),
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch(`http://localhost:8000/${personaSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          thread_id: 'default',
          run_id: crypto.randomUUID(),
          messages: agUiMessages,
          state: null,
          tools: [],
          context: [],
          forwarded_props: null,
        }),
      });

      if (!response.ok) throw new Error('Failed to connect');

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'TEXT_MESSAGE_CONTENT' && event.delta) {
                assistantContent += event.delta;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch (err) {
              console.error('SSE parse error:', err);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection failed. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void submitMessage(input);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white px-6 text-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">
          <div className="mb-4 text-sm font-medium text-white/90">Something went wrong</div>
          <div className="text-xs leading-6 text-white/35">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-white px-5 py-2 text-xs font-medium text-black transition hover:bg-white/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-pulse rounded-full border border-white/20 bg-white/5" />
            <div className="absolute inset-0 animate-ping rounded-full border border-white/10" />
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">Loading Context</div>
        </div>
      </div>
    );
  }

  // Resolve asset paths relative to public or src paths (assuming Vite handles these imports if we use a trick, 
  // but for dynamic we usually serve from public or import maps. Since they are in src/assets, we use dynamic import trick
  // or just rely on Vite's asset handling if configured. 
  // Assuming standard Vite setup, we'll try to load them via `/src/assets/...` url 
  // Note: For production build, dynamic images from src/assets is tricky, but works in dev.
  const portraitUrl = new URL(`../assets/characters/${persona.avatar.portrait}`, import.meta.url).href;
  const bgUrl = new URL(`../assets/backgrounds/${persona.avatar.background}`, import.meta.url).href;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={bgUrl}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/45 to-black/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,rgba(255,255,255,0.08),transparent_35%)]" />
      </div>

      <div className="relative z-10 flex h-full w-full">
        {/* Left side */}
        <section className="hidden md:flex flex-1 items-end px-8 py-10 lg:px-16 lg:py-16">
          <div className="max-w-2xl">
            <div className="flex items-end gap-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-[2rem] bg-white/10 blur-2xl" />
                <div className="relative h-64 w-52 overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md lg:h-80 lg:w-64">
                  <img
                    src={portraitUrl}
                    alt={persona.display_name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5" />
                </div>
              </div>

              <div className="pb-4">
                <div className="mb-5 h-px w-16 bg-white/20" />
                <h1 className="text-4xl font-light tracking-[-0.04em] text-white lg:text-6xl">
                  {persona.display_name}
                </h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/55 lg:text-base">
                  {persona.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right chat panel */}
        <aside className="flex h-full w-full shrink-0 flex-col border-l border-white/10 bg-black/35 backdrop-blur-2xl md:w-[440px] lg:w-[500px]">
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/map')}
                className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full border border-white/10 bg-white/5 p-0.5">
                <img
                  src={portraitUrl}
                  alt={persona.display_name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-white/85">{persona.display_name}</div>
                <div className="text-[11px] text-white/35">AI-reconstructie</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-8 backdrop-blur-md">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <img
                      src={portraitUrl}
                      alt={persona.display_name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  </div>
                  <div className="text-sm font-medium text-white/70">
                    Start a conversation
                  </div>
                  <div className="mt-2 text-xs leading-6 text-white/35">
                    Ask a question to begin.
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    {persona.predefined_prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void submitMessage(prompt)}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-xs text-white/55 transition hover:bg-white/[0.06] hover:text-white/80"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m, i) => {
                  const isUser = m.role === 'user';

                  return (
                    <div
                      key={i}
                      className={`flex animate-[fadeIn_.2s_ease] ${isUser ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      {!isUser && (
                        <div className="mr-2 mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                          <img
                            src={portraitUrl}
                            alt="Assistant"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-[0_8px_30px_rgba(0,0,0,0.18)] ${isUser
                          ? 'rounded-br-md bg-white text-black'
                          : 'rounded-bl-md border border-white/10 bg-white/[0.055] text-white/88 backdrop-blur-md'
                          }`}
                      >
                        <div className="whitespace-pre-wrap break-words">{m.content}</div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex animate-[fadeIn_.2s_ease] justify-start">
                    <div className="mr-2 mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                      <img
                        src={portraitUrl}
                        alt="Assistant"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-md">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/35" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/35 [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/35 [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-white/10 p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder={`Message ${persona.display_name}...`}
                    disabled={isLoading}
                    className="max-h-[140px] min-h-[24px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white/90 placeholder:text-white/25 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-20"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M19 12l-7-7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-center text-[10px] tracking-wide text-white/20">
                Enter to send · Shift + Enter for newline
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};