const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const User = require('../models/userModel');
const { getAll, getOne, updateOne, deleteOne } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const userRules = [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('military_number').optional().notEmpty().withMessage('Employee code cannot be empty'),
  body('role').optional().isIn(['admin', 'unit']).withMessage('Role must be admin or unit'),
];

const createUser = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 12);
  }

  const user = await User.create(payload);
  const plain = user.toObject();
  delete plain.password;

  res.status(201).json({ success: true, data: plain });
});

const updateUser = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 12);
  }

  const user = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: user });
});

module.exports = {
  userRules,
  getUsers: getAll(User),
  getUser: getOne(User),
  createUser,
  updateUser,
  deleteUser: deleteOne(User),
};
