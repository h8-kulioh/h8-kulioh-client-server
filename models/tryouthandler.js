'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TryOutHandler extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TryOutHandler.init({
    UserId: DataTypes.INTEGER,
    tryoutdate: DataTypes.STRING,
    tryoutstart: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TryOutHandler',
  });
  return TryOutHandler;
};