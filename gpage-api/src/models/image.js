const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const Image = new Schema(
  {
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    size: { type: Number },
    url: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model('Image', Image);
