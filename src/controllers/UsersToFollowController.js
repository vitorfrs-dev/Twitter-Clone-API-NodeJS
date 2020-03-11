import User from '../models/User';

export default {
  async index(req, res) {
    const { id } = req.user;

    const currentUser = await User.findById(id);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const usersToFollow = await User.find(
      {
        _id: { $nin: [...currentUser.following, currentUser._id] },
      },
      'name email avatar avatarUrl'
    );

    return res.json(usersToFollow);
  },
};
