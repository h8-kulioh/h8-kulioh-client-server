const errorHandler = (err, req, res, next)=>{
    console.log(err, 'tes')
    let code = 500
    let message = 'Internal Server Error'

    if(err.name==='Invalid email/password'){
        code = 401
        message = err.name
    }

    if(err.name==='You are already premium'){
        code = 403
        message = err.name
    }

    if(err.name==='Answers is not found'){
        code = 404
        message = err.name
    }

    if(err.name==="Your name can't be different" || err.name==="Your email can't be different"){
        code = 400
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

    if(err.name==='Transaction failed'){
        code = 401
        message = err.name
    }

    res.status(code).json({message})
}

module.exports = errorHandler