'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "MISIONES",
        "id_country": 1,
      },
      {
        "name": "CORRIENTES",
        "id_country": 1,
      },
      {
        "name": "BUENOS AIRES",
        "id_country": 1,
      },
    ];

    const provinces = list.map(item => {
      const timestamp = new Date();
      return {
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
