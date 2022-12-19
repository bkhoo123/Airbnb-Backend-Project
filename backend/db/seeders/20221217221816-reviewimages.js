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
   options.tableName = 'ReviewImages'
   await queryInterface.bulkInsert(options, [
    {
      reviewId: 1,
      url: "fakeurl"
    },
    {
      reviewId: 1,
      url: "fakeurl2"
    },
    {
      reviewId: 2,
      url: "amazingurl"
    },
    {
      reviewId: 2,
      url: "notamazingurl"
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
    options.tableName = 'ReviewImages'
    await queryInterface.bulkDelete(options, {}, {})
  }
};
