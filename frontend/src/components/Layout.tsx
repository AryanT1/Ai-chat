import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogIn, User as UserIcon } from 'lucide-react';
import { Button } from './Button';

export const Layout: React.FC = () => {
  const { user, isLoading } = useAuth();

  return (
    <>
      <nav style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(15, 15, 19, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <Bot size={28} color="var(--accent-primary)" />
          <span>AI-ChatBot</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {!isLoading && (
            user ? (
              <>
                <Link to="/chat"><Button variant="ghost">Chat</Button></Link>
                <Link to="/pricing"><Button variant="ghost">Pricing</Button></Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                  <UserIcon size={20} />
                  <span style={{ fontSize: '0.875rem' }}>{user.name}</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost"><LogIn size={18} style={{marginRight: 6}}/>Login</Button></Link>
                <Link to="/signup"><Button variant="primary">Sign Up</Button></Link>
              </>
            )
          )}
        </div>
      </nav>
      <main className="container animate-fade-in" style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </>
  );
};
