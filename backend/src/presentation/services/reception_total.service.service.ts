import { ReceptionTotal } from "../../database/mysql/models";
import { CustomError, ReceptionTotalDto, ReceptionTotalEntity } from "../../domain";

export class ReceptionTotalService {

    public async getReceptionTotals() {
        const rows = await ReceptionTotal.findAll({
            include: [{
                association: 'purchase',
                attributes: ['id'],
            },
            {
                association: 'user',
                attributes: ['name']
            }]
        });
        const entities = rows.map(item => ReceptionTotalEntity.fromObject(item));
        return { items: entities };
    }

    public async createReceptionTotal(dto: ReceptionTotalDto) {
        try {
            await ReceptionTotal.create({
                id_purchase: dto.id_purchase,
                id_user: dto.id_user,
            });
            return { message: 'Registro creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El registro ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }
}