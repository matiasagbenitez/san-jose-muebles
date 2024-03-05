'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "id:": 1,
        "name": "25 DE MAYO",
        "id_province": 1,
      },
      {
        "id": 2,
        "name": "EL SOBERBIO",
        "id_province": 1,
      },
      {
        "id": 3,
        "name": "DOS DE MAYO",
        "id_province": 1,
      },
      {
        "id": 4,
        "name": "OBERÁ",
        "id_province": 1,
      },
      {
        "id": 5,
        "name": "SAN VICENTE",
        "id_province": 1,
      },
      {
        "id": 6,
        "name": "POSADAS",
        "id_province": 1,
      },
      {
        "id": 7,
        "name": "COLONIA AURORA",
        "id_province": 1,
      },
      {
        "id": 8,
        "name": "ARISTÓBULO DEL VALLE",
        "id_province": 1,
      },
      {
        "id": 9,
        "name": "PUERTO RICO",
        "id_province": 1,
      },
      {
        "id": 10,
        "name": "PUERTO IGUAZÚ",
        "id_province": 1,
      },
      {
        "id": 11,
        "name": "CAPITAL FEDERAL",
        "id_province": 2,
      },
      {
        "id": 12,
        "name": "DON TORCUATO",
        "id_province": 2,
      },
      {
        "id": 13,
        "name": "LA PLATA",
        "id_province": 2,
      },
      {
        "id": 14,
        "name": "CORDOBA CAPITAL",
        "id_province": 3,
      },
      {
        "id": 15,
        "name": "RIO CUARTO",
        "id_province": 3,
      },
      {
        "id": 16,
        "name": "SAO MIGUEL DO OESTE",
        "id_province": 4,
      },
      {
        "id": 17,
        "name": "DIONÍSIO CERQUEIRA",
        "id_province": 4,
      }
    ];

    const localities = list.map(item => {
      const timestamp = new Date();
      return {
        id: item.id,  
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
