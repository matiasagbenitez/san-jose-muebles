'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "username": "matiasagbenitez",
        "name": "Matías Benítez",
        "email": "matias@correo.com",
      }
    ];

    const users = list.map(item => {
      const timestamp = new Date();
      const salt = bcrypt.genSaltSync();
      const password = bcrypt.hashSync("123456", salt);
      return {
        name: item.name,
        username: item.username,
        email: item.email,
        password: password,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
