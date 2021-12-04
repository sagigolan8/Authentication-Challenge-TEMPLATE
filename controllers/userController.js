const jwt = require('jsonwebtoken')
let USERS = require('../usersDB/users')
let INFORMATION = require('../usersDB/information')
let REFRESHTOKENS = require('../usersDB/refreshTokens')
const bcrypt = require("bcrypt");
const randToken = require("rand-token");


exports.login = (req,res)=>{
    console.log(REFRESHTOKENS);
    const {email,name,isAdmin} = req.user
    const userEmail = {email} 
    const accessToken = generateAccessToken(userEmail) 
    const refreshToken = randToken.uid(256);
    REFRESHTOKENS[refreshToken] = name;  
     res.status(200).send(                             
    {
        accessToken: accessToken, refreshToken: refreshToken,
        email , name, isAdmin 
    })
} 



exports.register = async(req,res)=>{
    INFORMATION.push({ email: req.body.email,info: req.body.name })
    await bcrypt.hash(req.body.password, 10, function(err, hash) {
         USERS.push({
            email: req.body.email, name: req.body.name, password: hash, isAdmin: false 
        })
    })
    res.status(201).send('Register success')
    // res.status(201).json(USERS)
}

exports.tokenValidate = (req,res)=>{
    res.json({valid: true})

}

exports.token = (req,res)=>{
    console.log('hi');
    console.log(req.user);
   const accessToken = generateAccessToken({email:req.user})
   res.json({accessToken})
}

exports.logout = (req,res)=>{
    res.status(200).send('User Logged Out Successfully')
}

function generateAccessToken(username) {
    return jwt.sign(username, process.env.SECRET, { expiresIn: '10m' })
  }