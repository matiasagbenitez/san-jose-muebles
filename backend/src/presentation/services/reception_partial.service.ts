import { ReceptionPartial } from "../../database/mysql/models";
import { CustomError, ReceptionPartialDto, ReceptionPartialEntity } from "../../domain";

export class ReceptionPartialService {

    public async getReceptionPartials() {
        const rows = await ReceptionPartial.findAll({
            include: [{
                association: 'item',
                include: [{
                    association: 'product',
                    attributes: ['name']
                }]
            },
            {
                association: 'user',
                attributes: ['name']
            }]
        });
        const entities = rows.map(item => ReceptionPartialEntity.fromObject(item));
        return { items: entities };
    }

    public async createReceptionPartial(dto: ReceptionPartialDto) {
        try {
            await ReceptionPartial.create({
                id_purchase_item: dto.id_purchase_item,
                quantity_received: dto.quantity_received,
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