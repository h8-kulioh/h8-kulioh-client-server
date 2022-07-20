'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WeeklyPremiumVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WeeklyPremiumVideo.belongsTo(models.QuestionWeeklyTest,{
        foreignKey: "QuestionWeeklyTestId"
      })
    }
  }
  WeeklyPremiumVideo.init({
    QuestionWeeklyTestId: DataTypes.INTEGER,
    videoLink: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'WeeklyPremiumVideo',
  });
  return WeeklyPremiumVideo;
};