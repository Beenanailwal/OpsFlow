import Order from "../models/Order.js";
import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";

export const createOrder = async (req,res) => {
    try {
        const {products,note} = req.body
        if(!products || products.length === 0) return res.status(400).json("No products provided")
            let totalAmount = 0

        //Update stock and calculate total
        for(const item of products) {
            const product = await Product.findById(item.product)
            if(!product) return res.status(404).json(`Product not found: ${item.product}`)

                if(product.stock < item.quantity) return res.status(400).json(`Insufficient stock for ${product.name}`)
                    product.stock -= item.quantity
                    totalAmount += product.price * item.quantity
                    await product.save()

                     // Inventory Log
      await InventoryLog.create({
        product: product._id,
        change: -item.quantity,
        updatedBy: req.user._id,
        note: "Order created"
      });
               }


               const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount,
      note
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
}


//Get user's order history
export const getMyOrders = async (req,res) => {
    try {
        const orders = await Order.find({user: req.user._id})
        .populate("products.product", "name price")
        .sort({createdAt:-1})

        res.json(orders)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//Update order status (Admin/Staff)
export const updateOrderStatus = async(req,res) => {
    try {
        const {status} = req.body
        const order = await Order.findById(req.params.id)
        if(!order) return res.status(404).json("Order not found")

            order.status = status
            await order.save()
            res.json(order)

    }catch(error) {
        res.status(500).json(error.message)
    }
}

//Cancel order (return stock)
export const cancelOrder = async(req,res) => {
    try {
            const order = await Order.findById(req.params.id)
            if(!order) return res.status(404).json("Order not found")

                if(order.status==="Cancelled") return res.status(400).json("Order already cancelled")

                    //Return Products to stock
                    for(const item of order.products){
                        const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();

        await InventoryLog.create({
          product: product._id,
          change: item.quantity,
          updatedBy: req.user._id,
          note: "Order cancelled"
        });
      }
                    }
                    order.status = "Cancelled";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

//get all orders
export const getAllOrders = async(req,res) => {
    try {
        const orders = await Order.find()
        .populate("user", "name email")
        .populate("products.product","name price")
        res.json(orders)
    }
    catch(error) {
        res.status(500).json(error.message)
    }
}