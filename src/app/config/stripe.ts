import Stripe from 'stripe';
import config from './index';

const stripe = new Stripe(config.stripeSecretKey!, {});

export default stripe;
