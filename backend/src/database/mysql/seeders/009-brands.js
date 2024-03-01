'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "EGGER",
      },
      {
        "name": "MASISA",
      },
      {
        "name": "FAPLAC",
      },
      {
        "name": "HAFFELE",
      },
      {
        "name": "GREENWAY",
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
