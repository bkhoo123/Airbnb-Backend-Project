'use strict';
const {Model, Validator} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      )
      Review.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      )
      Review.hasMany(
        models.ReviewImage,
        {foreignKey: 'reviewId'}
      )
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isNumber(value) {
          if (isNaN(value)) throw new Error("Must be a number between 1 and 5")
          if (value < 1 || value > 5) throw new Error("Must be a number between 1 and 5 ")
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};