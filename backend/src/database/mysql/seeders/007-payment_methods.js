'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "EFECTIVO",
      },
      {
        "name": "CHEQUE",
      },
      {
        "name": "VALE DE COMBUSTIBLE AXION",
      },
      {
        "name": "TRANSFERENCIA BANCARIA",
      },
      {
        "name": "TRANSFERENCIA MERCADOPAGO",
      }
    ];

    const payment_methods = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('payment_methods', payment_methods, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('payment_methods', null, {});
  }
};
