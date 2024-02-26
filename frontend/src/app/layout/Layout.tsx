import { Outlet } from "react-router-dom";

import { Container } from "react-bootstrap";
import { SidebarComponent } from "./components/SidebarComponent";
import { useState } from "react";
import { NavbarComponent } from "./components";

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div>
      <NavbarComponent handleSidebarCollapse={handleSidebarCollapse} />
      <div className="d-flex">
        <SidebarComponent collapsed={sidebarCollapsed} />
        <Container fluid className="p-0 m-0">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};
