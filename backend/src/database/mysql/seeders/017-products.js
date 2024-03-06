'use strict';
// import { faker } from "@faker-js/faker";
const { faker } = require('@faker-js/faker');

module.exports = {

  // [
  //   { "id_supplier": 1, "account_owner": "EGGER ARGENTINA" },
  //   { "id_supplier": 2, "account_owner": "HAFELE ARGENTINA" },
  //   { "id_supplier": 3, "account_owner": "BISAGRA OH" },
  //   { "id_supplier": 4, "account_owner": "MECH" },
  //   { "id_supplier": 5, "account_owner": "HERRATUR HERRAJES" },
  //   { "id_supplier": 6, "account_owner": "DAC MADERAS" },
  //   { "id_supplier": 7, "account_owner": "MADEIRAS DO SUL" },
  //   { "id_supplier": 8, "account_owner": "FISCHER BRASIL" },
  // ]

  async up(queryInterface) {
    const list = [
      {
        "id_supplier": 1,
        "id_bank": 1,
        "account_owner": "EGGER ARGENTINA",
        "alias": "egger.argentina",
      },
      {
        "id_supplier": 1,
        "id_bank": 2,
        "account_owner": "EGGER ARGENTINA",
        "alias": "egger.arg",
      },
      {
        "id_supplier": 2,
        "id_bank": 1,
        "account_owner": "HAFELE ARGENTINA",
        "alias": "hafele.arg",
      },
      {
        "id_supplier": 2,
        "id_bank": 3,
        "account_owner": "HAFELE ARGENTINA",
        "alias": "hafele.argentina",
      },
      {
        "id_supplier": 3,
        "id_bank": 1,
        "account_owner": "BISAGRA OH",
        "alias": "bis.oh.arg",
      },
      {
        "id_supplier": 4,
        "id_bank": 1,
        "account_owner": "JORGELINA MECH",
        "alias": "mech.24",
      },
      {
        "id_supplier": 5,
        "id_bank": 1,
        "account_owner": "CLAUDIO PINNO",
        "alias": "herratur.h",
      },
      {
        "id_supplier": 6,
        "id_bank": 7,
        "account_owner": "DAC MADERAS SRL",
        "alias": "dac.maderas",
      },
      {
        "id_supplier": 7,
        "id_bank": 8,
        "account_owner": "XAVIER ENRIQUE",
        "alias": "madeiras.do.sul",
      },
      {
        "id_supplier": 7,
        "id_bank": 9,
        "account_owner": "XAVIER ENRIQUE",
        "alias": "xa.enrique",
      },
      {
        "id_supplier": 8,
        "id_bank": 9,
        "account_owner": "PAULO FISCHER",
        "alias": "fischer.brasil",
      }

    ];


    const bank_accounts = list.map(item => {
      const timestamp = new Date();
      return {
        id: item.id,
        id_supplier: item.id_supplier,
        id_bank: item.id_bank,
        account_owner: item.account_owner,
        cbu_cvu: faker.finance.accountNumber(22),
        alias: item.alias,
        account_number: faker.finance.routingNumber(),

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('bank_accounts', bank_accounts, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('bank_accounts', null, {});
  }
};
