import mongoose, { Schema } from "mongoose";
const OrderHeaderSchema=new mongoose.Schema({
    user: {
        // Assuming you have another Mongoose model for ApplicationUser
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      orderDate: {
        type: Date,
        required: true,
      },
      shippingDate: {
        type: Date,
        required: true,
      },
      orderTotal: {
        type: Number,
        required: true,
      },
      trackingNumber: {
        type: String,
      },
      carrier: {
        type: String,
      },
      orderStatus: {
        type: String,
      },
      paymentStatus: {
        type: String,
      },
      paymentDate: {
        type: Date,
      },
      paymentDueDate: {
        type: Date,
      },
      transactionId: {
        type: String,
      },
      name: {
        type: String,
        required: true,
      },
      streetAddress: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
},
{timestamps:true}
);
const OrderHeaderModel=mongoose.model('orderHeader',OrderHeaderSchema);
export default OrderHeaderModel;
