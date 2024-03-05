'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "GREENWAY",
      },
      {
        "name": "EGGER",
      },
      {
        "name": "MASISA",
      },
      {
        "name": "HAFFELE",
      },
      {
        "name": "BLUM",
      },
      {
        "name": "SALICE",
      },
      {
        "name": "KESEBOHMER",
      },
      {
        "name": "HETTICH",
      },
      {
        "name": "GRASS",
      }
    ];

    const brands = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('brands', brands, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('brands', null, {});
  }
};
