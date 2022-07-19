const { verifiedToken } = require("../helpers/jwt&bcrypt.js");
const { User } = require("../models/index.js");

const authentif = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if(!access_token){
      throw { name: "JsonWebTokenError" }
    }

    const payload = verifiedToken(access_token);

    const userLogged = await User.findOne({
      where: {
        id: payload.id,
        email: payload.email,
      },
    });
    
    req.user = {
      id: userLogged.id,
      email: userLogged.email,
      name: userLogged.name,
      role: userLogged.role,
      createdAt: userLogged.createdAt
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authentif,
};
