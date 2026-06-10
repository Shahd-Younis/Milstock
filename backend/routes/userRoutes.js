const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  userRules,
  createUserRules,
  statusRules,
  passwordRules,
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserStatus,
  resetUserPassword,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.route('/').get(getUsers).post(createUserRules, validate, createUser);
router.patch('/:id/status', statusRules, validate, updateUserStatus);
router.patch('/:id/password', passwordRules, validate, resetUserPassword);
router.route('/:id').get(getUser).put(userRules, validate, updateUser).patch(userRules, validate, updateUser).delete(deleteUser);

module.exports = router;
