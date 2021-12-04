const USERS = require('../usersDB/users')
const INFORMATION = require('../usersDB/information')
const REFRESHTOKENS = require('../usersDB/refreshTokens')
const jwt = require('jsonwebtoken')
exports.users = (req,res)=>{
    res.status(200).send(USERS)
    // res.status(200).send({body:{USERS}})
}

exports.information = (req,res)=>{
    res.status(200).send(INFORMATION)
}

exports.validateAdminToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'] 
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send('Access Token Required')
      jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).send('Invalid Access Token')
      }
      next()
    })
}   


exports.refreshTokens = (req,res)=>{
    res.send(REFRESHTOKENS)
}
