const express = require('express');
const { createUser } = require('../Controllers/ctrlUser');

const router = express.Router();

router.route('/register').post(createUser);
router.route('/login').get();
router.route('/forgot_password').post();
router.route('/read/all_products').get();

module.exports = router;
