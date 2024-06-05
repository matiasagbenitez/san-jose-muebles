import { Design } from "../../database/mysql/models";
import { CustomError, DesignEntity } from "../../domain";

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

}