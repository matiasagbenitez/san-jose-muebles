import { Table } from "react-bootstrap";

interface Props {
  supplier: {
    name: string;
    dni_cuit: string;
    phone: string;
    email: string;
    address: string;
    locality: string;
    annotations: string;
  };
}

export const SupplierInfo = ({ supplier }: Props) => {
  return (
    <>
      <h1 className="fs-3">{supplier.name}</h1>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr>
            <th scope="row">Proveedor</th>
            <td>{supplier.name}</td>
          </tr>
          <tr>
            <th scope="row">DNI/CUIT</th>
            <td>{supplier.dni_cuit}</td>
          </tr>
          <tr>
            <th scope="row">Teléfono</th>
            <td>{supplier.phone}</td>
          </tr>
          <tr>
            <th scope="row">Email</th>
            <td>{supplier.email}</td>
          </tr>
          <tr>
            <th scope="row">Dirección</th>
            <td>{supplier.address}</td>
          </tr>
          <tr>
            <th scope="row">Localidad</th>
            <td>{supplier.locality}</td>
          </tr>
          <tr>
            <th scope="row">Anotaciones</th>
            <td>
              <div className="text-break">
                <small>{supplier.annotations}</small>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
