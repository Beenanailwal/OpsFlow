import Task from "../models/Task.js";
import { createTaskSchema } from "../validators/taskValidator.js";


let cache = {}

//Create task
export const createTask = async (req, res, next) => {
    const { title, description } = req.body

    try {
        const { error } = createTaskSchema.validate(req.body)

        if (error) {
            res.status(400)
            throw new Error(error.details[0].message)
        }

        const task = await Task.create({
            title,
            description,
            user: req.user._id
        })

        cache = {}

        res.status(201).json({ task })
    }
    catch (error) {
        next(error)
    }
}



//Get all tasks
export const getTasks = async (req, res, next) => {
    try {
        const { search = "",
             status = "",
              page = 1,
               limit = 10,
                sort = "desc",
                 startDate = "",
                  endDate = ""
                } = req.query


                const key = `${req.user._id}-${search}-${status}-${page}-${startDate}-${endDate}-${sort}`
                if(cache[key]) {
                    // console.log("cache hit")
                    return res.status(200).json(cache[key])             
                }  
                // console.log("Db hit")         

                
        let query = {}

        if (req.user.role !== "admin") {
            query.user = req.user._id
        }

        if (status) {
            query.status = status
        }

        if(startDate || endDate) {
            query.createdAt = {}
        }
        if(startDate) {
            query.createdAt.$gte = new Date(startDate + "T00:00:00.000Z")
        }
        if(endDate) {
            query.createdAt.$lte = new Date(endDate + "T23:59:59.999Z")
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        const skip = (page - 1) * limit

        const sortOption = sort === "asc" ? 1 : -1;

        const tasks = await Task.find(query)
        .sort({ createdAt: sortOption })
            .skip(skip)
            .limit(Number(limit))
            
        const total = await Task.countDocuments(query)

        const response = {
            tasks,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            total
        }
        cache[key] = response

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

//Update Task
export const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            res.status(404)
            throw new Error("Task not found")
        }

        if (task.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            res.status(401)
            throw new Error("Not authorized")
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true })

            
            cache = {}
        res.status(200).json(updatedTask)
    } catch (error) {
        next(error)
    }
}

//Delete task
export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            res.status(404)
            throw new Error("Task not found")
        }

        if (task.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin") {
            res.status(401)
            throw new Error("Not authorized")
        }

        await task.deleteOne()
        cache = {}
        res.status(200).json({ message: "Task deleted" })
    } catch (error) {
        next(error)
    }
}
