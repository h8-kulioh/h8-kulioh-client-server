const errorHandler = (err, req, res, next)=>{
    console.log(err, 'tes')
    let code = 500
    let message = 'Internal Server Error'

    if(err.name==='Invalid email/password'){
        code = 401
        message = err.name
    }

    res.status(code).json({message})
}

module.exports = errorHandler