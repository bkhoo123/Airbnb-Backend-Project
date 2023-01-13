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
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Brad',
        lastName: 'Pitt',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'Anthony',
        lastName: 'Liu',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'Adrian',
        lastName: 'Khoo',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'khoobrian123@gmail.com',
        username: 'animelover123',
        firstName: 'Brian',
        lastName: 'Khoo',
        hashedPassword: bcrypt.hashSync('4Fire23inside$')
      },
      {
        email: 'lamegeek999@hotmail.com',
        username: 'truelover725',
        firstName: 'Lisa',
        lastName: 'Ng',
        hashedPassword: bcrypt.hashSync('truelovers12')
      },
      {
        email: 'miketyoss12@outlook.com',
        username: 'ipman123',
        firstName: 'Mike',
        lastName: 'Tyson',
        hashedPassword: bcrypt.hashSync('Punchingbag123')
      },
      {
        email: 'corsairrazer123',
        username: 'gaminggear222',
        firstName: 'Corsair',
        lastName: 'Razer',
        hashedPassword: bcrypt.hashSync('123adh')
      },
      {
        email: 'Lightattheend123@gmail.com',
        username: 'oneday123',
        firstName: 'One',
        lastName: 'Day',
        hashedPassword: bcrypt.hashSync('Keepgoing123')
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


