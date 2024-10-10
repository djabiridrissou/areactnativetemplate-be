import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    console.log('dans lile', req.body);
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log('Hashed password:', user.password);

    await user.save();

    const payload = { user: { id: user.id } };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 360000 });

    res.json({ token });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return next(new Error('Invalid credentials'));
      }

      console.log('User email:', email);
console.log('Plain-text password:', password); // What the user provides during login
console.log('Stored hashed password:', user.password); // From the database
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        return next(new Error('Invalid password'));
      }
  
      const payload = { user: { id: user.id } };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 360000 });
      res.json({ token });
    } catch (err: any) {
      console.error(err.message);
      return next(err);
    }
  };