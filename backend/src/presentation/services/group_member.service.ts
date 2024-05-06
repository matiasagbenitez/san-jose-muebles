import { GroupMember } from "../../database/mysql/models";
import { CustomError, ManageMemberDTO } from "../../domain";

export class GroupMemberService {

    public async addMemberToGroup(dto: ManageMemberDTO) {
        try {
            await GroupMember.create({ ...dto });
            return { message: '¡El miembro se agregó al grupo correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El miembro que intenta agregar al grupo ya existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async removeMemberFromGroup(dto: ManageMemberDTO) {
        try {
            await GroupMember.destroy({ where: { ...dto } });
            return { message: '¡El miembro se eliminó del grupo correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}