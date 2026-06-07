const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  userRules,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.route('/').get(getUsers).post(userRules, validate, createUser);
router.route('/:id').get(getUser).put(userRules, validate, updateUser).delete(deleteUser);

module.exports = router;
