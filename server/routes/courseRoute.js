import express from "express"
import { getAllCourses, getCourseId } from "../controllers/courseController.js"

const courseRouter = express.Router()

//Add eductor role
courseRouter.get("/all", getAllCourses)
courseRouter.get("/:id", getCourseId)

export default courseRouter