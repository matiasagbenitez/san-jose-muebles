import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useAuthStore } from "../../../hooks";
import { SweetAlert2 } from "../../utils";
interface SidebarComponentProps {
  collapsed: boolean;
}

export const SidebarComponent = ({ collapsed }: SidebarComponentProps) => {
  
  const { startLogout } = useAuthStore();

  const handleLogout = async () => {
    const confirm = await SweetAlert2.confirm("¿Está seguro de cerrar sesión?");
    if (!confirm.isConfirmed) return;
    startLogout();
  };

  return (
    <Sidebar
      width="230px"
      collapsed={collapsed}
      collapsedWidth="0px"
      style={{
        backgroundColor: "#F8F9FA",
        fontSize: "15px",
        minHeight: "100vh",
      }}
    >
      {/* <Link to="/" className="text-decoration-none">
        <div className="d-flex align-items-center justify-content-center mt-2">
          <img src="/logos/sidebar.svg" alt="logo" height={100} />
        </div>
      </Link> */}

      <Menu style={{ marginLeft: "5px", fontSize: "14px" }}>
        <MenuItem component={<Link to="/" />} title="Inicio">
          <i className="bi bi-columns me-3 fs-6"></i>
          Inicio
        </MenuItem>

        <MenuItem
          component={<Link to="/clientes" />}
          title="Clientes"
          style={{ height: "45px" }}
        >
          <i className="bi bi-person-circle me-3 fs-6"></i>
          Clientes
        </MenuItem>

        <SubMenu
          prefix={
            <>
              <i className="bi bi-houses me-3 fs-6"></i>Proyectos
            </>
          }
          style={{ height: "45px" }}
        >
          <MenuItem
            component={<Link to="/proyectos" />}
            title="Listado de proyectos"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Listado de proyectos</small>
          </MenuItem>
          <MenuItem
            component={<Link to="/ambientes" />}
            title="Listado de ambientes"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Ambientes de proyectos</small>
          </MenuItem>
        </SubMenu>


        <MenuItem
          component={<Link to="/agenda" />}
          title="Agenda de visitas"
          style={{ height: "45px" }}
        >
          <i className="bi bi-journal-text me-3 fs-6"></i>
          Agenda de visitas
        </MenuItem>

        <MenuItem
          component={<Link to="/agenda/calendario" />}
          title="Calendario"
          style={{ height: "45px" }}
        >
          <i className="bi bi-calendar-date me-3 fs-6"></i>
          Calendario
        </MenuItem>

        <SubMenu
          prefix={
            <>
              <i className="bi bi-box-seam me-3 fs-6"></i>Productos
            </>
          }
          style={{ height: "45px" }}
        >
          <MenuItem
            component={<Link to="/productos" />}
            title="Listado de productos"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Listado de productos</small>
          </MenuItem>
          <MenuItem
            component={<Link to="/productos/ajustes" />}
            title="Gestionar stock de productos"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Control de stock</small>
          </MenuItem>
        </SubMenu>

        <SubMenu
          prefix={
            <>
              <i className="bi bi-truck me-3 fs-6"></i>Proveedores
            </>
          }
          style={{ height: "45px" }}
        >
          <MenuItem
            component={<Link to="/proveedores" />}
            title="Listado de proveedores"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Listado de proveedores</small>
          </MenuItem>
          <MenuItem
            component={<Link to="/proveedores/cuentas" />}
            title="Listado de cuentas corrientes"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Cuentas corrientes</small>
          </MenuItem>
        </SubMenu>

        <SubMenu
          prefix={
            <>
              <i className="bi bi-cart me-3 fs-6"></i>Compras
            </>
          }
          style={{ height: "45px" }}
        >
          <MenuItem
            component={<Link to="/compras" />}
            title="Listado de compras realizadas"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Listado de compras</small>
          </MenuItem>
          <MenuItem
            component={<Link to="/compras/registrar" />}
            title="Registrar una nueva compra"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Registrar nueva compra</small>
          </MenuItem>
        </SubMenu>

        <SubMenu
          prefix={
            <>
              <i className="bi bi-inboxes me-3 fs-6"></i>Entidades
            </>
          }
          style={{ height: "45px" }}
        >
          <MenuItem
            component={<Link to="/entidades" />}
            title="Listado de entidades"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Listado de entidades</small>
          </MenuItem>
          <MenuItem
            component={<Link to="/entidades/cuentas" />}
            title="Listado de cuentas corrientes"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Cuentas corrientes</small>
          </MenuItem>
        </SubMenu>

        <MenuItem
          component={<Link to="/inventario" />}
          title="Inventario de herramientas"
          style={{ height: "45px" }}
        >
          <i className="bi bi-tools me-3 fs-6"></i>
          Inventario
        </MenuItem>

        <MenuItem
          component={<Link to="/parametros" />}
          title="Parámetros"
          style={{ height: "45px" }}
        >
          <i className="bi bi-gear-wide-connected me-3 fs-6"></i>
          Parámetros
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          title="Cerrar sesión"
          style={{ height: "45px" }}
        >
          <i className="bi bi-box-arrow-in-right me-3 fs-6"></i>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
