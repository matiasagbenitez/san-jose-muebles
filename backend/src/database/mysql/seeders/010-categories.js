'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "TABLERO MELAMINA",
      },
      {
        "name": "TABLERO MDF",
      },
      {
        "name": "BISAGRAS",
      },
      {
        "name": "SISTEMAS CIERRE SUAVE",
      },
      {
        "name": "CORREDERAS",
      },
      {
        "name": "TIRADORES",
      },
      {
        "name": "PERFILERIA DE ALUMINIO",
      },
      {
        "name": "TORNILLOS",
      },
      {
        "name": "ADHESIVOS",
      },
      {
        "name": "HERRAMIENTAS",
      },
      {
        "name": "ACCESORIOS",
      }
    ];

    const categories = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('categories', categories, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
