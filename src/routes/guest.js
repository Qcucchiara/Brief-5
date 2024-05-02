const express = require('express');
const {
  createUser,
  readUser,
  valideAccount,
} = require('../Controllers/ctrlUser');

const router = express.Router();

router.route('/register').post(createUser);
router.route('/login').post(readUser);
router.route('/forgot_password').post();
router.route('/read/all/products').get();
router.route('/valide/user/:token').patch(valideAccount);

// /user/activate/${activationToken}

module.exports = router;
