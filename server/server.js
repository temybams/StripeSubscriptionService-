require("dotenv").config()
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json")
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");


const [basic, pro, business] = ['price_1P5zVoP4hASdz9CK233gIBko', 'price_1P5zasP4hASdz9CKGIJdiGBU', 'price_1P5zcAP4hASdz9CK0xVoiW5U']

const port = 5000;
const app = express();

app.use(express.json);
app.use(bodyParser.json())

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://stripe-subscription-pj-default-rtdb.firebaseio.com"
  });

app.use(
    cors({
        origin:'http://localhost:5173'
    })
)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)


app.post("/api/v1/create-subscription-checkout-session", async(req, res) => {
    const {plan, customerId} = req.body;
    let planId = null;
    if(plan == 99) planId = basic;
    else if(plan == 499) planId = pro;
    else if(plan == 999) planId = business;

    try{

        const session = await stripeSession(planId);
        const user = await admin.auth().getUser(customerId);

        await admin.database().ref("users").child(user.uid).update({
            subscription: {
                sessionId: session.id
            }
        });
        return res.json({session})

    }catch(error){
        res.send(error)
    }
})






app.listen(port, () => {
    console.log(`server listening at port ${port}`);
})