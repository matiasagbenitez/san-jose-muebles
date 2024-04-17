import { Transaction } from "sequelize";
import { InventoryItemUpdated } from "../../database/mysql/models";
import { CustomError, UpdateInventoryItemDTO } from "../../domain";


export class InventoryItemUpdatedService {

    public async createRetirementRecord(data: UpdateInventoryItemDTO, transaction: Transaction) {

        try {
            await InventoryItemUpdated.create({ ...data }, { transaction });
            return { message: 'Ítem actualizado correctamente' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}