import mongoose, { Schema } from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    birthDate: Date,
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    avatar: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.virtual('avatarUrl').get(function () {
  if (this.avatar) {
    return `http://localhost:3003/files/${this.avatar}`;
  }
  return null;
});

const User = mongoose.model('User', UserSchema);

export default User;
