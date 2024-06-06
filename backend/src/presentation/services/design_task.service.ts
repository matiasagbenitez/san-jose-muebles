import { DesignTask, DesignTaskEvolution } from "../../database/mysql/models";
import { CreateDesignTaskDTO, CustomError } from "../../domain";

export class DesignTaskService {

    public async createTask(id_design: number, dto: CreateDesignTaskDTO) {
        try {
            const task = await DesignTask.create({ ...dto, id_design });
            if (!task) throw CustomError.notFound('¡No se pudo crear la tarea!');
            return { task };
        } catch (error) {
            throw CustomError.internalServerError('¡No se pudo crear la tarea!');
        }
    }

    public async updateTaskStatus(id_task: number, status: string, id_user: number) {

        const transaction = await DesignTask.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡No se pudo actualizar la tarea!');

        try {
            const task = await DesignTask.findByPk(id_task);
            if (!task) throw CustomError.notFound('¡No se pudo actualizar la tarea!');
            await task.update({ status }, { transaction });

            const evolution = await DesignTaskEvolution.create({ id_design_task: id_task, status, id_user }, { transaction });
            if (!evolution) throw CustomError.notFound('¡No se pudo actualizar la tarea!');

            await transaction.commit();
            return { task };
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            throw CustomError.internalServerError('¡No se pudo actualizar la tarea!');
        }
    }

    public async deleteDesignTask(id_design: number, id_task: number, id_user: number) {
        try {
            const task = await DesignTask.findOne({ where: { id: id_task, id_design, id_user } });
            if (!task) throw CustomError.notFound('¡Tarea no encontrada o permisos insuficientes!');
            await task.destroy();
            return { ok: true, message: '¡Tarea eliminada correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}