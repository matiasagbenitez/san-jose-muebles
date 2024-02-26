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
        position: "sticky",
        top: 57,
        height: "100vh",
        backgroundColor: "#F8F9FA",
        fontSize: "15px",
      }}
    >
      <Menu>
        <MenuItem>
          <i className="bi bi-house-door-fill me-2"></i> Item 1
        </MenuItem>
        <MenuItem>
          <i className="bi bi-house-door-fill me-2"></i> Item 2
        </MenuItem>
        <MenuItem>
          <i className="bi bi-house-door-fill me-2"></i> Item 3
        </MenuItem>
        <MenuItem>
          <i className="bi bi-house-door-fill me-2"></i> Item 4
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
