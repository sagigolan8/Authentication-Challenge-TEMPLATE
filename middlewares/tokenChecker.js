const jwt = require('jsonwebtoken')
const SECRET = 'bananas are yellow'

const tokenCheck = (req, res, next) => {
    let token = req.headers.authorization
    if (token === undefined) return res.status(401).send("Access Token Required")
    token = token.split(" ")[1]
    if (!token.includes('.')) return res.status(403).send("Invalid Access Token")
    const user = jwt.verify(token, SECRET, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(403).send("Invalid Access Token")
        }
        return result
    });
    if (user === undefined) return res.status(403).send("Invalid Access Token")
    else {
        req.body.user = user
        next()
    }
}


module.exports = tokenCheck