import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { createOrder } from "../services/orderApi"

export default function CreateOrder() {

  const { state } = useLocation()
  const navigate = useNavigate()

  const [cart] = useState(() => {
  if (state) return JSON.parse(JSON.stringify(state)) // 🔥 deep copy
  const saved = localStorage.getItem("cart")
  return saved ? JSON.parse(saved) : []
})

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  const handleOrder = async () => {
    if (!cart.length) return

    await createOrder(cart)
    localStorage.removeItem("cart")

    alert("Order Placed Successfully ✅")
    navigate("/my-orders")
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">

        {/* LEFT: ITEMS */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">

          <h2 className="text-xl font-semibold mb-4">
            Order Items
          </h2>

          {cart.length === 0 && (
            <p className="text-gray-500">No items in cart</p>
          )}

          {cart.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{item.product.price} × {item.quantity}
                </p>
              </div>

              <p className="font-semibold">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          ))}

        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-20">

          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2 text-sm">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between mb-4 text-sm">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Grand Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleOrder}
            disabled={!cart.length}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-300"
          >
            Confirm Order
          </button>

        </div>

      </div>

    </div>
  )
}