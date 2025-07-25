const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: String,
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
  })
);

router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;
    if (!productId || !user) {
      return res
        .status(400)
        .json({ message: "Productid and user is required" });
    }
    let cart = await Cart.findOne({ userId: user, status: "active" });
    if (!cart) {
      cart = new Cart({ userId: user, items: [], status: "active" });
    }
    const existingItemIndex = cart.items.findIndex(
      (items) => items.productId === productId
    );
    if (existingItemIndex > -1) {
      cart.item[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.item.push({
        productId,
        quantity: parseInt(quantity),
      });
    }
    cart.updateAt = new Date();
    await cart.save();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error,item has not been added" });
  }
});
router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find({});
    res.status(200).json({
      success: true,
      count: cart.length,
      data: carts,
    });
  } catch (error) {
    console.log("Error fetching cart", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    });
  }
});

//Assignment
// router.delete("/carrt/:id",async(req,res)=>{
//     //check if items is there in the cart,-do the delete operation
//     //if item is not there-err to user
// })

module.exports = router;
