import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
interface SidebarComponentProps {
  collapsed: boolean;
}

export const SidebarComponent = ({ collapsed }: SidebarComponentProps) => {
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

        <MenuItem
          component={<Link to="/proyectos" />}
          title="Proyectos"
          style={{ height: "45px" }}
        >
          <i className="bi bi-houses me-3 fs-6"></i>
          Proyectos
        </MenuItem>

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
      </Menu>
    </Sidebar>
  );
};
