import type { Response } from 'express';

import prisma from '../db/prisma.js';
import type { AuthRequest } from '../middleware/GeneralAuth.js';

import { stripe } from '../db/stripe.js';
import redis from '../db/redis.js';




export const getPlans = async (req: AuthRequest, res: Response) => {
  const plans = [
    {
      id: 'pro-monthly',
      name: 'Pro Monthly',
      price: 99,
      currency: 'INR',
      features: ['Unlimited chats', 'Priority support', 'Advanced models']
    },
    {
      id: 'pro-yearly',
      name: 'Pro Yearly',
      price: 999,
      currency: 'INR',
      features: ['Unlimited chats', 'Priority support', 'Advanced models', '2 months free']
    }
  ];

  return res.status(200).json({ plans });
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

  
    const planPrices: Record<string, number> = {
      'pro-monthly': 9900,   
      'pro-yearly': 99900    
    };

    const amount = planPrices[planId];
    if (!amount) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }


    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'inr',
        payment_method: 'pm_card_visa', 
        confirm: true, 
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        },
        metadata: { 
            userId,
            planId
          }
        });
      

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });

  } catch (error: any) {
    console.error('Create payment intent error:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message 
    });
  }
};


export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { paymentIntentId, planId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }


    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);


    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        status: paymentIntent.status 
      });
    }


    if (paymentIntent.metadata.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized payment' });
    }

    await prisma.user.update({
      where: { id: userId },
       data:{
        isPro: true,
        planId: planId || paymentIntent.metadata.planId
      }
    });

    await redis.del(`user:${userId}`);


    const today = new Date().toISOString().split('T')[0];
    await redis.del(`chats:${userId}:${today}`);

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      isPro: true
    });

  } catch (error: any) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify payment',
      details: error.message 
    });
  }
};


export const getSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPro: true,
        planId: true
      }
    });

    return res.status(200).json({
      isPro: user?.isPro || false,
      planId: user?.planId || null
    });

  } catch (error: any) {
    console.error('Get subscription error:', error);
    return res.status(500).json({ error: 'Failed to get subscription' });
  }
};
