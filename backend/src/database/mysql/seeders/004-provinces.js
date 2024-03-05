'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "id": 1,
        "name": "MISIONES",
        "id_country": 1,
      },
      {
        "id": 2,
        "name": "BUENOS AIRES",
        "id_country": 1,
      },
      {
        "id": 3,
        "name": "CÓRDOBA",
        "id_country": 1,
      },
      {
        "id": 4,
        "name": "SANTA CATARINA",
        "id_country": 2,
      }
    ];

    const provinces = list.map(item => {
      const timestamp = new Date();
      return {
        id: item.id,
        name: item.name,
        id_country: item.id_country,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    await queryInterface.bulkInsert('provinces', provinces, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('provinces', null, {});
  }
};
