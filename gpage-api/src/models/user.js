const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema, model } = mongoose;

const User = new Schema(
  {
    email: {
      type: String,
      minlength: 1,
      trim: true,
      required: true
    },
    passwordHash: {
      type: String,
      trim: true,
      minlength: 8,
      required: true
    },
    first_name: {
      type: String,
      minlength: 1,
      required: true
    },
    last_name: {
      type: String,
      minlength: 1,
      required: true
    },
    role: {
      type: String,
      default: 'customer',
      enum: ['customer', 'admin'],
      required: true
    },
    refresh_token: {
      type: String,
      required: true
    },
    facebookAcc: {
      access_token: { type: String },
      expires_in: { type: Number },
      update_date: { type: Number, default: Date.now(), required: true }
    }
  },
  { timestamps: true }
);

const salt = bcrypt.genSaltSync(10) || 10;

// general password hash
User.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, salt);
};

// isValidPassword
User.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// general token
User.methods.generalToken = function generalToken() {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role
    },
    process.env.SECRET_KEY,
    { expiresIn: 10 * 60 }
  );
};

User.methods.generalRefreshToken = function generalRefreshToken() {
  this.refresh_token = jwt.sign(
    {
      email: this.email,
      role: this.role
    },
    process.env.SECRET_KEY
  );
};

// user to json
User.methods.authToJson = function authToJson() {
  return {
    id: this._id,
    email: this.email,
    first_name: this.first_name,
    last_name: this.last_name,
    // token: this.generalToken(),
    // refresh_token: this.refresh_token,
    role: this.role,
    facebookAcc: this.facebookAcc
  };
};

module.exports = model('User', User);
