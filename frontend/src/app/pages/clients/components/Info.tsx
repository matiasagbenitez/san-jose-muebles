import { Table } from "react-bootstrap";
import { ClientInterface } from "../interfaces";

interface Props {
  client: ClientInterface;
}

export const ClientInfo = ({ client }: Props) => {
  const handleWhatsapp = () => {
    const formatedPhone = client?.phone.replace(/[-\s]/g, "");
    window.open(`https://api.whatsapp.com/send?phone=54${formatedPhone}`);
  };

  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody className="text-uppercase">
          <tr>
            <th scope="row" className="px-2 col-2">
              Cliente
            </th>
            <td className="px-2">
              {client.name} {client.last_name}
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              DNI/CUIT
            </th>
            <td className="px-2">{client.dni_cuit}</td>
          </tr>
          <tr className="align-middle">
            <th scope="row" className="px-2">
              Teléfono
            </th>
            <td className="px-2 ">
              {client.phone && (
                <>
                  {client.phone}{" "}
                  <button
                    className="btn btn-link p-0 btn-sm text-decoration-none"
                    title="Ir a WhatsApp"
                    onClick={handleWhatsapp}
                  >
                    <i className="bi bi-whatsapp ms-2 text-success">
                      <span className="ms-2">Enviar un WhatsApp</span>
                    </i>
                  </button>
                </>
              )}
            </td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Email
            </th>
            <td className="px-2">{client.email}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Dirección
            </th>
            <td className="px-2">{client.address}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Localidad
            </th>
            <td className="px-2">{client.locality}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Anotaciones
            </th>
            <td className="px-2">
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
