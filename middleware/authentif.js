const { verifiedToken } = require("../helpers/jwt&bcrypt.js");
const { User } = require("../models/index.js");

const authentif = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    const payload = verifiedToken(access_token);

    const userLogged = await User.findOne({
      where: {
        id: payload.id,
        email: payload.email,
      },
    });

    if (!userLogged) {
      throw { name: "JsonWebTokenError" };
    }

    req.user = {
      id: userLogged.id,
      email: userLogged.email,
      role: userLogged.role,
    };
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  authentif,
};
