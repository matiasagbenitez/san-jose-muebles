'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "COCINA",
      },
      {
        "name": "COMEDOR",
      },
      {
        "name": "LIVING",
      },
      {
        "name": "HABITACION MATRIMONIAL",
      },
      {
        "name": "HABITACION INFANTIL",
      },
      {
        "name": "HABITACION JUVENIL",
      },
      {
        "name": "HABITACION DE HUESPEDES",
      },
      {
        "name": "VESTIDOR",
      },
      {
        "name": "BAÑO",
      },
      {
        "name": "BAÑO SUITE",
      },
      {
        "name": "OFICINA",
      },
      {
        "name": "HALL",
      },
      {
        "name": "SALA DE ESPERA",
      },
      {
        "name": "QUINCHO",
      }
    ];

    const types_of_environments = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('types_of_environments', types_of_environments, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('types_of_environments', null, {});
  }
};
