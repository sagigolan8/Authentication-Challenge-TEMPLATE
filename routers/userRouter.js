const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const randToken = require("rand-token")
const SECRET = 'bananas are yellow'

const USERS = [
    {
        email: 'admin@email.com',
        name: 'admin',
        password: '$2b$10$E8wz2rwykOb0fznJMZJcRuxghzLPQ5/ebW15LP2SrkNDb5KqW4vj6',
        isAdmin: true,
    },
    {
        email: "yuval@email.com",
        name: "yuval",
        password: "$2b$10$r.vt1MrciXj5rQAiNjT.hub6WJBoHSGzVRHMxI93AYkubHSn.88D6",
        isAdmin: false
    }


];
const INFORMATION = [{ email: "yuval@email.com", info: 'yuval info' }]; // {email: ${email}, info: "${name} info"}
const REFRESHTOKENS = [];

router.post('/register', (req, res) => {
    const { email, name, password } = req.body
    if (USERS.find(user => user.email === email))
        res.status(409).send("user already exists")
    else {
        USERS.push({ email, name, password: bcrypt.hashSync(password, 10), isAdmin: false })
        INFORMATION.push({ email, info: `${name} info` })
        res.status(201).send("Register Success")

    }
})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    const userObj = USERS.find(a => a.email === email)
    if (userObj === undefined)
        res.status(404).send("user not found")
    else {
        if (bcrypt.compareSync(password, userObj.password)) {
            const accessToken = jwt.sign(userObj, SECRET, { expiresIn: 10 })
            const refreshToken = randToken.uid(16)
            REFRESHTOKENS[refreshToken] = userObj
            res.status(200).send({ accessToken, refreshToken, email, name: userObj.name, isAdmin: userObj.isAdmin })
        }
        else
            res.status(403).send('password incorrect')
    }
})
router.post('/tokenValidate', (req, res) => {
    let authToken = req.headers.authorization
    if (authToken === undefined)
        return res.status(400).send("cannot find user")
    authToken = authToken.split(" ")[1]
    if (jwt.verify(authToken, SECRET))
        res.status(200).send({ valid: true })
    else
        res.status(403).send("Invalid Access Token")
})
router.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken === undefined)
        return res.status(401).send("Refresh Token Required")
    if (refreshToken in REFRESHTOKENS) {
        const userObj = REFRESHTOKENS[refreshToken]
        res.status(200).send({ accessToken: jwt.sign(userObj, SECRET, { expiresIn: 10 }) })
    }
    else
        res.status(403).send("Invalid Refresh Token")
})
router.post('/logout', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken === undefined)
        return res.status(400).send("Refresh Token Required")
    if (refreshToken in REFRESHTOKENS) {
        REFRESHTOKENS.splice(refreshToken, 1)
        res.status(200).send("User Logged Out Successfully")
    }
    else
        res.status(400).send("Invalid Refresh Token")
})
router.params = { USERS, INFORMATION, REFRESHTOKENS }
module.exports = router