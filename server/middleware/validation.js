// Validation middleware for request data
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // Email validation
  if (!email) {
    errors.push('Email is required');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

export const validateCategory = (req, res, next) => {
  const { title } = req.body;
  
  if (!title || title.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Category title must be at least 2 characters long' 
    });
  }

  next();
};

export const validateQuestion = (req, res, next) => {
  const { title } = req.body;
  
  if (!title || title.trim().length < 5) {
    return res.status(400).json({ 
      error: 'Question title must be at least 5 characters long' 
    });
  }

  next();
};
