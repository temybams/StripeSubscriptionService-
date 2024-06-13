import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";
import express from "express";
const app = express();
import cors from "cors";
import bodyParser from "body-parser";
import moment from "moment";
import Stripe from 'stripe'
import { config } from 'dotenv'

config()
const port = 5000;

app.use(express.json());
app.use(bodyParser.json());

const [basic, pro, business] = [
  "price_1P5zVoP4hASdz9CK233gIBko",
  "price_1P5zasP4hASdz9CKGIJdiGBU",
  "price_1P5zcAP4hASdz9CK0xVoiW5U"
];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://stripe-subscription-pj-default-rtdb.firebaseio.com/",
});

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);

/*********** create subscription ************/

const getStripeSession = async (priceId: string) => {
  try {
    const price = await stripe.prices.retrieve(priceId)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'], line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    return session;
  } catch (e) {
    console.log(e)
    throw e
  }
};

app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
  const { plan, customerId } = req.body;
  let priceId: string | null = null;
  if (plan == 99) priceId = basic;
  else if (plan == 499) priceId = pro;
  else if (plan == 999) priceId = business;

  try {
    const session = await getStripeSession(priceId!);
    const user = await admin.auth().getUser(customerId);


    await admin
      .database()
      .ref("users")
      .child(user.uid)
      .update({
        subscription: {
          sessionId: session.id,
        },
      });
    return res.json({ session });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

/************ payment success ********/

app.post("/api/v1/payment-success", async (req, res) => {
  const { sessionId, firebaseId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const subscriptionId = session.subscription as string;
      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId,
        );
        const user = await admin.auth().getUser(firebaseId);
        const lineItem = subscription.items.data[0];
        if (!lineItem) {
          throw Error('Line item not found')
        }

        const planType = lineItem.price.unit_amount === 50000 ? "basic" : "pro";
        const startDate = moment
          .unix(subscription.current_period_start)
          .format("YYYY-MM-DD");
        const endDate = moment
          .unix(subscription.current_period_end)
          .format("YYYY-MM-DD");
        const durationInSeconds =
          subscription.current_period_end - subscription.current_period_start;
        const durationInDays = moment
          .duration(durationInSeconds, "seconds")
          .asDays();
        await admin
          .database()
          .ref("users")
          .child(user.uid)
          .update({
            subscription: {
              sessionId: null,
              planId: lineItem.price.id,
              planType: planType,
              planStartDate: startDate,
              planEndDate: endDate,
              planDuration: durationInDays,
            },
          });
      } catch (error) {
        console.error("Error retrieving subscription:", error);
      }
      return res.json({ message: "Payment successful" });
    } else {
      return res.json({ message: "Payment failed" });
    }
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});