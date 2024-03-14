import { Table } from "react-bootstrap";
import { SupplierInfoProps } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

export const InfoSupplier = ({
  date,
  name,
  dni_cuit,
  phone,
  locality,
}: SupplierInfoProps) => {
  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr className="text-center fw-bold">
            <td colSpan={2}>Información general</td>
          </tr>
          <tr>
            <th scope="row">Fecha compra</th>
            <td>{DayJsAdapter.toDayMonthYear(date)}</td>
          </tr>
          <tr>
            <th scope="row">Proveedor</th>
            <td>{name}</td>
          </tr>
          <tr>
            <th scope="row">DNI / CUIT</th>
            <td>{dni_cuit}</td>
          </tr>
          <tr>
            <th scope="row">Teléfono</th>
            <td>{phone}</td>
          </tr>
          <tr>
            <th scope="row">Localidad</th>
            <td>{locality}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
