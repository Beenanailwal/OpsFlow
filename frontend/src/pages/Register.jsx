import { useState } from "react"
import API from "../services/api"
import { ToastContainer, toast } from 'react-toastify'
import { Link } from "react-router-dom"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
console.log(name,email,password)
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      })

      toast.success("Registered Successfully 🚀")
      setName("")
      setEmail("")
      setPassword("")
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-white shadow-2xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Account
        </h2>

        <input
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
  Already have an account?{" "}
  <Link to="/login" className="text-blue-600 font-semibold hover:underline">
    Login
  </Link>
</p>
      </form>
      <ToastContainer />
    </div>
  )
}