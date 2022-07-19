const {TryOutHandler} = require('../models')

class TryOutController{
    static async getUserTryOut(req, res, next){
        try{
            const tryout = await TryOutHandler.findOne({
                where: {
                    tryoutdate: req.params.YYYYMMDD,
                    UserId: req.user.id
                }
            })
            if(!tryout) throw {name: "TryOut Registry Not Found"}
            res.status(200).json(tryout)
        }catch(err){
            next(err)
        }
    }

    static async startTryOut(req, res, next){
        try{
            const tryout = await TryOutHandler.create({
                tryoutdate: req.params.YYYYMMDD,
                UserId: req.user.id,
                tryoutstart: req.body.tryoutstart
            })
            res.status(201).json({message: 'new tryout registry created'})
        }catch(err){
            next(err)
        }
    }
}

module.exports = {
    TryOutController
}