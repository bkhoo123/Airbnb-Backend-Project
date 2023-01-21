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
      review: 'Would love to stay here again',
      stars: 4
    },
    {
      spotId: 4,
      userId: 2,
      review: 'worst place ever',
      stars: 2  
    },
    {
      spotId: 3, 
      userId: 1, 
      review: 'I saw rats running around would never come here again',
      stars: 1
    },
    {
      spotId: 1,
      userId: 2,
      review: 'second time was much better',
      stars: 5
    }, 
    {
      spotId: 4,
      userId: 3, 
      review: 'Best Location Ever',
      stars: 5
    },
    {
      spotId: 1,
      userId: 4,
      review: 'This place is a dumpster',
      stars: 2
    },
    {
      spotId: 2, 
      userId: 3,
      review: 'So So would not recommend for your honeymoon',
      stars: 3
    },
    {
      spotId: 4,
      userId: 4,
      review: 'The last reviewer is tripping this place is a 5',
      stars: 5
    },
    {
      spotId: 5, 
      userId: 6,
      review: 'They forced us to do cleaning chores',
      stars: 1
    },
    {
      spotId: 6,
      userId: 5,
      review: 'Had to pay a cleaning fee',
      stars: 2
    },
    {
      spotId: 5,
      userId: 4,
      review: 'Feels like heaven',
      stars: 4
    },
    {
      spotId: 6,
      userId: 4,
      review: 'No way this is real',
      stars: 4
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
