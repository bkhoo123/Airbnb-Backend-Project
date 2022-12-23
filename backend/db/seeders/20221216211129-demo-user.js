'use strict';
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'greathomerenter123@gmail.com',
        username: 'greathomer123',
        firstName: 'Tyler',
        lastName: 'Craig',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'gamelover999',
        firstName: 'Anthony',
        lastName: 'James',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'realhomies456',
        firstName: 'Friendship',
        lastName: 'ForLife',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'dakhoofamily123@outlook.com',
        username: 'animelover123',
        firstName: 'Brian',
        lastName: 'Khoo',
        hashedPassword: bcrypt.hashSync('4Fireinside$')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};


