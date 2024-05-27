import { Project, RelatedPerson } from "../../database/mysql/models";
import { CustomError, RelatedPersonDTO, RelatedPersonEntity } from "../../domain";

export class RelatedPersonService {

    public async getRelatedPersons() {
        const rows = await RelatedPerson.findAll();
        const entities = rows.map(row => RelatedPersonEntity.fromObject(row));
        return { items: entities };
    }

    public async getProjectRelatedPersons(id_project: number) {
        const projectExists = await Project.findByPk(id_project);
        if (!projectExists) {
            throw CustomError.badRequest('¡El proyecto al que intenta asociar la persona no existe!');
        }

        const rows = await RelatedPerson.findAll({ where: { id_project } });
        const entities = rows.map(row => RelatedPersonEntity.fromObject(row));
        return { items: entities };
    }

    public async createRelatedPerson(dto: RelatedPersonDTO) {
        try {
            await RelatedPerson.create({ ...dto });
            return { message: '¡La persona se creó correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw CustomError.badRequest('¡El proyecto al que intenta asociar la persona no existe!');
            }
            if (error.name === 'SequelizeDatabaseError') {
                throw CustomError.badRequest('¡Ocurrió un error al intentar crear la persona!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateRelatedPerson(id: number, dto: RelatedPersonDTO) {
        try {
            await RelatedPerson.update({ ...dto }, { where: { id } });
            return { message: '¡La persona se actualizó correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw CustomError.badRequest('¡El proyecto al que intenta asociar la persona no existe!');
            }
            if (error.name === 'SequelizeDatabaseError') {
                throw CustomError.badRequest('¡Ocurrió un error al intentar actualizar la persona!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteRelatedPerson(id: number) {
        try {
            await RelatedPerson.destroy({ where: { id } });
            return { deleted: true, message: '¡La persona se eliminó correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw CustomError.badRequest('¡La persona que intenta eliminar no existe!');
            }
            if (error.name === 'SequelizeDatabaseError') {
                throw CustomError.badRequest('¡La persona que intenta eliminar está relacionada con otros registros!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

}