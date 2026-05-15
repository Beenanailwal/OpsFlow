import { useState } from "react"
import API from "../services/api"
import { ToastContainer, toast } from 'react-toastify'


export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"))
  const role = localStorage.getItem("role")
const imageKey = `profileImage_${user?.email}`
const [image, setImage] = useState(user?.profileImage || null)  
const [loading, setLoading] = useState(false)

const handleImageUpload = async (file) => {
  const token = localStorage.getItem("token")

  const formData = new FormData()
  formData.append("image", file)

  try {
    setLoading(true)
    const res = await API.post("/auth/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    })

    const updatedUser = {
  ...user,
  profileImage: res.data.image   
}

localStorage.setItem("user", JSON.stringify(updatedUser))
setImage(res.data.image)

window.dispatchEvent(new Event("userUpdated"))
toast.success("Image uploaded successfully")
  } catch (err) {
    console.log(err)
  }
  finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 md:p-8">

        {/* TOP */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Profile</h1>

          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-red-500 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">

          {/* LEFT */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-bold overflow-hidden">

              {image ? (
  <img
    src={`http://localhost:3000${image}`}
    className="w-full h-full object-cover"
  />
) : user?.profileImage ? (
  <img
    src={`http://localhost:3000${user.profileImage}`}
    className="w-full h-full object-cover"
  />
) : (
  user?.name?.charAt(0).toUpperCase()
)}

            </div>

            <label className="mt-4 text-blue-600 cursor-pointer text-sm font-medium">
  {loading ? "Uploading..." : "Change Photo"}
              <input
                type="file"
                hidden
                disabled={loading}
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </label>
          </div>

          {/* RIGHT */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-semibold">{user?.name}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-semibold capitalize">{role}</p>
            </div>

          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}