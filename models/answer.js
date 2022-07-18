'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Answer.belongsTo(models.User,{
        foreignKey: "UserId"
      })

      Answer.belongsTo(models.Question,{
        foreignKey: "QuestionId"
      })

      Answer.belongsTo(models.QuestionKey, {foreignKey: 'userAnswer'})
    }
  }
  Answer.init({
    QuestionId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    userAnswer: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};