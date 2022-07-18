'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionWeeklyTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      QuestionWeeklyTest.hasMany(models.QuestionKeyWeeklyTest,{
        foreignKey: "QuestionWeeklyTestId"
      })

      QuestionWeeklyTest.hasMany(models.AnswerWeeklyTest,{
        foreignKey: "QuestionWeeklyTestId"
      })
    }
  }
  QuestionWeeklyTest.init({
    subject: DataTypes.STRING,
    question: DataTypes.TEXT,
    releaseDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'QuestionWeeklyTest',
  });
  return QuestionWeeklyTest;
};