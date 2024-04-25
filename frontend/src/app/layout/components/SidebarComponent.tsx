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
          <i className="bi bi-house me-3 fs-6"></i>
          Inicio
        </MenuItem>

        <MenuItem
          component={<Link to="/productos" />}
          title="Productos"
          style={{ height: "45px" }}
        >
          <i className="bi bi-box-seam me-3 fs-6"></i>
          Productos
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
              <i className="bi bi-calendar3 me-3 fs-6"></i>Agenda de visitas
            </>
          }
          style={{ height: "45px" }}
        >
          <MenuItem
            component={<Link to="/agenda" />}
            title="Ir a la agenda de visitas"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Gestionar agenda</small>
          </MenuItem>
          <MenuItem
            component={<Link to="/agenda/calendario" />}
            title="Ver calendario de visitas pendientes"
            style={{ height: "45px", marginLeft: "10px" }}
          >
            <small>Ver calendario</small>
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
            component={<Link to="/cuentas-proveedores" />}
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
