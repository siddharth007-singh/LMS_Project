import Stripe from "stripe";
import { Course } from "../models/cource.model.js";
import { CourcePurchase } from '../models/courcePurchase.model.js';
import { Lecture } from '../models/lecture.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckOutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courceId } = req.body;

        const cource = await Course.findById(courceId);
        if (!cource) return res.status(404).json({ message: "Cource not found" });

        //Create new Cource Purchased Record
        const newPurchase = await CourcePurchase({
            courceId,
            userId,
            amount: cource.courcePrice,
            status: "pending"
        });

        //Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: cource.courceTitle,
                            images: [cource.courceThumbnail],
                        },
                        unit_amount: cource.courcePrice * 100, // Amount in paise (lowest denomination)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/cource-progress/${courceId}`, // once payment successful redirect to course progress page
            cancel_url: `http://localhost:5173/cource-details/${courceId}`,
            metadata: {
                courceId: courceId,
                userId: userId,
            },
            shipping_address_collection: {
                allowed_countries: ["IN"], // Optionally restrict allowed countries
            },
        });

        if (!session.url) {
            return res.status(400).json({ success: false, message: "Something went wrong" });
        }

        //Save the Purchsed Record
        newPurchase.paymentId = session.id;
        await newPurchase.save();

        return res.status(200).json({ success: true, url: session.url });  //Return the Checkout URL

    } catch (error) {
        console.log(error);
    }
};

export const stripeWebhook = async (req, res) => {
    console.log("Webhook received");
    let event;
  
    try {
      const payloadString = JSON.stringify(req.body, null, 2);
      const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
  
      // Validate the webhook signature
      event = stripe.webhooks.constructEvent(payloadString, req.headers["stripe-signature"], secret);
    } catch (error) {
      console.error("Webhook error:", error.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }
  
    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
      console.log("Checkout session completed event triggered");
  
      try {
        const session = event.data.object;
        console.log("Session data:", session);
  
        // Find the purchase record using the payment ID
        const purchase = await CourcePurchase.findOne({
          paymentId: session.id,
        }).populate({ path: "courceId" });
  
        if (!purchase) {
          console.error("No purchase found for payment ID:", session.id);
          return res.status(404).send("Purchase record not found");
        }
  
        // Update purchase details
        purchase.status = "completed";
        if (session.amount_total) {
          purchase.amount = session.amount_total / 100;
        }
  
        // Make all lectures visible
        if (purchase.courceId && purchase.courceId.lectures.length > 0) {
          await Lecture.updateMany(
            { _id: { $in: purchase.courceId.lectures } },
            { $set: { isPreviewFree: true } }
          );
        }
  
        await purchase.save();
        console.log("Purchase status updated to 'completed':", purchase);
  
        // Update user and course records
        await User.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCources: purchase.courceId._id } },
          { new: true }
        );
  
        await Course.findByIdAndUpdate(
          purchase.courceId._id,
          { $addToSet: { enrolledStudents: purchase.userId } },
          { new: true }
        );
      } catch (error) {
        console.error("Error handling event:", error.message);
        return res.status(500).send("Internal Server Error");
      }
    }
  
    res.status(200).send();
  };

// 12:26:01  Stripe Payement Gateway Integration
