'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.QuestionKey)
      Question.hasMany(models.Answer,{
        foreignKey: "QuestionId"
      })
    }
  }
  Question.init({
    subject: DataTypes.STRING,
    question: DataTypes.TEXT,
    releaseDay: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};