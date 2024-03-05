'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "id": 1,
        "name": "ARGENTINA",
      },
      {
        "id": 2,
        "name": "BRASIL",
      },
      {
        "id": 3,
        "name": "PARAGUAY",
      }
    ];

    const countries = list.map(item => {
      const timestamp = new Date();
      return {
        id: item.id,
        name: item.name,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('countries', countries, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('countries', null, {});
  }
};
