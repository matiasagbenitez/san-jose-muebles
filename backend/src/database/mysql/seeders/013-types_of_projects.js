'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "BÁSICO",
        "description": "MODELADO DIRECTAMENTE EN TEOWIN",
      },
      {
        "name": "INTERMEDIO",
        "description": "DISEÑO EN SKETCHUP, RENDERIZADO EN LUMION Y MODELADO FINAL EN TEOWIN. ENTREGA DE IMÁGENES DIGITALES",
      },
      {
        "name": "COMPLETO",
        "description": "DISEÑO EN SKETCHUP, RENDERIZADO EN LUMION, MODELADO FINAL EN TEOWIN. ESQUEMAS DE COLORES, DECORACIÓN Y PLANOS DE DISTRIBUCIÓN. PUEDE INCLUIR ENTREGA EN CARPETA FÍSICA",
      },
    ];

    const types_of_projects = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,
        description: item.description,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('types_of_projects', types_of_projects, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('types_of_projects', null, {});
  }
};
