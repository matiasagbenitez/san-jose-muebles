import { Outlet } from "react-router-dom";
//
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
      <div className="d-flex">
        <SidebarComponent collapsed={sidebarCollapsed} />
        <div style={{ width: "100%" }}>
          <NavbarComponent handleSidebarCollapse={handleSidebarCollapse} />
          <div className="p-0 m-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
