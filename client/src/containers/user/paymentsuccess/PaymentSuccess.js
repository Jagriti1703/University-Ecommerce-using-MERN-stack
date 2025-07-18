// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";

// function PaymentSuccess() {
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get("session_id");
//   const userId = sessionStorage.getItem("id");
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
  
//   // Add a ref to track if request was already made
//   const requestMade = useRef(false);

//   useEffect(() => {
//     if (requestMade.current) return;
//     requestMade.current = true;

//     const shippingInfoRaw = sessionStorage.getItem("shippingInfo");
//     const shippingInfo = JSON.parse(shippingInfoRaw || "{}");

//     if (sessionId && userId) {
//      axios.post("http://localhost:8082/place-order", {
//   userId,
//   name: shippingInfo.name,
//   streetAddress: shippingInfo.address,
//   city: shippingInfo.city,
//   state: shippingInfo.state,
//   postalCode: shippingInfo.postalCode,
//   phoneNumber: shippingInfo.phoneNumber,
//   paymentStatus: "paid",
//   orderStatus: "placed",
//   sessionId,
// })


// //       axios.post("http://localhost:8082/place-order", {
// //         ...shippingInfo,
// //         userId,
// //         paymentStatus: "paid",
// //         orderStatus: "placed",
// //         sessionId
// //       })
//       .then((res) => {
//         console.log("✅ Order placed successfully:", res.data);
//         sessionStorage.removeItem("shippingInfo");
//         sessionStorage.removeItem("cartItems"); // Clear cart after successful order
//         setOrderPlaced(true);
//         setLoading(false);
        
//         // Verify payment with Stripe
//         verifyStripePayment(sessionId);
//       })
//       .catch((err) => {
//         console.error("❌ Order placement failed:", err);
//         setErrorMessage(
//           err.response?.data?.message || 
//           "Something went wrong while placing your order."
//         );
//         setOrderPlaced(false);
//         setLoading(false);
//       });
//     } else {
//       setErrorMessage("Missing payment session or user information");
//       setLoading(false);
//     }
//   }, [sessionId, userId, navigate]);



// const verifyStripePayment = async (sessionId) => {
//   try {
//     const response = await axios.post("http://localhost:8082/verify-payment", {
//       sessionId,
//       userId // Make sure to include userId
//     });
    
//     if (response.data.success) {
//       console.log("Stripe payment verified:", response.data);
//       // Update local state if needed
//     } else {
//       console.error("Payment verification failed:", response.data.error);
//       setErrorMessage("Payment verification failed. Please contact support.");
//     }
//   } catch (err) {
//     console.error("Stripe verification failed:", err);
//     setErrorMessage("Could not verify payment. Please check your orders later.");
//   }
// };




//   return (
//     <div className="container text-center mt-5">
//       {loading ? (
//         <h3 className="text-secondary">Processing your payment...</h3>
//       ) : orderPlaced ? (
//         <>
//           <h2 className="text-success">🎉 Your payment was successful!</h2>
//           <p className="lead">
//             Your order has been placed successfully. Thank you for shopping with us!
//           </p>
//           <p>Order ID: {sessionId}</p>
//           <button 
//             className="btn btn-primary mt-3"
//             onClick={() => navigate("/orders")}
//           >
//             View Your Orders
//           </button>
//         </>
//       ) : (
//         <>
//           <h4 className="text-danger">
//             ❌ Something went wrong while placing your order.
//           </h4>
//           <p>{errorMessage}</p>
//           <button
//             className="btn btn-primary mt-3"
//             onClick={() => navigate("/cart")}
//           >
//             Go back to Cart
//           </button>
//         </>
//       )}
//     </div>
//   );
// }



// export default PaymentSuccess;


import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const userId = sessionStorage.getItem("id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const requestMade = useRef(false);

  useEffect(() => {
    if (!sessionId || !userId) {
      setErrorMessage("Missing payment session or user information.");
      setLoading(false);
      return;
    }

    if (requestMade.current) return;
    requestMade.current = true;

    const shippingInfoRaw =
      sessionStorage.getItem("shippingInfo") ||
      localStorage.getItem("shippingInfo");

    const shippingInfo = JSON.parse(shippingInfoRaw || "{}");

    // First verify payment
    const verifyAndPlaceOrder = async () => {
      try {
        const verifyRes = await axios.post(
          "http://localhost:8082/verify-payment",
          { sessionId, userId }
        );

        if (!verifyRes.data.success) {
          console.error("Payment verification failed:", verifyRes.data.error);
          setErrorMessage(
            "Payment verification failed. Please contact support."
          );
          setLoading(false);
          return;
        }

        console.log("✅ Payment verified with Stripe:", verifyRes.data);

        // Now place the order
        const orderRes = await axios.post("http://localhost:8082/place-order", {
          userId,
          name: shippingInfo.name,
          streetAddress: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postalCode: shippingInfo.postalCode,
          phoneNumber: shippingInfo.phoneNumber,
          paymentStatus: "paid",
          orderStatus: "placed",
          sessionId,
        });

        console.log("✅ Order placed successfully:", orderRes.data);

        localStorage.removeItem("shippingInfo");
        sessionStorage.removeItem("shippingInfo");
        localStorage.removeItem("cartItems");

        setOrderPlaced(true);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error placing order or verifying payment:", err);
        setErrorMessage(
          err.response?.data?.message ||
            "Something went wrong while processing your payment."
        );
        setLoading(false);
      }
    };

    verifyAndPlaceOrder();
  }, [sessionId, userId]);

  return (
    <div className="container text-center mt-5">
      {loading ? (
        <h3 className="text-secondary">Processing your payment...</h3>
      ) : orderPlaced ? (
        <>
          <h2 className="text-success">🎉 Your payment was successful!</h2>
          <p className="lead">
            Your order has been placed successfully. Thank you for shopping with us!
          </p>
          <p>Order ID: {sessionId}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/orders")}
          >
            View Your Orders
          </button>
        </>
      ) : (
        <>
          <h4 className="text-danger">
            ❌ Something went wrong while placing your order.
          </h4>
          <p>{errorMessage}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/cart")}
          >
            Go back to Cart
          </button>
        </>
      )}
    </div>
  );
}

export default PaymentSuccess;
