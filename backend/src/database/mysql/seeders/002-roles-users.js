'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "id_role": "1",
        "id_user": "1",
      },
      {
        "id_role": "2",
        "id_user": "1",
      },
    ];

    const roles_users = list.map(item => {
      const timestamp = new Date();
      return {
        id_role: item.id_role,
        id_user: item.id_user,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('roles_users', roles_users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles_users', null, {});
  }
};
