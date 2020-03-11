import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import User from '../models/User';
import tokenConfig from '../config/tokenConfig';

export default {
  async store(req, res) {
    const { email, password } = req.body;
    const schema = yup.object().shape({
      email: yup
        .string()
        .email()
        .required(),
      password: yup.string().required(),
    });

    const valid = await schema.isValid(req.body);

    if (!valid) {
      return res.status(400).json({ error: 'body not valid' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(403).json({ msg: 'Invalid Password' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECREAT,
      tokenConfig
    );

    return res.status(200).json({
      user,
      token,
    });
  },
};
