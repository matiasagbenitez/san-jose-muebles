
'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "PESOS ARGENTINOS",
        "symbol": "ARS",
        "is_monetary": true,
      },
      {
        "name": "DÓLARES ESTADOUNIDENSES",
        "symbol": "USD",
        "is_monetary": true,
      },
      {
        "name": "REALES BRASILEÑOS",
        "symbol": "BRL",
        "is_monetary": true,
      },
      {
        "name": "BOLSAS DE CEMENTO",
        "symbol": "BOL",
        "is_monetary": false,
      },
      {
        "name": "LITROS DE NAFTA SUPER",
        "symbol": "LNS",
        "is_monetary": false,
      }
    ];

    const currencies = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,
        symbol: item.symbol,
        is_monetary: item.is_monetary,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    await queryInterface.bulkInsert('currencies', currencies, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});
  }
};
