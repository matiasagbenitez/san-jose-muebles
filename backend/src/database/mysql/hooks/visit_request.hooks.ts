import { VisitRequest, VisitRequestAudit } from "../models";

VisitRequest.addHook('afterCreate', async (visit_request: any, opt: any) => {
    await VisitRequestAudit.create({
        accion: 'ALTA',
        id_row: visit_request.id,
        before: null,
        after: visit_request.toJSON(),
        id_user: opt.id_user,
    });
});

VisitRequest.addHook('beforeUpdate', async (visit_request: any, opt: any) => {
    const fields_changed = visit_request.changed();

    const old_values: any = {};
    const new_values: any = {};

    if (fields_changed) {
        fields_changed.forEach((field: any) => {
            old_values[field] = visit_request._previousDataValues[field]
        });

        fields_changed.forEach((field: any) => {
            new_values[field] = visit_request.getDataValue(field)
        });


        await VisitRequestAudit.create({
            accion: 'MODIFICACION',
            id_row: visit_request.id,
            before: old_values,
            after: new_values,
            id_user: opt.id_user,
        });
    }

});

VisitRequest.addHook('beforeDestroy', async (visit_request: any, opt: any) => {

    const db_row = await VisitRequest.findByPk(visit_request.id, { raw: true });
    if (!db_row) return;

    const old_values = db_row.toJSON();

    await VisitRequestAudit.create({
        accion: 'BAJA',
        id_registro: visit_request.id,
        data_antes: old_values,
        data_despues: null,
        id_usuario: opt.id_user,
    });
});