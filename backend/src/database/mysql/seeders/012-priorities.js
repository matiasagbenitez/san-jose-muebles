'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "MÍNIMA",
        "color": "#99E6E6"
      },
      {
        "name": "BAJA",
        "color": "#66CC99"
      },
      {
        "name": "MEDIA",
        "color": "#FFCC66"
      },
      {
        "name": "ALTA",
        "color": "#FF9966"
      },
      {
        "name": "MÁXIMA",
        "color": "#FF6666"
      },
    ];

    const priorities = list.map(item => {
      const timestamp = new Date();
      return {
        name: item.name,
        color: item.color,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('priorities', priorities, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('priorities', null, {});
  }
};
