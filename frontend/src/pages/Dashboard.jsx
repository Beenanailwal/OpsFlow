import { useEffect, useState } from "react"
import { fetchTasks } from "../services/taskApi"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])

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

  // 🔥 STATS
  const total = tasks.length
  const pending = tasks.filter(t => t.status === "pending").length
  const inProgress = tasks.filter(t => t.status === "in-progress").length
  const completed = tasks.filter(t => t.status === "completed").length

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl shadow text-center">
          <p className="text-gray-500">Total Tasks</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-yellow-100 p-5 rounded-xl text-center">
          <p className="text-yellow-700">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-700">{pending}</h2>
        </div>

        <div className="bg-blue-100 p-5 rounded-xl text-center">
          <p className="text-blue-700">In Progress</p>
          <h2 className="text-2xl font-bold text-blue-700">{inProgress}</h2>
        </div>

        <div className="bg-green-100 p-5 rounded-xl text-center">
          <p className="text-green-700">Completed</p>
          <h2 className="text-2xl font-bold text-green-700">{completed}</h2>
        </div>

      </div>

    </div>
  )
}