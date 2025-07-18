import mongoose from "mongoose";
const ShoppingCartSchema = new mongoose.Schema({  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    count: { type: Number, required: true },
    
},
{ timestamps: true }
);
const ShoppingCartModel = mongoose.model('shoppingcart', ShoppingCartSchema);
export default ShoppingCartModel;
