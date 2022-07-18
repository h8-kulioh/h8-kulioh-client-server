'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMajor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserMajor.belongsTo(models.Major, {foreignKey: 'MajorId'})
    }
  }
  UserMajor.init({
    UserId: DataTypes.INTEGER,
    MajorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserMajor',
  });
  return UserMajor;
};