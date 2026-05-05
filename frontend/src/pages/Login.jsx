import { useState } from "react"
import API from "../services/api"
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate, Link } from "react-router-dom"

export default function Login({setIsLoggedIn}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
       const {data} = await API.post("/auth/login", {
        email,
        password,
      })

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify({name: data.name}))
 
      setIsLoggedIn(true) 
      toast.success("Login Successfully 🚀")
      setTimeout(() => {
        navigate("/")
      }, 1000);
        
      
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-white shadow-2xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome back
        </h2>

        <input
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  )
}