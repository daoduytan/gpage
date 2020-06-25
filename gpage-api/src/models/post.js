const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const { Schema, model } = mongoose;

const Post = new Schema(
  {
    title: { type: String },
    textMessage: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: new Date(),
      required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    images: {
      type: Array,
      defaulr: []
    }
  },
  { timestamps: true }
);

Post.plugin(mongoosePaginate);

module.exports = model('Post', Post);
