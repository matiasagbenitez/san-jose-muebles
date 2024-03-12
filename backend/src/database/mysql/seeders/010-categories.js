'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      { "id": 1, "name": "TABLEROS DE FIBROFÁCIL" },
      { "id": 2, "name": "TABLEROS DE MELAMINA 18MM" },
      { "id": 3, "name": "TABLEROS DE MELAMINA ALTA RESISTENCIA 25MM" },
      { "id": 4, "name": "RUEDAS PARA MUEBLES" },
      { "id": 5, "name": "PATAS PARA MUEBLES" },
      { "id": 6, "name": "BISAGRAS" },
      { "id": 7, "name": "EXPULSORES" },
      { "id": 8, "name": "GUÍAS TIPO Z" },
      { "id": 9, "name": "GUÍAS TELESCÓPICAS" },
      { "id": 10, "name": "ELEMENTOS DE UNIÓN/CONEXIÓN" },
      { "id": 11, "name": "MANIJAS Y TIRADORES" },
      { "id": 12, "name": "ACCESORIOS DE COCINA" },
      { "id": 13, "name": "ACCESORIOS DE PLACARD" },
      { "id": 14, "name": "RINCONEROS" },
      { "id": 15, "name": "PERFILES DE ALUMINIO" },
      { "id": 16, "name": "SISTEMAS EXTRAIBLES" },
      { "id": 17, "name": "SISTEMAS ELEVABLES" },
      { "id": 18, "name": "SISTEMAS CORREDIZOS" },
      { "id": 19, "name": "ZÓCALOS PARA MUEBLES" },
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
