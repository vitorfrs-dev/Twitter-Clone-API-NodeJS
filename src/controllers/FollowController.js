import User from '../models/User';

export default {
  async store(req, res) {
    const { id: userId } = req.user;
    const { id } = req.params;

    const user = await User.findById(userId);
    const followUser = await User.findById(id);

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (!followUser) {
      return res.status(400).json({ msg: 'User not found' });
    }

    user.following.push(followUser._id);
    followUser.followers.push(user._id);

    await user.save();
    await followUser.save();

    return res.json({
      msg: `user ${user.name} is following ${followUser.name}`,
    });
  },

  async delete(req, res) {
    const { id: userId } = req.user;
    const { id } = req.params;

    const user = await User.findById(userId);
    const followUser = await User.findById(id);

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (!followUser) {
      return res.status(400).json({ msg: 'User not found' });
    }

    user.following.pull(followUser._id);
    followUser.followers.pull(user._id);

    await user.save();
    await followUser.save();

    return res.json({
      msg: `user ${user.name} has unfollow ${followUser.name}`,
    });
  },
};
