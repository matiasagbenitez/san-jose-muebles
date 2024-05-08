import { Transaction } from "sequelize";
import { ReceptionTotal } from "../../database/mysql/models";
import { CustomError, ReceptionTotalDto } from "../../domain";

export class ReceptionTotalService {
    public async createReceptionTotal(dto: ReceptionTotalDto, transaction: Transaction): Promise<void> {
        try {
            await ReceptionTotal.create({
                id_purchase: dto.id_purchase,
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