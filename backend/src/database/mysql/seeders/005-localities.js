'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "25 DE MAYO",
        "id_province": 1,
      },
      {
        "name": "ALBA POSSE",
        "id_province": 1,
      },
      {
        "name": "EL SOBERBIO",
        "id_province": 1,
      },
      {
        "name": "DOS DE MAYO",
        "id_province": 1,
      },
      {
        "name": "OBERÁ",
        "id_province": 1,
      },
      {
        "name": "SAN VICENTE",
        "id_province": 1,
      },
      {
        "name": "POSADAS",
        "id_province": 1,
      },
      {
        "name": "COLONIA AURORA",
        "id_province": 1,
      }
    ];

    const localities = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,
        id_province: item.id_province,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    await queryInterface.bulkInsert('localities', localities, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('localities', null, {});
  }
};
