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
      <Table size="sm" className="small" striped bordered responsive>
        <tbody>
          <tr>
            <th scope="row" className="px-2">Proveedor</th>
            <td>{supplier.name}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">DNI/CUIT</th>
            <td>{supplier.dni_cuit}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">Teléfono</th>
            <td>{supplier.phone}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">Email</th>
            <td>{supplier.email}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">Dirección</th>
            <td>{supplier.address}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">Localidad</th>
            <td>{supplier.locality}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">Anotaciones</th>
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
