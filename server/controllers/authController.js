import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, config.jwt_secret, {
      expiresIn: '30d'
    });
    
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, config.jwt_secret, {
      expiresIn: '30d'
    });
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};