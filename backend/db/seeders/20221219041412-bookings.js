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
   options.tableName = 'Bookings'
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 2,
      startDate: new Date('12-07-2022'),
      endDate: new Date('12-12-2022')
    },
    {
      spotId: 2,
      userId: 1,
      startDate: new Date('2021-10-10'),
      endDate: new Date('2021-10-17')
    },
    {
      spotId: 1,
      userId: 2,
      startDate: new Date('2022-11-23'),
      endDate: new Date('2022-11-27')
    },
    {
      spotId: 2,
      userId: 1, 
      startDate: new Date('2022-01-15'),
      endDate: new Date('2022-01-18')
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
    options.tableName = 'Bookings'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {spotId:{
      [Op.in]: [1, 2, 3] 
    }}, {})
  }
};
