'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "id": 1,
        "name": "BANCO NACION",
      },
      {
        "id": 2,
        "name": "BANCO MACRO",
      },
      {
        "id": 3,
        "name": "BANCO SANTANDER",
      },
      {
        "id": 4,
        "name": "BANCO GALICIA",
      },
      {
        "id": 5,
        "name": "BANCO DEL SOL",
      },
      {
        "id": 6,
        "name": "MERCADOPAGO",
      },
      {
        "id": 7,
        "name": "ITAU",
      },
      {
        "id": 8,
        "name": "BRADESCO",
      },
      {
        "id": 9,
        "name": "BANCO DO BRASIL",
      }
    ];

    const banks = list.map(item => {
      const timestamp = new Date();
      return {
        id: item.id,
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
