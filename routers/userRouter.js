const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { 
   authenticateToken, 
   isUserExist, 
   tryLogin,
   authenticateRefreshToken
  ,authenticateRefreshTokenLogOut
} = require('../middlewares/errorHandler')
const {
  login,    
  register,
  tokenValidate,
  token,
  logout,
} = require('../controllers/userController');



router.post('/register',isUserExist,register);
router.post('/login',tryLogin,login);
router.post('/token',authenticateRefreshToken,token);
router.post('/tokenValidate',authenticateToken,tokenValidate);
router.post('/logout',authenticateRefreshTokenLogOut,logout);



module.exports = router;
