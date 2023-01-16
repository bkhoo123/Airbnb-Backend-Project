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
      spotId: 1,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-755137040389728919/original/aa381c0f-34da-4192-8c30-f68c25dc9eae.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 1, 
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-755137040389728919/original/0182ef99-6e17-402b-8205-c4db785dbc6d.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 1, 
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-755137040389728919/original/504ccb6a-02cd-400c-84c8-db07a8174f05.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 1,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-755137040389728919/original/e796794a-9252-4766-8216-cea3f58afdbd.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 2,
      url: 'https://a0.muscache.com/im/pictures/1e16f2f4-1256-44cb-a0f2-85aa57672a45.jpg?im_w=1200',
      preview: true
    },
    {
      spotId: 2, 
      url: "https://a0.muscache.com/im/pictures/d8861dba-37c3-483b-98a4-9c199d60476b.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 2,
      url: "https://a0.muscache.com/im/pictures/32ef68c3-d815-45cb-b3c5-97f7eb38d842.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 2,
      url: "https://a0.muscache.com/im/pictures/02d014d6-b33a-4060-acbf-e8c02b3a7997.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 2,
      url: "https://a0.muscache.com/im/pictures/c05ff63e-8bf1-4a4f-bb20-6782703bb79b.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 3,
      url: 'https://a0.muscache.com/im/pictures/4270f394-8caf-4e97-a9d5-102c681b3145.jpg?im_w=1200',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://a0.muscache.com/im/pictures/94811b02-35be-4a9b-bdea-1193100547da.jpg?im_w=720',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://a0.muscache.com/im/pictures/63567b8f-b126-4064-9da1-acee72885a47.jpg?im_w=720',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://a0.muscache.com/im/pictures/7d4cd3a6-b4dc-4862-af05-c0c19fbc4b78.jpg?im_w=720',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://a0.muscache.com/im/pictures/7aef96dd-91bb-4709-b22a-2e53154237f1.jpg?im_w=720',
      preview: true
    },
    {
      spotId: 4, 
      url: 'https://a0.muscache.com/im/pictures/miso/Hosting-590620302190559469/original/e4a568dc-9091-40ed-b226-709dd7e6c31b.jpeg?im_w=1200',
      preview: true
    }, 
    {
      spotId: 4, 
      url: 'https://a0.muscache.com/im/pictures/e70d0bc4-93d6-4eed-9f40-4fc089778376.jpg?im_w=720',
      preview: true
    }, 
    {
      spotId: 4, 
      url: 'https://a0.muscache.com/im/pictures/miso/Hosting-590620302190559469/original/49defc79-18aa-4fdd-8f1c-2d6332f9c41c.png?im_w=720',
      preview: true
    }, 
    {
      spotId: 4, 
      url: 'https://a0.muscache.com/im/pictures/miso/Hosting-590620302190559469/original/49defc79-18aa-4fdd-8f1c-2d6332f9c41c.png?im_w=720',
      preview: true
    }, 
    {
      spotId: 4, 
      url: 'https://a0.muscache.com/im/pictures/053582f8-aa26-4e0e-aeca-3c15d8087d5c.jpg?im_w=720',
      preview: true
    }, 
    {
      spotId: 5,
      url: 'https://a0.muscache.com/im/pictures/6722a3eb-783f-4208-9aca-b4dab3415233.jpg?im_w=1200',
      preview: true,
    }, 
    {
      spotId: 5,
      url: 'https://a0.muscache.com/im/pictures/c2120b84-291d-4738-a911-97672d2ab3f2.jpg?im_w=720',
      preview: true,
    }, 
    {
      spotId: 5,
      url: 'https://a0.muscache.com/im/pictures/8db2283f-9f6c-4160-afb4-6f23b06c4217.jpg?im_w=720',
      preview: true,
    }, 
    {
      spotId: 5,
      url: 'https://a0.muscache.com/im/pictures/5f5cb08f-c436-4ad3-8be7-325a2f54123f.jpg?im_w=720',
      preview: true,
    }, 
    {
      spotId: 5,
      url: 'https://a0.muscache.com/im/pictures/8bbe2dae-f9a5-4d5e-b682-5a8c2bc2231a.jpg?im_w=720',
      preview: true,
    }, 
    {
      spotId: 6, 
      url: "https://a0.muscache.com/im/pictures/c596d286-57a6-460e-b6a8-9698b6f31157.jpg?im_w=1200",
      preview: true
    },
    {
      spotId: 6, 
      url: "https://a0.muscache.com/im/pictures/6df63a59-7ad7-4a4a-b28d-9796b5b97b0a.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 6, 
      url: "https://a0.muscache.com/im/pictures/42765c15-00bd-443b-9111-c13336bc2665.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 6, 
      url: "https://a0.muscache.com/im/pictures/07baa603-c907-4d7e-9813-a6dddc734b77.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 6, 
      url: "https://a0.muscache.com/im/pictures/06af3372-d4b7-43c6-ad07-fd4883eb2b36.jpg?im_w=720",
      preview: true
    },

    {
      spotId: 7,
      url: "https://a0.muscache.com/im/pictures/miso/Hosting-46130832/original/65de82db-e347-461e-a66b-5d15f16afbe3.jpeg?im_w=1200",
      preview: true
    },
    {
      spotId: 7,
      url: "https://a0.muscache.com/im/pictures/51c797bc-b5ae-485a-a85e-e034151f3b10.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 7,
      url: "https://a0.muscache.com/im/pictures/2e846b2d-9505-46e9-a85b-e53b90e460ca.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 7,
      url: "https://a0.muscache.com/im/pictures/miso/Hosting-46130832/original/cecc6c27-905c-46e9-b6e8-e46837201c95.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 7,
      url: "https://a0.muscache.com/im/pictures/miso/Hosting-46130832/original/bb1ec586-5032-4fed-aa87-9763166c7d5e.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 8,
      url: "https://a0.muscache.com/im/pictures/6722a3eb-783f-4208-9aca-b4dab3415233.jpg?im_w=1200",
      preview: true
    },
    {
      spotId: 8,
      url: "https://a0.muscache.com/im/pictures/4dec2e9d-eeb2-461c-8ed5-21cce36e1de6.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 8,
      url: "https://a0.muscache.com/im/pictures/b37a638c-3e00-4da3-a4b3-19ad5ed5d6bf.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 8,
      url: "https://a0.muscache.com/im/pictures/15fb4b68-a952-489e-8902-96fa30aa9442.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 8,
      url: "https://a0.muscache.com/im/pictures/00c02e71-87fb-4a39-af7d-27db45b3f11a.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 9,
      url: "https://a0.muscache.com/im/pictures/c4c92198-fb3a-4c4b-bbb6-3aa8af8f7e73.jpg?im_w=1200",
      preview: true,
    },
    {
      spotId: 9,
      url: "https://a0.muscache.com/im/pictures/313b1ffa-b52c-4aba-b51f-80e94d3f2be1.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 9,
      url: "https://a0.muscache.com/im/pictures/29087f74-bd90-4cce-aa65-435673b2c3db.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 9,
      url: "https://a0.muscache.com/im/pictures/33d7a8ad-d549-4f0e-9c0d-a0d9870ec41b.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 9,
      url: "https://a0.muscache.com/im/pictures/76672df0-df76-490b-8f77-dee11757ceae.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 10,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-52164041/original/0ec35045-75e7-4fd1-9727-1f8539adf446.jpeg?im_w=1200",
      preview: true
    },
    {
      spotId: 10,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-52164041/original/846dc0b0-2353-40ba-a92c-53b026543235.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 10,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-52164041/original/47ac4f24-108a-4c3a-bb56-bbdc00ca3b46.jpeg?im_w=720",
      preview: true,
    },
    {
      spotId: 10, 
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-52164041/original/506ef326-1b31-4b58-b65d-67f64f2dfba2.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 10,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-52164041/original/23fb953c-24a1-4553-b723-3150c8a0e4fa.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 11,
      url: "https://a0.muscache.com/im/pictures/0da7817c-9e56-4463-8075-171aa00fa2c2.jpg?im_w=1200",
      preview: true
    },
    {
      spotId: 11,
      url: "https://a0.muscache.com/im/pictures/a30fceec-037f-4792-bbd5-3686707fc1a5.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 11,
      url: "https://a0.muscache.com/im/pictures/a3b64dcd-a35f-4785-8f69-9fd0b3c3d10b.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 11,
      url: "https://a0.muscache.com/im/pictures/43ff26df-b486-4189-a3ca-0aa6ba168c7f.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 11,
      url: "https://a0.muscache.com/im/pictures/72be0e99-05b5-4606-b7eb-775d04b0c6bf.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 12,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-48803070/original/1be5aa7a-6304-4fd3-b80e-11ebc82844d2.jpeg?im_w=1200",
      preview: true,
    }, 
    {
      spotId: 12,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-48803070/original/39c0260e-8b86-4d62-a091-1c4427558156.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 12,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-48803070/original/20b61026-2a57-4b0a-ab2f-1dbd3a7bfb68.jpeg?im_w=720",
      preview: true
    }, 
    {
      spotId: 12,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-48803070/original/02afc5fa-04f5-4b91-8763-f5abb576019c.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 12,
      url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-48803070/original/199de174-94ac-4475-8416-6da32d3f5177.jpeg?im_w=720",
      preview: true
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
