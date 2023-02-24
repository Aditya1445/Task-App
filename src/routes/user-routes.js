const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const handleErrors = (error) => {
  console.log(error.message, error.code);

  let errors = { email: "", password: ""};

  //Duplicate email
  if (error.code === 11000) {
    errors.email = "Email is already in use";
  }

  // incorrect email
  if (error.message === "Incorrect email") {
    errors.email = "Could not find that email!";
  }
  // incorrect password
  if (error.message === "Incorrect password") {
    errors.password = "Password does not match!";
  }
  // user validation failed
  if (error.message.includes("User validation failed")) {
    console.log('Error here', Object.values(error.errors));
    Object.values(error.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

router.get("/users/signup", (req, res) => {
  res.render("register");
});

router.get("/users/login", (req, res) => {
  res.render("login");
});

router.get("/users/about", auth, (req, res) => {
  res.render("user-details");
});

//User signUp
router.post(
  "/users/signup",
  upload.single("avatar"),
  async (req, res, err) => {
    console.log(req.body);
    console.log(req.file);
    try {
      var avatar = req.file ? "/uploads/" + req.file.filename : "";
      const user = new User(req.body);
      user.avatar = avatar;
      await user.save();
      const token = await user.generateAuthToken();
      res.cookie("jwt", token, { httpOnly: true });
      res.status(201).json({ user, token });
    } catch (e) {
      const error = handleErrors(e);
      res.status(500).json({ error });
    }
  },
  (err, req, res, next) => {
    // const error = handleErrors(err);
    const error = { avatar: "" };
    error.avatar = err.message;
    res.status(500).json({ error });
    // console.log(err);
  }
);
// User signIn
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCrendentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({ user, token });
  } catch (error) {
    const err = handleErrors(error);
    console.log(err);
    res.status(400).json({ err });
  }
});

//User signOut
router.get("/users/logout", auth, async (req, res) => {
  try {
    req.user.Tokens = req.user.Tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("jwt");
    // res.send();
    res.redirect("/users/login");
  } catch (e) {
    res.status(500).json();
  }
});
// User details

router.get("/users/me", auth, async (req, res) => {
  console.log("name", req.user.name);

  try {
    // const user = await User.find({})
    res.json({ user: req.user });
  } catch (e) {
    res.status(500).json(e);
  }
});

// Update user

router.patch(
  "/users/me",
  auth,
  upload.single('avatar'),
  async (req, res) => {
    console.log('file', req.user);
    console.log('body', req.body);
    // removing avatar from req.body as it will be handled by req.file if user filled the file image field.
    // req.body will be undefined for avatar property when the user leaves the file image field empty.
    const updates = Object.keys(req.body).filter((e)=>e!=='avatar');
    console.log(updates);
    const allowedUpdates = ["name", "email", "password"];

    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({
        error: "Invalid updates",
      });
    }
    try {
      const user = req.user;
      // console.log(req.userImage);
      updates.forEach((update) => {
        user[update] = req.body[update];
      });
      var avatar = req.file ? "/uploads/" + req.file.filename : req.userImage;
      user.avatar = avatar;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      const err = handleErrors(error);
      res.status(404).json({err});
    }
  },
  (err, req, res, next) => {
    console.log(err);
    const error = { avatar: "" };
    error.avatar = err.message;
    res.status(500).json({ error });
  }
);

// Remove user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).json(req.user);
  } catch (e) {
    res.status(500).json(e.message);
  }
});
module.exports = router;
