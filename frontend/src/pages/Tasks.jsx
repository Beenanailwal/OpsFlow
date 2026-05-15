import { useState, useEffect } from "react"
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from "../services/taskApi"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Tasks() {
  const [tasks, setTasks] = useState([])

  // 🔍 SEARCH + FILTER
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  // 🔥 PAGINATION
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  // ADD
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // EDIT
  const [showEdit, setShowEdit] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editStatus, setEditStatus] = useState("pending")

  // DELETE
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // LOAD
  const loadTasks = async () => {
    try {
      const res = await fetchTasks()
      const data = res.data

      if (Array.isArray(data)) setTasks(data)
      else if (Array.isArray(data.tasks)) setTasks(data.tasks)
      else setTasks([])
    } catch (err) {
      console.log(err)
      setTasks([])
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  // FILTER
  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchFilter =
      filter === "all" ? true : task.status === filter

    return matchSearch && matchFilter
  })

  // 🔥 PAGINATION LOGIC
  const indexOfLast = currentPage * tasksPerPage
  const indexOfFirst = indexOfLast - tasksPerPage
  const currentTasks = filteredTasks.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage)

  // 🔥 RESET PAGE
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filter])

  // ADD
  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error("Title required")
      return
    }

    await createTask({
      title: title.trim(),
      description: description.trim()
    })

    setShowAdd(false)
    setTitle("")
    setDescription("")
    loadTasks()
    toast.success("Task added")
  }

  // EDIT
  const openEdit = (task) => {
    setShowEdit(true)
    setEditId(task._id)
    setEditTitle(task.title)
    setEditDesc(task.description)
    setEditStatus(task.status)
  }

  const handleUpdate = async () => {
    await updateTask(editId, {
      title: editTitle,
      description: editDesc,
      status: editStatus
    })

    setShowEdit(false)
    loadTasks()
    toast.success("Task updated")
  }

  // DELETE
  const openDelete = (id) => {
    setDeleteId(id)
    setShowDelete(true)
  }

  const confirmDelete = async () => {
    await deleteTask(deleteId)
    setShowDelete(false)
    loadTasks()
    toast.success("Task deleted")
  }

  return (
    <div className="p-4 md:p-6">

  {/* HEADER */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
    <h1 className="text-xl md:text-2xl font-bold">Tasks</h1>

    <button
      onClick={() => setShowAdd(true)}
      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
    >
      + Add Task
    </button>
  </div>

  {/* SEARCH + FILTER */}
  <div className="flex flex-col md:flex-row gap-3 mb-5">

    <input
      placeholder="Search title..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border p-2 rounded-lg w-full md:w-1/2"
    />

    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="border p-2 rounded-lg w-full md:w-1/4"
    >
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>

  </div>

  {/* TABLE (desktop) */}
  <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">

    <table className="w-full text-sm">

      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3 text-left">Description</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Created</th>
          <th className="p-3 text-left">Updated</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {currentTasks.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center p-4">
              No tasks found
            </td>
          </tr>
        ) : (
          currentTasks.map(task => (
            <tr key={task._id} className="border-t hover:bg-gray-50">

              <td className="p-3 font-medium">{task.title}</td>
              <td className="p-3 text-gray-500">{task.description || "-"}</td>

              <td className="p-3">
                <span className={`px-3 py-1 text-xs rounded-full ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {{
                    "pending": "Pending",
                    "in-progress": "In Progress",
                    "completed": "Completed"
                  }[task.status]}
                </span>
              </td>

              <td className="p-3 text-gray-500">
                {new Date(task.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3 text-gray-500">
                {new Date(task.updatedAt).toLocaleDateString()}
              </td>

              <td className="p-3 flex gap-2 justify-center">

                <button
                  onClick={() => openEdit(task)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={() => openDelete(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))
        )}
      </tbody>

    </table>
  </div>

  {/* 🔥 MOBILE VIEW (cards) */}
  <div className="md:hidden flex flex-col gap-3">

    {currentTasks.length === 0 ? (
      <p className="text-center text-gray-500">No tasks found</p>
    ) : (
      currentTasks.map(task => (
        <div
          key={task._id}
          className="bg-white p-4 rounded-xl shadow border"
        >

          <div className="flex justify-between items-start">
            <h2 className="font-semibold">{task.title}</h2>

            <span className={`text-xs px-2 py-1 rounded ${
              task.status === "completed"
                ? "bg-green-100 text-green-700"
                : task.status === "in-progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {task.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {task.description || "-"}
          </p>

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => openEdit(task)}
              className="flex-1 bg-yellow-500 text-white py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => openDelete(task._id)}
              className="flex-1 bg-red-500 text-white py-1 rounded"
            >
              Delete
            </button>
          </div>

        </div>
      ))
    )}

  </div>

  {/* PAGINATION */}
  <div className="flex flex-wrap justify-center gap-2 mt-6">

    <button
      onClick={() => setCurrentPage(p => p - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-200 rounded"
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === i + 1
            ? "bg-blue-600 text-white"
            : "bg-gray-100"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage(p => p + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-200 rounded"
    >
      Next
    </button>

  </div>

  <ToastContainer />
</div>
  )
}