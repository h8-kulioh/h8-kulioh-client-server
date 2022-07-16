const {Major, University} = require("../models/index")

class MajorController {
    static async getMajor(req,res,next){
        try {
            const getMajor = await Major.findAll({
                include: [University]
            })
            res.status(200).json(getMajor)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {
    MajorController
}