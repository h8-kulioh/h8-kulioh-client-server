'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionKeyWeeklyTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      QuestionKeyWeeklyTest.belongsTo(models.QuestionWeeklyTest,{
        foreignKey: "QuestionWeeklyTestId"
      })
    }
  }
  QuestionKeyWeeklyTest.init({
    QuestionWeeklyTestId: DataTypes.INTEGER,
    answer: DataTypes.TEXT,
    correct: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'QuestionKeyWeeklyTest',
  });
  return QuestionKeyWeeklyTest;
};