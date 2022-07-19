'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VideoPremium extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VideoPremium.belongsTo(models.Question,{
        foreignKey: "QuestionId"
      })
    }
  }
  VideoPremium.init({
    videoLink: DataTypes.STRING,
    QuestionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'VideoPremium',
  });
  return VideoPremium;
};