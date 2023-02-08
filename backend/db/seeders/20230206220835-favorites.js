'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'Favorites'
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 1,
      favorites: true
    },
    {
      spotId: 1,
      userId: 2,
      favorites: true
    },
    {
      spotId: 6,
      userId: 1, 
      favorites: true
    },
    {
      spotId: 7,
      userId: 1,
      favorites: true
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Favorites'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {spotId: {
      [Op.in]: [1, 6, 7]
    }}, {})
  }
};
