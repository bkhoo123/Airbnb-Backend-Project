'use strict';

const {Spot} = require('../models');


/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options, [
      { 
        ownerId: 1,
        address: '27 Weston Dr',
        city: 'Daly City',
        state: 'California',
        country: 'United States',
        lat: 37.70,
        lng: -122.49,
        name: 'Brian',
        description: 'nice home near beach',
        price: 275.50
      },
      {
        ownerId: 2,
        address: '307 El Dorado Dr',
        city: 'Daly City',
        state: 'California',
        country: 'United States',
        lat: 55.2,
        lng: -101.3,
        name: 'Richard',
        description: "nice house",
        price: 302.1
      },
      {
        ownerId: 3,
        address: 'Disney land',
        city: 'Anaheim',
        state: 'California',
        country: 'United States',
        lat: 98.3,
        lng: 102,
        name: 'Walt Disney',
        description: 'Where dreams come true',
        price: 1002.50
      },
      {
        ownerId: 4,
        address: 'Gods place',
        city: 'Heaven',
        state: 'Cloud area',
        country: 'Domain of the world',
        lat: 150,
        lng: 150,
        name: 'Holy Trinity',
        description: 'Where you go in the afterlife',
        price: 783.12
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['27 Weston Dr', '307 El Dorado Dr', 'Disney land', 'Gods place']}
    }, {})
  }
};

/**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */