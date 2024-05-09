'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const list = [
      { "name": "KIKE", "last_name": "ZAPAYA", "id_locality": 19, "address": "LOS HELECHOS 555" },
      { "name": "ESTEFANIA", "last_name": "ZAP", "id_locality": 18, "address": "" },
      { "name": "INSTITUTO", "last_name": "NERCOLINI", "id_locality": 4, "address": "" },
      { "name": "JORGE", "last_name": "GRAEF", "id_locality": 9, "address": "" },
      { "name": "FERRETERIA", "last_name": "AVENIDA", "id_locality": 9, "address": "BUEN PASTOR 555" },
      { "name": "LUIS", "last_name": "STEFFEN", "id_locality": 9, "address": "" },
      { "name": "MARCELA", "last_name": "BEREZOSKI", "id_locality": 5, "address": "AV. LOS PIONEROS 542" },
      { "name": "HECTOR", "last_name": "LOPEZ RICCI", "id_locality": 8, "address": "" },
      { "name": "ULMAT", "last_name": "METALURGICA", "id_locality": 8, "address": "" },
      { "name": "GONZALEZ", "last_name": "AUTOMOVILES", "id_locality": 6, "address": "" },
      { "name": "HECTOR", "last_name": "FINKE", "id_locality": 8, "address": "" },
      { "name": "OMAR", "last_name": "LORENZO", "id_locality": 5, "address": "LAS MARGARITAS 546" },
      { "name": "MARIANO", "last_name": "SVICA", "id_locality": 18, "address": "" },
      { "name": "JUAN", "last_name": "LUZNE", "id_locality": 3, "address": "" },
      { "name": "JOSÉ", "last_name": "FERREIRA", "id_locality": 20, "address": "" },
      { "name": "ROMAN", "last_name": "RUFF", "id_locality": 1, "address": "GUATAMBU 56" },
      { "name": "FREDDY", "last_name": "KRYCZUK", "id_locality": 2, "address": "" },
      { "name": "MONICA", "last_name": "HAURELUK", "id_locality": 24, "address": "" },
      { "name": "PEDRO", "last_name": "PUERTA", "id_locality": 25, "address": "B° 150 VIVIENDAS CASA 32" },
      { "name": "ADOLFO", "last_name": "SAFRAN", "id_locality": 26, "address": "" },
      { "name": "GUIDO", "last_name": "PELLA", "id_locality": 9, "address": "B° LOS TEALES CASA 5" },
      { "name": "SILVIA", "last_name": "LABANDOCZKA", "id_locality": 1, "address": "" },
      { "name": "ESTEBAN", "last_name": "QUITO", "id_locality": 4, "address": "" },
      { "name": "JONATAN", "last_name": "KLIMIUK", "id_locality": 1, "address": "" },
      { "name": "FRANCO", "last_name": "HASAN", "id_locality": 5, "address": "LAS CAMELIAS 123" },
    ];

    const caracteristicas = ['3743-', '3755-', '3757-', '3758-', '3764-'];

    const timestamp = new Date();
    const clients = list.map(item => {
      return {
        name: item.name,
        last_name: item.last_name,
        dni_cuit: '20-' + faker.number.int({ min: 20000000, max: 38000000 }) + '-0',
        phone: caracteristicas[faker.number.int({ min: 0, max: 4 })] + faker.number.int({ min: 400000, max: 500000 }),
        email: item.name + item.last_name + '@GMAIL.COM',
        address: item.address = '',
        id_locality: item.id_locality,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('clients', clients, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clients', null, {});
  }
};
