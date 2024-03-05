'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "id": 1,
        "name": "GUÍAS Y CORREDERAS",
      },
      {
        "id": 2,
        "name": "BISAGRAS",
      },
      {
        "id": 3,
        "name": "MANIJAS Y TIRADORES",
      },
      {
        "id": 4,
        "name": "TABLEROS DE MELAMINA",
      },
      {
        "id": 5,
        "name": "PILETAS DE COCINA",
      },
      {
        "id": 6,
        "name": "SISTEMAS PARA PUERTAS CORREDIZAS",
      },
      {
        "id": 7,
        "name": "ESCURRIDORES DE PLATOS Y VASOS",
      },
      {
        "id": 8,
        "name": "PATAS Y ZOCALOS PARA MUEBLES",
      },
      {
        "id": 9,
        "name": "SISTEMAS GIRATORIOS PARA RINCONEROS",
      },
      {
        "id": 10,
        "name": "SISTEMAS EXTRAIBLES PARA ARMARIOS",
      },
      {
        "id": 11,
        "name": "CUBIERTEROS PARA CAJÓN",
      },
      {
        "id": 12,
        "name": "CONTENEDORES DE RESIDUOS",
      },
      {
        "id": 13,
        "name": "SISTEMAS PARA PUERTAS ABATIBLES Y ELEVABLES",
      },
      {
        "id": 14,
        "name": "CANASTOS INTERNOS",
      },
      {
        "id": 15,
        "name": "SISTEMAS MATRIX PARA CAJONES",
      },
      {
        "id": 16,
        "name": "ILUMINACIÓN LED",
      },
      {
        "id": 17,
        "name": "SISTEMAS PARA PUERTAS PLEGABLES",
      },
      {
        "id": 18,
        "name": "MESADAS DE GRANITO",
      },
      {
        "id": 19,
        "name": "GRIFERÍA",
      },
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
