import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export default {
  async index(req, res) {
    try {
      const users = await User.find();

      return res.json(users);
    } catch (err) {
      return res.sendStatus(500);
    }
  },

  async store(req, res) {
    const { name, email, birthDate, password } = req.body;

    const schema = yup.object().shape({
      name: yup
        .string()
        .required()
        .min(2),
      email: yup
        .string()
        .email()
        .required(),
      // birthDate: yup.date().required(),
      password: yup.string().required(),
    });

    const isValid = await schema.isValid({ name, email, password });

    if (!isValid) {
      return res.status(400).json({ error: 'body not valid' });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 8);

    try {
      const user = await User.create({
        name,
        email,
        birthDate,
        password: hash,
      });

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ err });
    }
  },

  async select(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.sendStatus(500);
    }
  },

  async update(req, res) {
    const { id } = req.user;
    const filename = req.file ? req.file.filename : null;
    const { name } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) user.name = name;
    if (filename) user.avatar = filename;

    await user.save();

    return res.json(user);
  },
};
