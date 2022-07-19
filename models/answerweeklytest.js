'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnswerWeeklyTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AnswerWeeklyTest.belongsTo(models.User, {
        foreignKey: 'UserId'
      })

      AnswerWeeklyTest.belongsTo(models.QuestionWeeklyTest,{
        foreignKey: "QuestionWeeklyTestId"
      })
    }
  }
  AnswerWeeklyTest.init({
    QuestionWeeklyTestId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    userAnswer: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AnswerWeeklyTest',
  });
  return AnswerWeeklyTest;
};