"use strict";
const { Model } = require("sequelize");
const { hashPass } = require("../helpers/jwt&bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Major, {through: 'UserMajors'})
      User.hasMany(models.Answer,{
        foreignKey: "UserId"
      })

      User.hasMany(models.Todo,{
        foreignKey: "UserId"
      })

      User.hasMany(models.UserMajor, {
        foreignKey: 'UserId'
      })

      User.hasMany(models.AnswerWeeklyTest, {
        foreignKey: 'UserId'
      })
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(instance, options) {
          instance.password = hashPass(instance.password);
        },
      },
    }
  );
  return User;
};
