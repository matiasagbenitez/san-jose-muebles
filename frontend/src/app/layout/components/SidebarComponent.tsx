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
      <Menu style={{ marginLeft: "5px" }}>
        <MenuItem component={<Link to="/" />} title="Inicio">
          Inicio
        </MenuItem>
        <SubMenu label="Parámetros" title="Parámetros">
          <MenuItem component={<Link to="/parametros/paises" />} title="Países">
            Países
          </MenuItem>
          <MenuItem component={<Link to="/parametros/provincias" />} title="Provincias">
            Provincias
          </MenuItem>
          <MenuItem component={<Link to="/parametros/localidades" />} title="Localidades">
            Localidades
          </MenuItem>
          <MenuItem component={<Link to="/parametros/monedas" />} title="Monedas">
            Monedas
          </MenuItem>
          <MenuItem component={<Link to="/parametros/metodos-pago" />} title="Métodos de pago">
            Métodos de pago
          </MenuItem>
          <MenuItem component={<Link to="/parametros/tipos-ambientes" />} title="Tipos de ambientes">
            Tipos de ambientes
          </MenuItem>
          <MenuItem component={<Link to="/parametros/marcas" />} title="Marcas">
            Marcas
          </MenuItem>
          <MenuItem component={<Link to="/parametros/categorias" />} title="Categorías">
            Categorías
          </MenuItem>
          <MenuItem component={<Link to="/parametros/unidades-medida" />} title="Unidades de medida">
            Unidades de medida
          </MenuItem>
          <MenuItem component={<Link to="/parametros/prioridades" />} title="Prioridades">
            Prioridades
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};
