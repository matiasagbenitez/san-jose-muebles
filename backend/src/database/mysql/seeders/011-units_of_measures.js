'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "UNIDADES",
        "symbol": "UN",
      },
      {
        "name": "METROS",
        "symbol": "M",
      },
      {
        "name": "METROS CUADRADOS",
        "symbol": "M2",
      },
      {
        "name": "LITROS",
        "symbol": "L",
      },
    ];

    const units_of_measure = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,
        symbol: item.symbol,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('units_of_measure', units_of_measure, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('units_of_measure', null, {});
  }
};
