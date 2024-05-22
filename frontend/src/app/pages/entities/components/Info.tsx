import { Table } from "react-bootstrap";
import { EntityInterface } from "../interfaces";

interface Props {
  entity: EntityInterface;
}

export const Info = ({ entity }: Props) => {
  const handleWhatsapp = () => {
    const formatedPhone = entity?.phone.replace(/[-\s]/g, "");
    window.open(`https://api.whatsapp.com/send?phone=54${formatedPhone}`);
  };

  return (
    <>
      <Table size="sm" className="small" striped bordered responsive>
        <tbody className="text-uppercase">
          <tr>
            <th scope="row" className="px-2 col-3">
              Entidad
            </th>
            <td className="px-2">{entity.name}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              DNI/CUIT
            </th>
            <td className="px-2">{entity.dni_cuit}</td>
          </tr>
          <tr className="align-middle">
            <th scope="row" className="px-2">
              Teléfono
            </th>
            <td className="px-2 ">
              {entity.phone && (
                <>
                  {entity.phone}{" "}
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
            <td className="px-2">{entity.email}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Dirección
            </th>
            <td className="px-2">{entity.address}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Localidad
            </th>
            <td className="px-2">{entity.locality}</td>
          </tr>
          <tr>
            <th scope="row" className="px-2">
              Anotaciones
            </th>
            <td className="px-2">
              <div className="text-break">
                <small>{entity.annotations}</small>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
