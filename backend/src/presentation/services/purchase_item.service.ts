import { PurchaseItem } from "../../database/mysql/models";
import { CustomError } from "../../domain";

export class PurchaseItemService {

    public async getPendingReceptionsByProductId(id_product: number): Promise<any> {
        try {
            const items = await PurchaseItem.findAll({
                where: { id_product, fully_stocked: false },
                include: [
                    {
                        association: 'purchase',
                        attributes: ['id', 'date'],
                        where: { status: 'VALIDA' },
                        include: [
                            {
                                association: 'supplier',
                                attributes: ['id', 'name']
                            },
                        ]
                    }
                ]
            });

            return items;
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}