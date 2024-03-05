import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
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
          Inicio
        </MenuItem>
        <MenuItem component={<Link to="/proveedores" />} title="Proveedores" style={{  height: "45px" }}>
          <i className="bi bi-truck me-3 fs-6"></i>
          Proveedores
        </MenuItem>
        <MenuItem component={<Link to="/productos" />} title="Productos" style={{  height: "45px" }}>
          <i className="bi bi-box me-3 fs-6"></i>
          Productos
        </MenuItem>
        <MenuItem component={<Link to="/parametros" />} title="Parámetros" style={{  height: "45px" }}>
          <i className="bi bi-gear-wide-connected me-3 fs-6"></i>
          Parámetros
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
