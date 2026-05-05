import { Link, useLocation } from "react-router-dom"

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `flex items-center ${
      sidebarOpen ? "justify-start px-3" : "justify-center"
    } gap-3 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-blue-100 text-blue-600 font-medium shadow-sm"
        : "text-gray-600 hover:bg-gray-100"
    }`

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-white border-r z-50 transition-all duration-300 ${
      sidebarOpen ? "w-60" : "w-16"
    }`}>

      {/* Toggle + Logo */}
      <div className="flex items-center gap-3 h-16 px-3">

        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg"
        >
          ☰
        </button>

        {sidebarOpen && (
          <h1 className="text-lg font-semibold text-blue-600">
            ProTasker
          </h1>
        )}

      </div>

      {/* LINKS */}
      <nav className="mt-4 flex flex-col gap-3 px-2">

        <Link to="/" className={linkClass("/")}>
          🏠 {sidebarOpen && "Dashboard"}
        </Link>

        <Link to="/tasks" className={linkClass("/tasks")}>
          📋 {sidebarOpen && "Tasks"}
        </Link>

        <Link to="/products" className={linkClass("/products")}>
          📦 {sidebarOpen && "Products"}
        </Link>

        <Link to="/create-order" className={linkClass("/create-order")}>
          🛒 {sidebarOpen && "Create Order"}
        </Link>

        <Link to="/my-orders" className={linkClass("/my-orders")}>
          📑 {sidebarOpen && "My Orders"}
        </Link>
        <Link to="/add-product" className={linkClass("/add-product")}>
  <span>📦</span>
  {sidebarOpen && "Add Product"}
</Link>

      </nav>
    </aside>
  )
}