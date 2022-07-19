const { verifiedToken } = require("../helpers/jwt&bcrypt");

const authors = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const roleUser = verifiedToken(access_token).role;
    if (roleUser !== "Admin") {
      throw { name: "You are not auhorized" };
    }
    next();
  } catch (error) {
    console.log(error);
    next(error)
  }
};

module.exports = {
  authors,
};
