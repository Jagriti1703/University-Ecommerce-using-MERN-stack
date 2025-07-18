import ShoppingCartModel from "../models/ShoppingCart.js";

// ➕ Add or update item in cart
export const CreateCart = async (req, res) => {
  try {
    const { user, product, count } = req.body;

    const existing = await ShoppingCartModel.findOne({ user, product });

if (existing) {
  existing.count = Number(count); 
  await existing.save();
  return res.status(201).json({ message: "Product quantity updated in cart" });
    }

    const newItem = await ShoppingCartModel.create({
      user,
      product,
      count: parseInt(count)
    });

    res.status(201).json({ message: "Product added to cart", cartItem: newItem });
  } catch (error) {
    console.error("CreateCart error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🛍 Get user's cart
export const GetCart = async (req, res) => {
  try {
    const cartItems = await ShoppingCartModel.find({ user: req.query.userId })
      .populate("product", "name price qty description images")
      .populate("user", "firstName lastName email");
    res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Remove item from cart
export const RemoveCartItem = async (req, res) => {
  try {
    const result = await ShoppingCartModel.findByIdAndDelete(req.body.id);
    if (result) {
      res.status(200).json({ message: "Item removed from cart" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const UpdateCartQuantity = async (req, res) => {
  try {
    const { id, count } = req.body; // id: cartItemId
    const updated = await ShoppingCartModel.findByIdAndUpdate(id, { count }, { new: true });
    if (updated) res.status(200).send({ message: "Quantity updated", updated });
    else res.status(404).send({ message: "Cart item not found" });
  } catch (err) {
    res.status(500).send({ message: "Failed to update quantity", error: err.message });
  }
};