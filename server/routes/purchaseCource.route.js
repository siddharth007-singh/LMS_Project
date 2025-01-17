import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCheckOutSession, stripeWebhook } from '../controllers/courcePurchase.controller.js';

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckOutSession);
router.route("/webhook").post(express.raw({type:"application/json"}),stripeWebhook);
router.route("/cource/:courceId/details-with-status").get();

router.route("/").get();


export default router;