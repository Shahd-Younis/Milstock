const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sanitizeUser = (user) => {
  const plain = user.toObject ? user.toObject() : user;
  delete plain.password;
  return plain;
};

const registerRules = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('military_number').notEmpty().withMessage('Employee code is required'),
  body('role').optional().isIn(['admin', 'unit']).withMessage('Role must be admin or unit'),
];

const loginRules = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = asyncHandler(async (req, res) => {
  const payload = { ...req.body, role: req.body.role || 'unit' };
  payload.password = await bcrypt.hash(payload.password, 12);

  const user = await User.create(payload);
  const token = signToken(user);

  res.status(201).json({ success: true, token, data: sanitizeUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user);
  res.json({ success: true, token, data: sanitizeUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: sanitizeUser(req.user) });
});

module.exports = { register, login, me, registerRules, loginRules };
