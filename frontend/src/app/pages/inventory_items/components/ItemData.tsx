import { Badge, Table } from "react-bootstrap";
import { ItemData as Data } from "../interfaces";
import { DayJsAdapter } from "../../../../helpers";

interface Props {
  item: Data;
}

export const ItemData = ({ item }: Props) => {
  return (
    <Table size="sm" className="small" striped bordered responsive>
      <tbody>
        <tr className="text-center fw-bold text-uppercase">
          <td colSpan={2}>Información del artículo</td>
        </tr>
        <tr>
          <th scope="row" className="px-2 text-uppercase col-3">
            Categoría
          </th>
          <td>{item.category}</td>
        </tr>
        <tr>
          <th scope="row" className="px-2 text-uppercase">
            Marca
          </th>
          <td>{item.brand}</td>
        </tr>
        <tr>
          <th scope="row" className="px-2 text-uppercase">
            Nombre
          </th>
          <td>{item.name}</td>
        </tr>
        <tr>
          <th scope="row" className="px-2 text-uppercase">
            Código interno
          </th>
          <td>{item.code}</td>
        </tr>
        <tr>
          <th scope="row" className="px-2 text-uppercase">
            Cantidad
          </th>
          <td>{item.quantity}</td>
        </tr>
        <tr>
          <th scope="row" className="px-2 text-uppercase">
            Estado
          </th>
          <td>
            <Badge bg={item.is_retired ? "danger" : "success"}>
              {item.is_retired ? "BAJA" : "VIGENTE"}
            </Badge>
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="text-muted fst-italic small">
            Última actualización el {DayJsAdapter.toDayMonthYearHour(item.last_check)}{" "}
            por {item.last_check_by}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
