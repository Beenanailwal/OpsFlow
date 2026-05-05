import API from "./api"

// CREATE ORDER
export const createOrder = async (cart) => {
  const payload = {
    products: cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }))
  }

  const res = await API.post("/orders", payload)
  return res.data
}


// GET MY ORDERS (THIS MUST BE EXACT NAME)
export const getMyOrders = async () => {
  const res = await API.get("/orders/myorders")
  return res.data
}
