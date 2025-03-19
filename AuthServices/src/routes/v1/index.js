const express = require('express');

const UserController = require('../../controllers/user-controller');
const { AuthRequestVaidators } = require('../../middlewares/index');
const router = express.Router();


router.post('/signup'
    , AuthRequestVaidators.validateUserAuth
    , UserController.create);
router.post('/signin',
    AuthRequestVaidators.validateUserAuth,
    UserController.signIn);

module.exports = router;
