import Product from "../models/Product.js"
import InventoryLog from "../models/InventoryLog.js";

//Add product(Admin only)
export const addProduct = async(req,res) => {
    try {
        const { name, category, price, stock } = req.body
        const exist = await Product.findOne({name})
        if(exist) return res.status(400).json("Product already exists") 

            const product = await Product.create({name, category, price, stock})
            res.status(201).json(product)
    }
    catch(error){
        res.status(500).json(error.message)
    }
}

//Get all products + search/filter
export const getProducts = async(req,res) => {
    try{
        const { category, minPrice, maxPrice, search} = req.query
        let filter = {}

        if(category) filter.category = category
        if(minPrice || maxPrice) {
            filter.price = {}
            if(minPrice) filter.price.$gte = Number(minPrice)
            if(maxPrice) filter.price.$lte = Number(maxPrice)
        }
    if(search) filter.name = { $regex: search, $options: "i"}

    const products = await Product.find(filter)
    res.json(products)
    }
    catch(error){
        res.status(500).json(error.message)
    }
}


//Update product (admin only)
export const updateProduct = async(req,res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product) return res.status(404).json("Product not found")

            const {name, category, price, stock} =  req.body
            product.name = name || product.name
            product.category = category || product.category;
            product.price = price || product.price;
            product.stock = stock || product.stock

            const update = await product.save()
            res.json(update)
    }
    catch(error){
        res.status(500).json(error.message)
    }
}

//Delete product (admin only)

export const deleteProduct = async(req,res) => {
    try{
        const product = await Product.findById(req.params.id)
        if(!product) return res.status(404).json("Product not found")
            
            await product.deleteOne()
            res.json({message:"Product deleted successfuly"})
    }
    catch(error){
        res.status(500).json(error.message)
    }
}


//Update stock (Admin or Staff)
export const updateStock = async(req,res) => {
    try {
        const {stockChange, note} = req.body
        const product = await Product.findById(req.params.id)
        if(!product) return res.status(404).json("Product not found") 

            product.stock+= Number(stockChange)
            if(product.stock<0) product.stock = 0

            const update = await product.save()

            // Create Inventory Log
    await InventoryLog.create({
      product: update._id,        // Product reference
      change: Number(stockChange), // How much stock changed
      updatedBy: req.user._id,     // Logged-in user
      note: note || ""             // Optional note
    });

            if(update.stock<=5) {
                console.warn(`Low stock alert! Product "${update.name}" has only ${update.stock} items left.`);
            }

            res.json(update);
    } 
    catch (error) {
    res.status(500).json(error.message);
  }
}


