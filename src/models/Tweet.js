import mongoose, { Schema } from 'mongoose';

const TweetSchema = mongoose.Schema(
  {
    text: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model('Tweet', TweetSchema);

export default Tweet;
