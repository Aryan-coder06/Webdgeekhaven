import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const register = async (req, res) => {
  try {
    console.log('Register endpoint hit with data:', req.body);
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    console.log('User created successfully:', user._id);
    
    const token = jwt.sign({ id: user._id }, config.jwt_secret, {
      expiresIn: '30d'
    });
    
    console.log('Token generated successfully');
    res.status(201).json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('Login endpoint hit with data:', { email: req.body.email });
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await user.matchPassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, config.jwt_secret, {
      expiresIn: '30d'
    });
    
    console.log('Login successful for user:', email);
    res.status(200).json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};
