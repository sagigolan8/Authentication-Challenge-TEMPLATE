const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const usersRouter = require('./userRouter')
const tokenCheck = require('../middlewares/tokenChecker')
const { USERS, INFORMATION } = usersRouter.params
const SECRET = 'bananas are yellow'

router.get('/information', tokenCheck, (req, res) => {
    const user = req.body.user
    if (user.isAdmin)
        res.status(200).send(INFORMATION)
    else
        res.status(200).send([INFORMATION.find(userInfo => userInfo.email === user.email)])
})

router.get('/users', tokenCheck, (req, res) => {
    const user = req.body.user
    if (user.isAdmin) res.status(200).send(USERS)
    else res.status(403).send("not admin")

})



module.exports = router