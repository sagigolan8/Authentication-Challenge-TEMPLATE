const router = require('express').Router()
const {
  information,
  users,
  refreshTokens,
  validateAdminToken
} = require('../controllers/apiController');

router.get('/v1/users', validateAdminToken, users);

router.get('/v1/information', information);

router.get('/v1/refreshTokens', refreshTokens);//for checking

module.exports = router;
