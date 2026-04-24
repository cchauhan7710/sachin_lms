import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";

export default function AppLayout() {
  const location = useLocation();

  // Detect admin route correctly
  const isAdmin = location.pathname.startsWith("/admin");

  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed((v) => !v);
  const toggleMobile = () => setMobileOpen((v) => !v);

  const sidebarWidth = collapsed ? "5rem" : "15rem";

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">

      {/* ------------------------------ */}
      {/* SIDEBAR (USER ONLY) */}
      {/* ------------------------------ */}
      {!isAdmin && (
        <>
          {/* DESKTOP SIDEBAR */}
          <div
            className="hidden md:block fixed top-0 left-0 h-full z-20"
            style={{ width: sidebarWidth }}
          >
            <Sidebar isCollapsed={collapsed} toggleCollapse={toggleCollapse} />
          </div>

          {/* MOBILE SIDEBAR */}
          {mobileOpen && (
            <div className="md:hidden fixed inset-0 z-30">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={toggleMobile}
              ></div>

              {/* Drawer */}
              <div className="absolute top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-all">
                <Sidebar isCollapsed={false} toggleCollapse={() => {}} />
              </div>
            </div>
          )}
        </>
      )}

      {/* ------------------------------ */}
      {/* MAIN CONTENT */}
      {/* ------------------------------ */}

      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{
          marginLeft: !isAdmin
            ? (window.innerWidth >= 768 ? sidebarWidth : 0)
            : 0,
        }}
      >
        {/* USER NAVBAR */}
        {!isAdmin && <Navbar toggleSidebar={toggleMobile} />}

        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </div>

        {/* USER FOOTER */}
        {!isAdmin && <Footer />}
      </div>
    </div>
  );
}
