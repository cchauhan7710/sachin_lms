import AdminSidebar from "./components/layouts/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* SIDEBAR */}
      {/* Desktop → fixed */}
      {/* Mobile → normal flow so Menu button stays visible */}
      <aside className="md:fixed md:top-0 md:left-0 md:w-64 md:h-full md:z-30">
        <AdminSidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1 p-4 md:p-8 overflow-y-auto
          md:ml-64     /* push content to right on desktop */
        "
      >
        {children}
      </main>
    </div>
  );
}
