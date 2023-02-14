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
        ownerId: 3,
        title: 'Invisible House Joshua Tree | Modern Masterpiece',
        address: '27 Joshua Tree',
        city: 'Joshua Tree',
        state: 'California',
        country: 'United States',
        lat: 37.70,
        lng: -122.49,
        name: 'Josh',
        description: 'Welcome to the greatest place to start achieving your rock climbing Dreams',
        price: 1250,
      },
      {
        ownerId: 2,
        title: 'Dome Sweet Dome: An OMG! Experience',
        address: '307 Dome Haven St',
        city: 'Bend',
        state: 'Oregon',
        country: 'United States',
        lat: 55.2,
        lng: -101.3,
        name: 'Richard',
        description: "Literally live the dome nature experience you have always wanted",
        price: 750.50
      },
      {
        ownerId: 3,
        title: 'Honey Silo Retreat',
        address: '777 WildWest Retreat',
        city: 'Kalispell',
        state: 'Montana',
        country: 'United States',
        lat: 98.3,
        lng: 102,
        name: 'True Cowboy',
        description: 'Live out your Wild West Dreams and come out to the silo retreat',
        price: 1002.50
      },
      {
        ownerId: 4,
        title: 'Paradise Ranch Inn',
        address: '123 Windowed Nature',
        city: 'Three Rivers',
        state: 'California',
        country: 'United States',
        lat: 150,
        lng: 150,
        name: 'Mother Nature',
        description: 'Literally blend right in with nature and live out your dreams to be one. Perfect for meditating and doing yoga.',
        price: 1750
      },
      {
        ownerId: 2,
        title: ' Emotional Healing',
        address: '999 Guitar Way',
        city: "Sindun-Myeon",
        state: 'Incheon-Si',
        country: 'South Korea',
        lat: 100,
        lng: 100,
        name: "BTS",
        description: "If you ever wondered what brought about BTS's music inspiration why not live in the very guitar house they lived in.",
        price: 2500
      },
      {
        ownerId: 6,
        title: 'Fjord Mountains Great Views',
        address: '170 Harsh Thundra',
        city: 'Forde',
        state: 'Vestland Fylke',
        country: 'Norway',
        lat: 122,
        lng: 75,
        name: 'BigFoot',
        description: "Come to the Icy Thundra and get a chance to possibly see Big Foot. Guaranteed to be -30F' or colder or your money back",
        price: 123,
      },
      {
        ownerId: 7,
        title: 'Barn Stay in a Hedge Maze Free Range Chicken Farm',
        address: '123 HedgeMaze',
        city: 'Tambon',
        state: 'Chang Wat',
        country: 'Thailand',
        lat: 122,
        lng: -75,
        name: 'TrueMazeWay',
        description: "Have you ever wanted to live in the rural country side and also go through a maze. This is your chance",
        price: 150.55,
      },
      {
        ownerId: 7,
        title: 'Gaudi Style House',
        address: '999 Gaudi Style',
        city: 'La Paz',
        state: 'Baja California',
        country: 'Mexico',
        lat: 180,
        lng: -21,
        name: 'Breaknam',
        description: 'Come live your dreams next to the great oceans of Mexico',
        price: 127,
      },
      {
        ownerId: 1, 
        title: 'On The Rocks Architectural Estate Dramatic Ocean',
        address: '177 Jenner Beach',
        city: 'Jenner',
        state: 'California',
        country: 'United States',
        lat: 111,
        lng: -56,
        name: 'Tim and Reuben',
        description: 'The Beach life you have always wanted to live out',
        price: 177.50,
      },
      {
        ownerId: 1,
        title: 'Tahoe Beach & Ski Club',
        address: 'South Lake Tahoe Blvd',
        city: 'South Lake Tahoe',
        state: 'California',
        country: 'United States',
        lat: 172,
        lng: 55,
        name: "Mike Tyson",
        description: 'Enjoy the great views and the Lake and the snow',
        price: 1002,
      },
      {
        ownerId: 1,
        title: 'Forest of Death Experienced Directly with the Forest',
        address: 'Forest of Death',
        city: 'Kyoto',
        state: 'Kyoto Fu',
        country: 'Japan',
        lat: 111,
        lng: 172,
        name: 'Samurai',
        description: 'Live with one with the forest',
        price: 1777,
      },
      {
        ownerId: 1,
        title: 'Perfect Home of Your Dreams Perfect for Parties',
        address: '3817 Caledonia Bay Lookout',
        city: 'Pacific Grove',
        state: 'California',
        country: 'United States',
        lat: 111,
        lng: -51,
        name: "True Home",
        description: 'Dream Home',
        price: 122,
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
      address: { [Op.in]: ['27 Joshua Tree', '307 Dome Haven St', '777 WildWest Retreat', '123 Windowed Nature', '999 Guitar Way', '170 Harsh Thundra', '123 HedgeMaze', '999 Gaudi Style']}
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