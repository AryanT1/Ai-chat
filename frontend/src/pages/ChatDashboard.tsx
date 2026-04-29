import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Send, Upload, File as FileIcon, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  fileName?: string;
}

export const ChatDashboard: React.FC = () => {
  const { user, refreshUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Hello! How can I help you today? You can also upload a document for context.' }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading || !user) return <div className="flex-center" style={{height: '50vh'}}>Loading...</div>;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    const userMsgId = Date.now().toString();
    const newMessages = [
      ...messages, 
      { id: userMsgId, role: 'user' as const, content: input, fileName: file?.name }
    ];
    setMessages(newMessages);
    setInput('');
    setSending(true);

    const formData = new FormData();
    formData.append('message', input);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await api.post('/chat/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: 'ai', content: response.data.response || response.data.message || 'Error processing response.' }
      ]);
      await refreshUser(); // Update chat count
      setFile(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to send message. You might have reached your daily limit.';
      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: 'ai', content: `[Error] ${errorMsg}` }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', height: 'calc(100vh - 120px)' }}>
      {/* Main Chat Area */}
      <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>AI Assistant</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              background: msg.role === 'user' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
              padding: '1rem 1.5rem',
              borderRadius: '16px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
            }}>
              {msg.fileName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <FileIcon size={16} />
                  {msg.fileName}
                </div>
              )}
              <p style={{ margin: 0, color: 'white', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
          {file && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <FileIcon size={16} />
              <span style={{ fontSize: '0.875rem' }}>{file.name}</span>
              <button type="button" onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.875rem', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', transition: 'var(--transition-fast)' }}
            >
              <Upload size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div style={{ flex: 1 }}>
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                style={{ marginBottom: 0 }}
                disabled={sending}
              />
            </div>
            <Button type="submit" disabled={(!input.trim() && !file) || sending} isLoading={sending} style={{ padding: '0.875rem' }}>
              <Send size={20} />
            </Button>
          </div>
        </form>
      </div>

      {/* Sidebar */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Plan</h3>
          <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Free Tier</div>
            <p style={{ color: 'var(--text-secondary)' }}>You have <strong style={{color: 'var(--accent-primary)'}}>{Math.max(0, 10 - (user.chats || 0))}</strong> chats remaining today.</p>
            
            <div style={{ marginTop: '1rem', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--accent-gradient)', width: `${Math.min(100, ((user.chats || 0) / 10) * 100)}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: '12px', border: '1px solid var(--accent-glow)' }}>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.125rem' }}>Upgrade to Pro</h4>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Unlock unlimited chats and priority processing.</p>
            <Button fullWidth onClick={() => navigate('/pricing')}>View Plans</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
