import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import UniversityModel from "./models/University.js"; 
import { CreateUniversity, DeleteUniversity, GetUniversities, UpdateUniversity } from "./controllers/University.js";
import { CreateDepartment, DeleteDepartment, GetDepartmentsByUniversity, UpdateDepartment } from "./controllers/Department.js";
import { CreateProduct, DeleteProduct, GetProductDetails, GetProductsByDepartment, UpdateProduct, UpdateProductQty } from "./controllers/Product.js";
import { Login, Register } from "./controllers/User.js";
import {  PlaceOrderFromCart } from "./controllers/Order.js";
import { CreateCart, GetCart, RemoveCartItem, UpdateCartQuantity } from "./controllers/Cart.js";
import Stripe from "stripe";
import OrderHeaderModel from "./models/OrderHeader.js";
import { verifyToken } from "./middlewares/authMiddleware.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//University Module
// Multer setup
const storageUniv = multer.diskStorage({
  destination: "uploadsUniv/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const uploadUniv = multer({ storage: storageUniv });


// http://localhost:8082/university
app.post("/university",uploadUniv.single("image"),CreateUniversity);
app.put("/university", uploadUniv.single("image"), (req, res) => {
  // Pass the new image path and __dirname to the controller
  UpdateUniversity(req, res, __dirname);
});

app.delete("/university",DeleteUniversity);
app.get("/university",GetUniversities);

//Department Module
const storageDep = multer.diskStorage({
  destination: "uploadsDep/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const uploadDep = multer({
  storage: storageDep,
});

// http://localhost:8082/department
app.post("/department",uploadDep.single("image"),CreateDepartment);
// app.put("/department",uploadDep.single("image"),UpdateDepartment);
app.put("/department", uploadDep.single("image"), (req, res) => {
  // Pass the new image path and __dirname to the controller
  UpdateDepartment(req, res, __dirname);
});

app.delete("/department",DeleteDepartment);
app.get("/department",GetDepartmentsByUniversity);

//Product Module
const storagePrd = multer.diskStorage({
  destination: "uploadsPrd",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const uploadsPrd = multer({
  storage: storagePrd,
});

// http://localhost:8082/product
app.post("/product", uploadsPrd.array("images"), CreateProduct);
app.put("/product", uploadsPrd.array("images"), UpdateProduct);
app.delete("/product", DeleteProduct);
app.get("/product", GetProductsByDepartment);
app.put("/updateProductQty", UpdateProductQty);
app.get("/productDetails", GetProductDetails);

//User Module

// http://localhost:8082/register
app.post("/register",Register);
// https://localhost:8082/login
app.post("/login",Login);

// Cart routes
app.post("/cart",CreateCart);
app.get("/cart", GetCart);
app.delete("/cart", RemoveCartItem);
app.put("/cart", UpdateCartQuantity);



app.post('/place-order',PlaceOrderFromCart);
// Order routes
// app.post('/place-order', async (req, res) => {
//   const { sessionId, userId, ...shippingInfo } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== 'paid') {
//       return res.status(400).json({ error: 'Payment not completed' });
//     }

//     // Place the order in your database here
//     // using userId, session details, shippingInfo, etc.

//     res.json({ message: 'Order placed successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to place order' });
//   }
// });
// app.get("/orders", GetUserOrders);
// app.get("/order-details", GetOrderDetails);





//Image Access
app.use(express.static("uploadsUniv/"));
app.use(express.static("uploadsDep/"));
app.use(express.static("uploadsPrd/"));



// Import Stripe (make sure the library is installed: npm install stripe)
// app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



// app.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { cartItems, userId, shippingInfo } = req.body;

//     const line_items = cartItems.map((item) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.product.name,
//           // Optionally add images:
//           // images: [`http://localhost:8082/${item.product.images[0]}`]
//         },
//         unit_amount: item.product.price * 100, // Amount in paise (for INR)
//       },
//       quantity: item.count,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items,
//       success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `http://localhost:3000/cart`,
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });





app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, userId, shippingInfo } = req.body;

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.count,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cart`,
      metadata: {
        userId: userId,
        cartItems: JSON.stringify(cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.count
        })))
      },
      payment_intent_data: {
        metadata: {
          userId: userId
        }
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});




// Add this new route right after the checkout session
app.post("/verify-payment", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
    
    await OrderHeaderModel.updateOne(
      { transactionId: sessionId },
      { 
        paymentStatus: paymentIntent.status,
        paymentDetails: paymentIntent,
        $set: {
          // Update other fields if needed
          orderStatus: paymentIntent.status === "paid" ? "placed" : "pending"
        }
      }
    );
    
    res.json({ success: true, paymentIntent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/protected-route", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  res.json({
    message: "You accessed the protected route!",
  });
});


mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database Connected!!");
    app.listen(process.env.PORT, () => {
      console.log("Server running at Port:" + process.env.PORT);
    });
  })
  .catch(() => {
    console.log("Database Connected!!");
  });



  // Webhook endpoint
app.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment succeeded:', session.id);
      // Update your database here
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful:', paymentIntent.id);
      break;
    // Add other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});