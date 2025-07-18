
import OrderHeaderModel from "../models/OrderHeader.js";
import OrderDetailModel from "../models/OrderDetail.js";
import ShoppingCartModel from "../models/ShoppingCart.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PlaceOrderFromCart = async (req, res) => {
  try {
    const {
      userId,
      name,
      streetAddress,
      city,
      state,
      postalCode,
      phoneNumber,
      paymentStatus = "unpaid",
      orderStatus = "pending",
      sessionId
    } = req.body;

    let transactionId = "";
    let verifiedPaymentStatus = paymentStatus;

    if (sessionId) {
      let session;
      let retries = 2;

      while (retries > 0) {
        try {
          session = await stripe.checkout.sessions.retrieve(sessionId);

          console.log("Stripe session fetched:", session);

          if (session.payment_status === "paid") {
            break;
          }
        } catch (err) {
          console.error("Error fetching Stripe session:", err.message);
          return res.status(500).json({
            message: "Could not verify Stripe session"
          });
        }

        retries--;
        if (retries > 0) {
          console.log("Retrying Stripe session fetch in 1 second...");
          await new Promise((res) => setTimeout(res, 1000));
        }
      }

      if (!session || session.payment_status !== "paid") {
        return res.status(400).json({
          message: "Payment not completed. Please try again."
        });
      }

      transactionId = session.payment_intent;
      verifiedPaymentStatus = "paid";
    }

    // Fetch user's cart items
    const cartItems = await ShoppingCartModel.find({ user: userId }).populate("product");

    if (!cartItems?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderTotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.count,
      0
    );

    const orderHeader = await OrderHeaderModel.create({
      user: userId,
      orderDate: new Date(),
      shippingDate: new Date(Date.now() + 3 * 86400000), // 3 days shipping
      orderTotal,
      paymentStatus: verifiedPaymentStatus,
      orderStatus: verifiedPaymentStatus === "paid" ? "placed" : orderStatus,
      transactionId,
      paymentDate: verifiedPaymentStatus === "paid" ? new Date() : null,
      name,
      streetAddress,
      city,
      state,
      postalCode,
      phoneNumber
    });

    const orderDetails = cartItems.map((item) => ({
      orderHeader: orderHeader._id,
      product: item.product._id,
      quantity: item.count,
      price: item.product.price
    }));

    await OrderDetailModel.insertMany(orderDetails);
    await ShoppingCartModel.deleteMany({ user: userId });

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: orderHeader._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Order failed",
      error: error.message
    });
  }
};


// import OrderHeaderModel from "../models/OrderHeader.js";
// import OrderDetailModel from "../models/OrderDetail.js";
// import ShoppingCartModel from "../models/ShoppingCart.js";
// import dotenv from "dotenv";
// import Stripe from "stripe";

// dotenv.config();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // ✅ Place order from cart
// export const PlaceOrderFromCart = async (req, res) => {
//   try {
//     const {
//       userId,
//       name,
//       streetAddress,
//       city,
//       state,
//       postalCode,
//       phoneNumber,
//       paymentStatus = "unpaid",
//       orderStatus = "pending",
//       sessionId
//     } = req.body;

//     let transactionId = "";
//     let verifiedPaymentStatus = paymentStatus;

//     if (sessionId) {
//       try {
//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         if (session.payment_status !== "paid") {
//           return res.status(400).json({ message: "Payment not completed" });
//         }

//         transactionId = session.payment_intent;
//         verifiedPaymentStatus = "paid";
//       } catch (err) {
//         console.error("Stripe session fetch failed:", err.message);
//         return res.status(500).json({ message: "Could not verify Stripe session" });
//       }
//     }

//     // Fetch user's cart items
//     const cartItems = await ShoppingCartModel.find({ user: userId }).populate("product");

//     if (!cartItems?.length) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const orderTotal = cartItems.reduce(
//       (sum, item) => sum + item.product.price * item.count,
//       0
//     );

//     const orderHeader = await OrderHeaderModel.create({
//       user: userId,
//       orderDate: new Date(),
//       shippingDate: new Date(Date.now() + 3 * 86400000), // 3 days shipping
//       orderTotal,
//       paymentStatus: verifiedPaymentStatus,
//       orderStatus: verifiedPaymentStatus === "paid" ? "placed" : orderStatus,
//       transactionId,
//       paymentDate: verifiedPaymentStatus === "paid" ? new Date() : null,
//       name,
//       streetAddress,
//       city,
//       state,
//       postalCode,
//       phoneNumber
//     });

//     const orderDetails = cartItems.map((item) => ({
//       orderHeader: orderHeader._id,
//       product: item.product._id,
//       quantity: item.count,
//       price: item.product.price
//     }));

//     await OrderDetailModel.insertMany(orderDetails);
//     await ShoppingCartModel.deleteMany({ user: userId });

//     res.status(201).json({
//       message: "Order placed successfully!",
//       orderId: orderHeader._id
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Order failed", error: error.message });
//   }
// };
