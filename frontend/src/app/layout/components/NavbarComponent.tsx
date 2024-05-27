import { Button, Container, Navbar } from "react-bootstrap";
import { useAuthStore } from "../../../hooks";
import { SweetAlert2 } from "../../utils";
import { Link } from "react-router-dom";

interface NavbarComponentProps {
  handleSidebarCollapse: () => void;
}

export const NavbarComponent = ({
  handleSidebarCollapse,
}: NavbarComponentProps) => {
  const { startLogout } = useAuthStore();

  const handleLogout = async () => {
    const confirm = await SweetAlert2.confirm("¿Está seguro de cerrar sesión?");
    if (!confirm.isConfirmed) return;
    startLogout();
  };

  return (
    <Navbar
      className="bg-light border-bottom"
      style={{ width: "100%", height: "50px" }}
    >
      <Container fluid>
        <Button
          title="Mostrar/ocultar menú"
          variant="light"
          className="border-0 py-0 px-2"
          onClick={handleSidebarCollapse}
        >
          <i className="bi bi-list fs-5"></i>
        </Button>

        <Link to="/" className="text-decoration-none text-dark">
          <span
            style={{ fontSize: "18px" }}
            className="cursor-pointer"
            role="button"
            title="Ir a la página principal"
          >
            <b>SAN JOSÉ</b> Muebles
          </span>
        </Link>

        <div className="d-flex align-items-center">
          <Button
            title="Cerrar sesión"
            variant="light"
            className="border-0 py-0 px-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-in-right fs-5"></i>
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};
