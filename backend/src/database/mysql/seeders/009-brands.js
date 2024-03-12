'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "id": 1,
        "name": "EGGER",
      },
      {
        "id": 2,
        "name": "MASISA",
      },
      {
        "id": 3,
        "name": "GREENWAY",
      },
      {
        "id": 4,
        "name": "HAFELE",
      },
      {
        "id": 5,
        "name": "UNIHOPPER",
      },
      {
        "id": 6,
        "name": "EUROHARD"
      },
      {
        "id": 7,
        "name": "STARAX"
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
