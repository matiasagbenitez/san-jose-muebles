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
        position: "sticky",
        top: 57,
        height: "100vh",
        backgroundColor: "#F8F9FA",
        fontSize: "15px",
      }}
    >
      <Menu style={{ marginLeft: "5px" }}>
        <MenuItem component={<Link to="/" />} title="Inicio">
          Inicio
        </MenuItem>
        <SubMenu label="Parámetros" title="Parámetros">
          <MenuItem component={<Link to="/parametros/paises" />} title="Países">
            Países
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};
