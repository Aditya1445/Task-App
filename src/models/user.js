const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid!");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [7, "must be atleast 7"],
      trim: true,
      validate(value) {
        if (validator.contains(value.toLowerCase(), "password")) {
          throw new Error(`Password cannot contain ${value}`);
        }
      },
    },
    Tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.virtual("mytasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.Tokens;
  return userObject;
};
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.Tokens = [...user.Tokens, { token }];
  await user.save();
  return token;
};

userSchema.statics.findByCrendentials = async (email, password) => {
  const user = await userModel.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (isMatch) {
      return user;
    }

    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre('remove', async function(next){
  const user = this;
  await Task.deleteMany({owner:user._id});
  next();
})
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
