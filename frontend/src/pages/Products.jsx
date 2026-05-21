import { useState, useEffect } from "react"
import API from "../services/api"
import { createOrder } from "../services/orderApi"
import { useNavigate } from "react-router-dom"
import { deleteProduct } from "../services/productApi"
import { ToastContainer, toast } from 'react-toastify'

export default function Products() {

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const navigate = useNavigate()
  const isAdmin = localStorage.getItem("role") === "admin"

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data))
  }, [])

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get("/cart")
        setCart(data.items || [])
      } catch (error) {
        console.log(error)
      }
    }

    fetchCart()
  }, [])

  // ADD
  const addToCart = async (product) => {
    if (product.stock === 0) {
  toast.error("Out of stock")
  return
}
    try {
      await API.post("/cart", {
        productId: product._id,
        quantity: 1
      })

      const { data } = await API.get("/cart")
      setCart(data.items || [])

      toast.success("Added to cart")
    } catch (error) {
      console.log(error)
      toast.error("Not Added")
    }
  }
  const handleDelete = (id) => {
    setDeleteId(id)
    setShowDelete(true)
  }

  const confirmDelete = async () => {
    await deleteProduct(deleteId)
    setProducts(prev => prev.filter(p => p._id !== deleteId))
    setShowDelete(false)
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

  const remove = async (id) => {
    try {
      await API.delete(`/cart/${id}`)

      const { data } = await API.get("/cart")
      setCart(data.items || [])
    } catch (error) {
      console.log(error)
    }
  }

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  const placeOrder = async () => {
    if (!cart.length) return
    await createOrder(cart)
    setCart([])
    toast.success("Order placed")
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 md:px-6 pb-6">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 pt-4">

        {/* PRODUCTS */}
        <div className="flex-1">

          {/* <h1 className="text-xl md:text-2xl font-semibold mb-4">
        Products
      </h1> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {products.map(p => (
              <div
                key={p._id}
                className="bg-white rounded-xl p-4 border hover:shadow-md transition relative"
              >

                {/* ADMIN BUTTONS */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">

                    <button
                      onClick={() => navigate(`/edit-product/${p._id}`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:opacity-90"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:opacity-90"
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

                <p className="text-lg font-bold mt-3 text-gray-900">
                  ₹{p.price}
                </p>

                <p className="text-sm text-gray-500">
                  Stock: {p.stock}
                </p>

                <button
  onClick={() => addToCart(p)}
  disabled={p.stock === 0}
  className={`mt-4 w-full py-2 rounded-lg text-white ${
    p.stock === 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90"
  }`}
>
  {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
</button> 

              </div>
            ))}

          </div>
        </div>

        {/* CART */}
        <div className="w-full lg:w-[320px]">

          <div className="bg-white p-4 rounded-xl shadow-sm border lg:sticky lg:top-20">

            <h2 className="text-lg font-bold mb-4">🛒 Cart</h2>

            {cart.length === 0 && (
              <p className="text-gray-400 text-sm">No items</p>
            )}

            {cart.map((item, i) => (
              <div key={i} className="border-b py-3">

                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    {item.product.name}
                  </p>

                  <button
                    onClick={() => remove(item.product._id)}
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  ₹{item.product.price}
                </p>

                {/* QTY */}
                <div className="flex items-center gap-2 mt-2">

                  <button
                    onClick={() => decrease(item)}
                    className="w-6 h-6 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="text-sm">{item.quantity}</span>

                  <button
                    onClick={() => increase(item)}
                    className="w-6 h-6 bg-gray-200 rounded"
                  >
                    +
                  </button>

                </div>

                {/* SUBTOTAL */}
                <p className="text-xs text-gray-600 mt-1">
                  ₹{item.product.price * item.quantity}
                </p>

              </div>
            ))}

            {cart.length > 0 && (
              <>
                <div className="flex justify-between mt-4 font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <button
                  onClick={() => navigate("/create-order")}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Checkout
                </button>
              </>
            )}

          </div>

        </div>

      </div>
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm">
            <h2 className="text-lg font-bold mb-4">Delete Product?</h2>

            <p className="text-gray-500 mb-4">
              Are you sure you want to delete this product?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}