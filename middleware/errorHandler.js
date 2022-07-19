const errorHandler = (err, req, res, next)=>{
    console.log(err, 'tes')
    let code = 500
    let message = 'Internal Server Error'

    if(err.name==='Invalid email/password'){
        code = 401
        message = err.name
    }

    if(err.name==='Email is required'||err.name==='Password is required'||err.name==='Name is required'){
        code = 400
        message = err.name
    }

    if(err.name==='JsonWebTokenError'){
        code = 401
        message = 'Invalid Token'
    }

    res.status(code).json({statusCode: code, message})
}

module.exports = errorHandler