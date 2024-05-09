'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "id": 1,
        "name": "EGGER ARGENTINA S.A.",
        "dni_cuit": "30-70900004-5",
        "phone": "0341-497-0000",
        "email": "EGGERARG@CORREO.COM",
        "address": "25 DE MAYO 359, PISO 15",
        "id_locality": 11,
      },
      {
        "id": 2,
        "name": "HAFELE ARGENTINA S.A.",
        "dni_cuit": "30-58748526-5",
        "phone": "011-555-1234",
        "email": "CONTACTO@HAFELE.COM",
        "address": "COLECTORA ESTE PANAMERICANA 28047",
        "id_locality": 12,
      },
      {
        "id": 3,
        "name": "BISAGRA OH",
        "dni_cuit": "30-98765432-1",
        "phone": "0221-456-7890",
        "email": "INFO@BISAGRAOH.COM",
        "address": "GRAL PAUNERO 1789",
        "id_locality": 11,
      },
      {
        "id": 4,
        "name": "MECH",
        "dni_cuit": "30-13579246-7",
        "phone": "0299-678-5432",
        "email": "VENTAS@MECH.COM",
        "address": "AV. PRESIDENTE PERÓN 8107",
        "id_locality": 11,
      },
      {
        "id": 5,
        "name": "HERRATUR HERRAJES",
        "dni_cuit": "30-54321678-9",
        "phone": "011-555-4321",
        "email": "VENTAS@HERRATUR.COM",
        "address": "AV. VÉLEZ SARFIELD 1234",
        "id_locality": 13,
      },
      {
        "id": 6,
        "name": "DAC MADERAS",
        "dni_cuit": "30-98765431-1",
        "phone": "011-555-2222",
        "email": "VENTAS@DAC.COM",
        "address": "AV. AVELLANEDA 1234",
        "id_locality": 11,
      },
      {
        "id": 7,
        "name": "HECTOR LOPEZ DISTRIBUCIONES",
        "dni_cuit": "30-12345678-9",
        "phone": "011-555-1111",
        "email": "HECTORLOPEZDIST@CORRE.COM",
        "address": "AV. GENERAL PERON 1234",
        "id_locality": 13,
      },
      {
        "id": 8,
        "name": "FISCHER BRASIL",
        "dni_cuit": "30-87654321-1",
        "phone": "011-555-3333",
        "email": "PEM@INFO.COM",
        "address": "AV. DAS AMÉRICAS 1234",
        "id_locality": 17,
      },
      {
        "id": 9,
        "name": "EUROHARD S.A.",
        "dni_cuit": "30-58414426-1",
        "phone": "011-555-4444",
        "email": "EUROHARD@INFO.COM",
        "address": "AV. HIPOLITO YRIGOYEN 1234",
        "id_locality": 11,
      },
      {
        "id": 10,
        "name": "GREENWAY ARGENTINA S.R.L.",
        "dni_cuit": "30-38541563-1",
        "phone": "011-555-5555",
        "email": "INFO@GRRENWAYSRL.COM",
        "address": "INTENDENTE LUMBRERAS 1234",
        "id_locality": 11,
      },
    ];


    const timestamp = new Date();
    const suppliers = list.map(item => {
      return {
        id: item.id,
        name: item.name,
        dni_cuit: item.dni_cuit,
        phone: item.phone,
        email: item.email,
        address: item.address,
        id_locality: item.id_locality,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('suppliers', suppliers, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('suppliers', null, {});
  }
};
