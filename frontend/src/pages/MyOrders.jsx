import { useEffect, useState } from "react"
import { getMyOrders } from "../services/orderApi"

function MyOrders() {

  const [orders, setOrders] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await getMyOrders()
      setOrders(data)
    }
    load()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">📦 My Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet</p>
      )}

      {orders.map(order => (
        <div
          key={order._id}
          className="bg-white border rounded-xl p-5 mb-5 shadow-sm hover:shadow-md transition"
        >

          {/* TOP */}
          <div className="flex justify-between items-center mb-3">

            <div>
              <p className="text-sm text-gray-500">
                Order ID: {order._id.slice(-6)}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* STATUS BADGE */}
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Processing"
                ? "bg-blue-100 text-blue-700"
                : order.status === "Shipped"
                ? "bg-purple-100 text-purple-700"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {order.status}
            </span>

          </div>

          {/* PRODUCTS */}
          <div className="border-t pt-3">

            {order.products.map((p, i) => (
              <div
                key={i}
                className="flex justify-between text-sm mb-1"
              >

                <span>
                  {p.product?.name}
                </span>

                <span className="text-gray-600">
                  × {p.quantity}
                </span>

              </div>
            ))}

          </div>

          {/* TOTAL */}
          <div className="border-t mt-3 pt-3 flex justify-between font-semibold">

            <span>Total</span>
            <span>₹{order.totalAmount}</span>

          </div>

        </div>
      ))}

    </div>
  )
}

export default MyOrders