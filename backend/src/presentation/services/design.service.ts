import { Design, DesignEvolution } from "../../database/mysql/models";
import { CreateDesignEvolutionDTO, CustomError, DesignEntity, DesignEvolutionsEntity } from "../../domain";

export class DesignService {

    public async getDesign(id_design: number) {

        const design = await Design.findByPk(id_design, {
            include: [
                {
                    association: 'environment', include: [
                        {
                            association: 'type', attributes: ['name']
                        },
                        {
                            association: 'project', attributes: ['title'], include: [
                                { association: 'client', attributes: ['name', 'last_name'] }
                            ]
                        }
                    ]
                },
                {
                    association: 'tasks', include: [
                        { association: 'user', attributes: ['name'] }
                    ]
                }
            ]
        });
        if (!design) throw CustomError.notFound('Diseño no encontrado');

        const { ...designEntity } = DesignEntity.fromObject(design);
        return { item: designEntity };
    }

    public async updateStatus(id_design: number, dto: CreateDesignEvolutionDTO) {

        const transaction = await Design.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡Error en la transacción!');

        try {

            const design = await Design.update({ status: dto.status }, { where: { id: id_design }, transaction });
            if (!design) throw CustomError.notFound('¡No se pudo actualizar el estado del diseño!');

            const evolution = await DesignEvolution.create({ id_design, ...dto }, { transaction });
            if (!evolution) throw CustomError.internalServerError('¡No se pudo registrar la evolución del diseño!');

            await transaction.commit();

            return { ok: true, status: dto.status };
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            throw CustomError.internalServerError('¡No se pudo actualizar el estado del diseño!');
        }
    }

    public async getEvolutions(id_design: number) {

        const design = await Design.findByPk(id_design, {
            include: [
                {
                    association: 'environment', include: [
                        {
                            association: 'type', attributes: ['name']
                        },
                        {
                            association: 'project', attributes: ['title'], include: [
                                { association: 'client', attributes: ['name', 'last_name'] }
                            ]
                        }
                    ]
                },
                {
                    association: 'evolutions', include: [
                        { association: 'user', attributes: ['name'] }
                    ]
                }
            ],
            order: [
                ['evolutions', 'createdAt', 'DESC'],
            ]
        });
        if (!design) throw CustomError.notFound('Diseño no encontrado');
        const entity = DesignEvolutionsEntity.fromObject(design);

        return { design: entity.design, evolutions: entity.evolutions };
    }


}