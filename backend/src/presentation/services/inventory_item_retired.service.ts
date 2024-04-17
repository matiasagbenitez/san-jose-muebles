import { Transaction } from "sequelize";
import { InventoryItemRetired } from "../../database/mysql/models";
import { CustomError, RetireInventoryItemDTO } from "../../domain";


export class InventoryItemRetiredService {

    public async createRetirementRecord(data: RetireInventoryItemDTO, transaction: Transaction) {

        try {
            await InventoryItemRetired.create({ ...data }, { transaction });
            return { message: 'Ítem retirado correctamente' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}