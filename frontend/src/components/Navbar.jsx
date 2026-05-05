import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Navbar({ setIsLoggedIn, setSidebarOpen, sidebarOpen }) {
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState("User")
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser || storedUser === "undefined") return

    try {
      const user = JSON.parse(storedUser)
      if (user?.name) setUserName(user.name)
    } catch {}
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    navigate("/login")
  }

  const format = (n) =>
    n.charAt(0).toUpperCase() + n.slice(1)

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b flex items-center justify-between px-6 transition-all duration-300 z-30 ${
        sidebarOpen ? "left-60" : "left-16"
      }`}
    >
      <h1 className="text-xl font-bold text-blue-600">
  ProTasker
</h1>
      {/* Left */}
      <div className="flex items-center gap-3">
       
      </div>

      {/* Right */}
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full cursor-pointer"
        >
          {userName.charAt(0).toUpperCase()}
        </div>

        {open && (
          <div className="absolute right-0 top-14 w-52 bg-white border rounded-xl shadow-xl z-50">
            <div className="px-4 py-3 border-b">
  <p className="text-sm font-medium text-gray-800">
    Hello, {format(userName)}
  </p>
</div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}