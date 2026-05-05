import { useState, useEffect } from "react"
import API from "../services/api"
import { createOrder } from "../services/orderApi"
import { useNavigate } from "react-router-dom"
import { deleteProduct } from "../services/productApi"

export default function Products() {

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(() => {
  const saved = localStorage.getItem("cart")
  return saved ? JSON.parse(saved) : []
})
  const navigate = useNavigate()
  const isAdmin = localStorage.getItem("role") === "admin"

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data))
  }, [])

  useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart))
}, [cart])

  // ADD
  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(i => i.product._id === product._id)

      if (exist) {
        if (exist.quantity >= product.stock) return prev
        return prev.map(i =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }

      return [...prev, { product, quantity: 1 }]
    })
  }
const handleDelete = async (id) => {
  const ok = confirm("Delete this product?")
  if (!ok) return

  await deleteProduct(id)

  setProducts(prev => prev.filter(p => p._id !== id))
}

  const increase = (item) => {
    setCart(prev =>
      prev.map(p =>
        p.product._id === item.product._id && p.quantity < p.product.stock
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    )
  }

  const decrease = (item) => {
    setCart(prev =>
      prev.map(p =>
        p.product._id === item.product._id
          ? { ...p, quantity: Math.max(1, p.quantity - 1) }
          : p
      )
    )
  }

  const remove = (id) => {
    setCart(prev => prev.filter(i => i.product._id !== id))
  }

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  const placeOrder = async () => {
    if (!cart.length) return
    await createOrder(cart)
    setCart([])
    alert("Order placed")
  }

  return (
    <div className="bg-gray-100 min-h-screen px-6 pb-6">

  <div className="max-w-7xl mx-auto flex gap-6 items-start pt-2">

    {/* PRODUCTS */}
    <div className="flex-1 min-h-[calc(100vh-80px)]">

      {/* <h1 className="text-2xl font-semibold mb-4">Products</h1> */}


          <div className="grid grid-cols-3 gap-6">

            {products.map(p => (
              <div
  key={p._id}
  className="bg-white rounded-xl p-5 border hover:shadow-md transition relative"
>

  {/* 🔥 ADMIN BUTTONS (corner me) */}
  {isAdmin && (
    <div className="absolute top-3 right-3 flex gap-2">

      <button
        onClick={() => navigate(`/edit-product/${p._id}`)}
        className="text-gray-400 hover:text-yellow-500"
      >
        ✏️
      </button>

      <button
        onClick={() => handleDelete(p._id)}
        className="text-gray-400 hover:text-red-500"
      >
        🗑
      </button>

    </div>
  )}

  {/* PRODUCT INFO */}
  <h2 className="text-base font-semibold text-gray-800">
    {p.name}
  </h2>

  <p className="text-xs text-gray-400 mt-1">
    {p.category}
  </p>

  <p className="text-lg font-bold mt-3">
    ₹{p.price}
  </p>

  <p className="text-sm text-gray-500">
    Stock: {p.stock}
  </p>

  {/* ADD TO CART */}
  <button
    onClick={() => addToCart(p)}
    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
  >
    Add to Cart
  </button>

</div>
            ))}

          </div>
        </div>

        {/* 🛒 RIGHT: CART */}
        <div className="w-[300px] self-start">

      <div className="bg-white p-4 rounded border sticky top-20">

            <h2 className="text-xl font-bold mb-4">🛒 Cart</h2>

            {cart.length === 0 && (
              <p className="text-gray-400">No items</p>
            )}

            {cart.map((item, i) => (
              <div
                key={i}
                className="border-b py-3"
              >

                <div className="flex justify-between">
                  <p className="font-medium">
                    {item.product.name}
                  </p>

                  <button
                    onClick={() => remove(item.product._id)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  ₹{item.product.price}
                </p>

                {/* QTY */}
                <div className="flex items-center gap-2 mt-2">

                  <button
                    onClick={() => decrease(item)}
                    className="w-7 h-7 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increase(item)}
                    className="w-7 h-7 bg-gray-200 rounded"
                  >
                    +
                  </button>

                </div>

                {/* SUBTOTAL */}
                <p className="text-sm text-gray-600 mt-1">
                  ₹{item.product.price * item.quantity}
                </p>

              </div>
            ))}

            {/* TOTAL */}
            {cart.length > 0 && (
              <>
                <div className="flex justify-between mt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
<button
      onClick={() => navigate("/create-order", { state: cart })}
      className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
    >
      Go to Checkout
    </button>
                {/* <button
                  onClick={placeOrder}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Place Order
                </button> */}
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}