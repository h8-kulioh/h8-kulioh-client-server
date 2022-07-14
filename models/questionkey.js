'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QuestionKey.init({
    QuestionId: DataTypes.INTEGER,
    answer: DataTypes.TEXT,
    correct: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'QuestionKey',
  });
  return QuestionKey;
};