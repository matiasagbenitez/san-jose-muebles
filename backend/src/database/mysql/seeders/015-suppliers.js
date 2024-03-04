'use strict';

module.exports = {
  async up(queryInterface) {
    const list = [
      {
        "name": "EGGER ARGENTINA S.A.",
        "dni_cuit": "30-70900004-5",
        "phone": "0341-497-0000",
        "email": "EGGERARG@CORREO.COM",
        "address": "RUTA NACIONAL N° 34 KM 8,5",
        "id_locality": 7,
      },
      {
        "name": "MUEBLES ALFA",
        "dni_cuit": "30-12345678-9",
        "phone": "011-555-1234",
        "email": "CONTACTO@MUEBLESALFA.COM",
        "address": "CALLE FALSA 123",
        "id_locality": 3,
      },
      {
        "name": "MUEBLES BETA",
        "dni_cuit": "30-98765432-1",
        "phone": "0221-456-7890",
        "email": "INFO@MUEBLESBETA.COM",
        "address": "AVENIDA REAL 456",
        "id_locality": 5,
      },
      {
        "name": "MUEBLES GAMMA",
        "dni_cuit": "30-13579246-7",
        "phone": "0299-678-5432",
        "email": "VENTAS@MUEBLESGAMMA.COM",
        "address": "BOULEVARD IMAGINARIO 789",
        "id_locality": 3,
      }
    ];
    

    const suppliers = list.map(item => {
      const timestamp = new Date();
      return {
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
