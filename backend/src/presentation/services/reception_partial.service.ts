import { Transaction } from "sequelize";
import { ReceptionPartial } from "../../database/mysql/models";
import { CustomError, ReceptionPartialDto } from "../../domain";

export class ReceptionPartialService {

    public async createReceptionPartial(dto: ReceptionPartialDto, transaction: Transaction): Promise<void> {
        try {
            await ReceptionPartial.create({
                id_purchase_item: dto.id_purchase_item,
                quantity_received: dto.quantity_received,
                id_user: dto.id_user,
            }, { transaction });
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El registro ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }
}