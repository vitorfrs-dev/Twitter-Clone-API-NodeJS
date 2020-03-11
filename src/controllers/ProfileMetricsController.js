import User from '../models/User';
import Tweet from '../models/Tweet';

export default {
  async index(req, res) {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followers = user.followers.length;
    const following = user.following.length;

    const tweets = await Tweet.count({ createdBy: user._id });

    return res.status(200).json({
      followers,
      following,
      tweets,
    });
  },
};
