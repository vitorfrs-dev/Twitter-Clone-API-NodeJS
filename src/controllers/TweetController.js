import * as yup from 'yup';
import Tweet from '../models/Tweet';
import User from '../models/User';

export default {
  async store(req, res) {
    const { text } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    const schema = yup.object().shape({
      text: yup
        .string()
        .min(2)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid text' });
    }

    if (!user) {
      res.status(404).json({ msg: 'user not found' });
    }

    const tweet = await Tweet.create({
      text,
      createdBy: user._id,
    });

    await tweet.populate('createdBy', 'name email').execPopulate();

    return res.json(tweet);
  },

  async index(req, res) {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tweets = await Tweet.find({
      $or: [{ createdBy: { $in: user.following } }, { createdBy: user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email avatar')
      .exec();

    return res.json(tweets);
  },

  async update(req, res) {
    const { id } = req.user;
    const { tweetId } = req.params;
    const { text } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    if (tweet.createdBy !== id) {
      return res
        .status(403)
        .json({ error: 'Only the owner of the tweet can change it' });
    }

    tweet.text = text;

    await tweet.save();

    return res.json(tweet);
  },

  async delete(req, res) {
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId);

    await tweet.remove();

    return res.sendStatus(200);
  },
};
