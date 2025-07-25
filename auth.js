const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const brcpt = require("bcryptjs");
const router = express.Router();

const User = mongoose.model(
  "User",
  new mongoose.Schema({ email: String, password: String })
);

//signup route
router.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  const token = jwt.sign({ userId: user._id }, "secret", { expireIn: "1h" });
  res.status(200).json({ token });
});

//login route

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._Id }, "secret", { ExpireIn: "1h" });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

//jwt middleware

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split();
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}
module.exports = { router, authenticateJWT };
