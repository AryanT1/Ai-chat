import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { MessageSquare, UploadCloud, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', marginTop: '2rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1 style={{ fontSize: '4rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: '-0.02em' }}>
          Intelligent Conversations,<br/>Elevated.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
          Experience the power of GPT-4o-mini with our advanced chat platform. 
          Upload context, analyze documents, and get smarter answers instantly.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/signup"><Button variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Get Started Free</Button></Link>
          <Link to="/pricing"><Button variant="secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>View Pricing</Button></Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <FeatureCard 
          icon={<MessageSquare size={32} color="var(--accent-primary)" />}
          title="Smart AI Chat"
          description="Engage in natural, human-like conversations powered by the latest OpenAI models."
        />
        <FeatureCard 
          icon={<UploadCloud size={32} color="var(--accent-secondary)" />}
          title="Contextual Uploads"
          description="Upload files up to 5MB to give the AI context. We support analyzing your documents."
        />
        <FeatureCard 
          icon={<Zap size={32} color="#f59e0b" />}
          title="Freemium Power"
          description="Start with 10 free chats daily. Upgrade to Pro for unlimited access and priority."
        />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ 
      background: 'rgba(255,255,255,0.05)', 
      width: '64px', height: '64px', 
      borderRadius: '16px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.5rem' }}>{title}</h3>
    <p>{description}</p>
  </div>
);
