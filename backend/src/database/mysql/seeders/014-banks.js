'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "BANCO NACION",
      },
      {
        "name": "BANCO MACRO",
      },
      {
        "name": "BANCO SANTANDER",
      },
      {
        "name": "MERCADOPAGO",
      },
      {
        "name": "UALA",
      }
    ];

    const banks = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('banks', banks, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('banks', null, {});
  }
};
