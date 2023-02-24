const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  res.set({
    "Cache-Control":
      "no-cache, private, no-store, must-revalidate",
  });
  try {
    const token = req.cookies.jwt;
    console.log("Token", token);
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded", decoded);
    const user = await User.findOne({
      _id: decoded._id,
      "Tokens.token": token,
    });
    if (!user) {
      throw new Error("Authentication failed");
    }
    req.user = user;
    req.token = token;
    req.userImage = user.avatar;
    next();
  } catch (e) {
    console.log(e.message);
    res.redirect("/users/login");
  }
};

module.exports = auth;
