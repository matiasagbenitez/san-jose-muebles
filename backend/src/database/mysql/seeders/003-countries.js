'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "ARGENTINA",
      },
      {
        "name": "BRASIL",
      },
      {
        "name": "PARAGUAY",
      }
    ];

    const countries = list.map(item => {
      const timestamp = new Date();
      return {
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
