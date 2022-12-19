'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
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
   options.tableName = 'Reviews'
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1, 
      userId: 1,
      review: 'greatest place ever',
      stars: 4
    },
    {
      spotId: 2,
      userId: 2,
      review: 'worst place ever',
      stars: 2  
    },
    {
      spotId: 1, 
      userId: 1, 
      review: 'second time was much worse',
      stars: 1
    },
    {
      spotId: 2,
      userId: 2,
      review: 'second time was much better',
      stars: 5
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
    options.tableName = 'Reviews'
    await queryInterface.bulkDelete(options, {}, {})
  }
};
