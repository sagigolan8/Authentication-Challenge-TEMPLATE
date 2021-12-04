const express = require("express")
const morgan = require("morgan")
const usersRouter = require('./routers/userRouter')
const apiRouter = require('./routers/apiRouter')

const { optionsCheck } = require("./controllers/options");
const app = express()




app.use(morgan('dev'))
app.use(express.json())
app.use('/users', usersRouter)
app.use('/api/v1', apiRouter)

app.options('/', async (req, res) => {
    const token = req.headers.authorization
    const possibleRequests = await optionsCheck(token)
    res.status(200).set({ "Allow": "OPTIONS, GET, POST" }).send(possibleRequests)
})










module.exports = app