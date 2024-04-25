const express = require('express');
const { createUser, readUser } = require('../Controllers/ctrlUser');

const router = express.Router();

router.route('/register').post(createUser);
router.route('/login').get(readUser);
router.route('/forgot_password').post();
router.route('/read/all_products').get();

module.exports = router;
