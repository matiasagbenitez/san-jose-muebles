'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "ADMIN",
      },
      {
        "name": "USER",
      },
    ];

    const roles = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('roles', roles, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
