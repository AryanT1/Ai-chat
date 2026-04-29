import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Check } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

export const Pricing: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/payment/plans');
        setPlans(response.data.plans || []);
      } catch (err) {
        console.error('Failed to fetch plans', err);
        // Fallback for demonstration if API isn't quite ready
        setPlans([
          { id: 'monthly', name: 'Pro Monthly', amount: 999, currency: 'USD' },
          { id: 'yearly', name: 'Pro Yearly', amount: 9900, currency: 'USD' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setCheckoutLoading(planId);
    try {
      const response = await api.post('/payment/create-order', { planId });
      // Usually, this returns a client secret for Stripe or a checkout URL.
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert('Payment intent created. Stripe Elements integration required for full checkout.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to initiate checkout.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '50vh' }}>Loading plans...</div>;
  }

  return (
    <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Simple, transparent pricing</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Upgrade to unlock the full potential of AI-ChatBot.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
        {/* Free Plan */}
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Free</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/mo</span></div>
          <p style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>Perfect for trying out the platform.</p>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {['10 chats per day', 'Basic file uploads (up to 5MB)', 'Standard response time'].map(feature => (
              <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={20} color="var(--success)" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="secondary" fullWidth onClick={() => !user ? navigate('/login') : navigate('/chat')}>
            {user ? 'Go to Chat' : 'Get Started'}
          </Button>
        </div>

        {/* Pro Plans from API */}
        {plans.map(plan => (
          <div key={plan.id} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '2px solid var(--accent-primary)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-gradient)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Most Popular
            </div>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{plan.name}</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              ${(plan.amount / 100).toFixed(2)}
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/{plan.id.includes('year') ? 'yr' : 'mo'}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>For power users and professionals.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {['Unlimited daily chats', 'Priority AI processing', 'Advanced document analysis', 'Early access to new features'].map(feature => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={20} color="var(--success)" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => handleSubscribe(plan.id)}
              isLoading={checkoutLoading === plan.id}
            >
              Subscribe Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
