'use strict';
const {Model, Validator} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      )
      Favorite.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      )
    }
  }
  Favorite.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    favorites: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};