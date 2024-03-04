export class BankAccountDto {
    private constructor(
        public id_supplier: string,
        public id_bank: string,
        public account_owner: string,
        public cbu_cvu: string,
        public alias: string,
        public account_number: string,
        public annotations: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, BankAccountDto?] {
        const {
            id_supplier,
            id_bank,
            account_owner,
            cbu_cvu,
            alias,
            account_number,
            annotations
        } = object;
        console.log(object);

        if (!id_supplier) return ['El identificador del proveedor es requerido'];
        if (!id_bank) return ['El identificador del banco es requerido'];
        if (!account_owner) return ['El titular de la cuenta es requerido'];
        if (!cbu_cvu && !alias) return ['Se requiere al menos el alias o el CBU/CVU'];

        return [undefined, new BankAccountDto(
            id_supplier,
            id_bank,
            account_owner,
            cbu_cvu,
            alias,
            account_number,
            annotations
        )];
    }
}