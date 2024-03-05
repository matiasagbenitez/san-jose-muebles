import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
}

export const SupplierOptions = ({ id }: Props) => {
  const navigate = useNavigate();

  const redirectBankAccounts = () => {
    navigate(`/proveedores/${id}/cuentas-bancarias`);
  };

  return (
    <>
      <h2 className="fs-5" style={{ marginTop: "8px" }}>
        Menú de opciones
      </h2>
      <Table size="sm" responsive>
        <tbody>
          <tr>
            <td className="p-0 border-0">
              <Button
                variant="light"
                size="sm"
                className="text-start w-100 rounded-0"
                title="Cuentas bancarias del proveedor"
                onClick={redirectBankAccounts}
              >
                <i className="bi bi-bank me-2"></i>
                Cuentas bancarias
              </Button>
            </td>
          </tr>

          <tr>
            <td className="p-0 border-0">
              <Button
                variant="light"
                size="sm"
                className="text-start w-100 rounded-0"
                title="Registrar una nueva compra"
              >
                <i className="bi bi-cart-plus-fill me-2"></i>
                Registrar una nueva compra
              </Button>
            </td>
          </tr>

          <tr>
            <td className="p-0 border-0">
              <Button
                variant="light"
                size="sm"
                className="text-start w-100 rounded-0"
                title="Compras registradas del proveedor"
              >
                <i className="bi bi-cart4 me-2"></i>
                Compras registradas
              </Button>
            </td>
          </tr>

          <tr>
            <td className="p-0 border-0">
              <Button
                variant="light"
                size="sm"
                className="text-start w-100 rounded-0"
                title="Pagos realizados al proveedor"
              >
                <i className="bi bi-cash-stack me-2"></i>
                Pagos realizados
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
