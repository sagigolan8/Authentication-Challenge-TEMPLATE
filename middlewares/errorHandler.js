let USERS = require('../usersDB/users')
let REFRESHTOKENS = require('../usersDB/refreshTokens')
// const util = require('util')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.errorHandler = (err, req, res,next)=> {
  console.log(err);
    if (!err.status) {
      res.status(500);
      return res.send(err.message);
    }
    res.status(err.status);
    res.send(err.message);
  }
  
exports.unknownEndpoint = (req, res, next) => {
    res.status(404).json({ error: 'Unknown endpoint' });
    next();
  };

exports.authenticateToken = (req, res, next)=> {
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).send('Access Token Required')
    jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).send('Invalid Access Token')
    }
      req.user = user
    next()
  })
}

exports.isUserExist = async (req,res,next)=>{
    let checkUser = false
     await USERS.forEach((user)=>{
      if((user.email) === (req.body.email)){
       checkUser = true
    }})
    if(checkUser===true)
    return res.status(409).send('user already exists')
    next()
}

exports.tryLogin = async (req,res,next)=>{ 
    let checkUser
    USERS.forEach((user)=>{
      if((user.email) !== (req.body.email))
      checkUser = null
      else
      checkUser = user
    })
    if(!checkUser)
    return res.status(404).send('cannot find user')
    const resposnse = await bcrypt.compare(req.body.password, checkUser.password)
    if(!resposnse)
    return res.status(403).send('User or Password incorrect')
    req.user = checkUser
    next()
}
exports.authenticateRefreshToken = (req,res,next)=>{
  const {token} = req.body
    if (!token)
    return res.status(401).send('Refresh Token Required')
    if(!(token in REFRESHTOKENS))
    return res.status(403).send('Invalid Refresh Token')
    req.user = REFRESHTOKENS[token]
    next()
}
exports.authenticateRefreshTokenLogOut = (req,res,next)=>{
  const {token} = req.body
    if (!token)
    return res.status(400).send('Refresh Token Required')
    if(!(token in REFRESHTOKENS))
    return res.status(400).send('Invalid Refresh Token')
    req.user = REFRESHTOKENS[token]
    next()
}