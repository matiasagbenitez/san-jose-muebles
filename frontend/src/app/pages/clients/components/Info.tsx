import { Table } from "react-bootstrap";
import { ClientInterface } from "../interfaces";

interface Props {
  client: ClientInterface;
}

export const ClientInfo = ({ client }: Props) => {
  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-2">
              Cliente
            </th>
            <td>{client.name}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-2">
              DNI/CUIT
            </th>
            <td>{client.dni_cuit}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-2">
              Teléfono
            </th>
            <td>{client.phone}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-2">
              Email
            </th>
            <td>{client.email}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-2">
              Dirección
            </th>
            <td>{client.address}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-2">
              Localidad
            </th>
            <td>{client.locality}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2 text-uppercase col-2">
              Anotaciones
            </th>
            <td>
              <div className="text-break">
                <small>{client.annotations}</small>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
