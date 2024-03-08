import { CustomError } from '../../errors/custom.error';

export class BankAccountEntity {
    constructor(
        public id: string,
        public id_supplier: string,
        public id_bank: string,
        public account_owner: string,
        public cbu_cvu: string,
        public alias: string,
        public account_number: string,

        public bank?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): BankAccountEntity {
        const { id, id_supplier, id_bank, account_owner, cbu_cvu, alias, account_number } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!id_supplier) throw CustomError.badRequest('Missing id_supplier');
        if (!id_bank) throw CustomError.badRequest('Missing id_bank');
        if (!cbu_cvu && !alias) throw CustomError.badRequest('At least the alias or the CBU/CVU is required');

        return new BankAccountEntity(
            id,
            id_supplier,
            id_bank,
            account_owner,
            cbu_cvu,
            alias,
            account_number,
        );
    }

    static listableBankAccounts(object: { [key: string]: any }): BankAccountEntity {
        const { id, id_supplier, id_bank, account_owner, cbu_cvu, alias, account_number, bank } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!id_supplier) throw CustomError.badRequest('Missing id_supplier');
        if (!id_bank) throw CustomError.badRequest('Missing id_bank');
        if (!cbu_cvu && !alias) throw CustomError.badRequest('At least the alias or the CBU/CVU is required');

        return new BankAccountEntity(
            id,
            id_supplier,
            id_bank,
            account_owner,
            cbu_cvu,
            alias,
            account_number,
            bank.name,
        );
    }
}