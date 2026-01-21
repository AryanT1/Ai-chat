import { Router } from 'express';


import { GeneralAuth } from '../middleware/GeneralAuth.js';
import { createOrder, getPlans, getSubscription, verifyPayment } from '../controllers/payment.controller.js';

export const paymentRoute = Router();

paymentRoute.get('/plans', getPlans);
paymentRoute.post('/create-order', GeneralAuth, createOrder);
paymentRoute.post('/verify', GeneralAuth, verifyPayment);
paymentRoute.get('/subscription', GeneralAuth, getSubscription);
