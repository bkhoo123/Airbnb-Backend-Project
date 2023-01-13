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
   options.tableName = 'SpotImages'
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-755137040389728919/original/5ec1e319-fafd-4827-9841-c9fd43563120.jpeg?im_w=1200",
      preview: true
    },
    {
      spotId: 2,
      url: 'https://a0.muscache.com/im/pictures/1e16f2f4-1256-44cb-a0f2-85aa57672a45.jpg?im_w=1200',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://a0.muscache.com/im/pictures/4270f394-8caf-4e97-a9d5-102c681b3145.jpg?im_w=1200',
      preview: true
    },
    {
      spotId: 4, 
      url: 'https://a0.muscache.com/im/pictures/miso/Hosting-590620302190559469/original/e4a568dc-9091-40ed-b226-709dd7e6c31b.jpeg?im_w=1200',
      preview: true
    }, 
    {
      spotId: 5,
      url: 'https://a0.muscache.com/im/pictures/6722a3eb-783f-4208-9aca-b4dab3415233.jpg?im_w=1200',
      preview: true,
    }, 
    {
      spotId: 6, 
      url: "https://a0.muscache.com/im/pictures/c596d286-57a6-460e-b6a8-9698b6f31157.jpg?im_w=1200",
      preview: true
    },
    {
      spotId: 7,
      url: "https://a0.muscache.com/im/pictures/miso/Hosting-46130832/original/65de82db-e347-461e-a66b-5d15f16afbe3.jpeg?im_w=1200",
      preview: true
    },
    {
      spotId: 8,
      url: "https://a0.muscache.com/im/pictures/6722a3eb-783f-4208-9aca-b4dab3415233.jpg?im_w=1200",
      preview: false
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
    options.tableName = 'SpotImages'
    await queryInterface.bulkDelete(options, {}, {})
  }
};
