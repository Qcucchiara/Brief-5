const express = require('express');
const {
  readAllUser,
  updateUser,
  changeRoleUser,
} = require('../Controllers/ctrlUser');

const router = express.Router();

router.route('/read/all_users').get(readAllUser);
router.route('/update/user').patch(updateUser);
router.route('/update/role/user/:user_id').patch(changeRoleUser);
// observation: avec cette structure de routes, la table 'role' ne sert a rien, j'aurais pu juste mettre une colonne 'role'.

module.exports = router;
