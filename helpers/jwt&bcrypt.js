const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const KEY = process.env.KEY

function hashPass(pass){
    return bcrypt.hashSync(pass,10)
}

function verifiedPass(pass1, pass2){
    return bcrypt.compareSync(pass1, pass2)
}

function createToken(payload){
    return jwt.sign(payload, KEY)
}

function verifiedToken(token){
    return jwt.verify(token, KEY)
}

module.exports = {
    hashPass,
    verifiedPass,
    createToken,
    verifiedToken
}
