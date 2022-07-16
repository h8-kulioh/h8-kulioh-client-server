const {Question, QuestionKey} = require('../models')

class questionController {
    static async getQuestionDaily(req, res, next){
        try{
            const questions = await Question.findAll({
                where: {
                    releaseDay: Math.ceil((new Date().getTime() - new Date(req.user.createdAt).getTime())/(1000 * 3600 * 24))
                },
                include: [QuestionKey]
            })
            res.status(200).json(questions)
        }catch(err){
            next(err)
        }
    }
}

module.exports = {
    questionController
}