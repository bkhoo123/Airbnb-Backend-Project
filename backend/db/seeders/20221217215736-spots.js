'use strict';

const {Spot} = require('../models');


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
    */options.tableName = 'Spots'
    await queryInterface.bulkInsert(options, [
      { 
        ownerId: 1,
        address: '121 Jenner Dr',
        city: 'Jenner',
        state: 'California',
        country: 'United States',
        lat: 37.70,
        lng: -122.49,
        name: 'Tim and Reuben',
        description: 'Nice Luxury Relaxing Home Near the Beach',
        price: 1499
      },
      {
        ownerId: 2,
        address: '1212 Nice Address San Rafael',
        city: 'San Rafael',
        state: 'California',
        country: 'United States',
        lat: 55.2,
        lng: -101.3,
        name: 'Mark',
        description: "Beautiful Bungalow",
        price: 169
      },
      {
        ownerId: 3,
        address: '40800 Morning Oak Ln',
        city: 'Oakhurst',
        state: 'California',
        country: 'United States',
        lat: 98.3,
        lng: 102,
        name: 'Natur Villas',
        description: 'Great location close to Yosemite',
        price: 1002.50
      },
      {
        ownerId: 4,
        address: '1218 Oceanfront Live St',
        city: 'Bolinas',
        state: 'California',
        country: 'Domain of the world',
        lat: 150,
        lng: 150,
        name: 'Holy Trinity',
        description: 'Where you go in the afterlife',
        price: 783.12
      },
      {
        ownerId: 5,
        address: '22 Moneterey Blvd',
        city: 'Monterey',
        state: 'California',
        country: 'United States',
        lat: 100,
        lng: -100,
        name: 'Scott',
        description: 'Great views of the Monterey Bay',
        price: 1083
      },
      {
        ownerId: 1, 
        address: '777 Mosstime Blvd',
        city: 'Moss Beach',
        state: 'California',
        country: 'United States',
        lat: 150,
        lng: 150,
        name: 'Millennium Flats',
        description: "Great Views and Great Sea Life",
        price: 986
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
    options.tableName = 'Spots'
    await queryInterface.bulkDelete(options, {}, {})
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