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
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Tasks</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Task
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Tilte, Description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/2"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-50 text-gray-600 text-sm">
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
            currentTasks.map((task) => (
              <tr key={task._id} className="border-t">

                <td className="p-3">{task.title}</td>
                <td className="p-3">{task.description || "-"}</td>

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

                <td className="p-3">
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button onClick={() => openEdit(task)}>Edit</button>
                  <button onClick={() => openDelete(task._id)}>Delete</button>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔥 PAGINATION UI */}
      <div className="flex justify-center gap-2 mt-4">
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