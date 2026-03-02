import {clerkClient} from "@clerk/express"
import Course from "../models/Course.js"
import {v2 as cloudinary} from "cloudinary"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"

//update role to educator
export const updateRoleToEducator = async (req, res)=>{
    try {
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: "educator",
            }
        })
        res.json({success: true, message: "You can publish a coure now"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// add new course
export const addCourse = async (req, res)=>{
    try {
        const {courseData} = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId
        if(!imageFile){
            return res.json({success: false, message: "Thumbnail is not Atached"})
        }
        const parseCourseData = await JSON.parse(courseData)
        parseCourseData.educator = educatorId
        const newCourse = await Course.create(parseCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()
        res.json({success: true, message: "Course Added Successfully"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}
    

//get educator courses
export const getEducatorCourses = async (req, res)=>{
    try {
        const educatorId = req.auth.userId
        const courses = await Course.find({educator: educatorId})
        res.json({success: true, courses})
    }   catch (error) {
        res.json({success: false, message: error.message})
    }
}

//get educator dashboard data (no. of courses, enrolled students, total earnings)
export const educatorDashboardData = async (req, res) => {
  try {
    const educatorId = req.auth.userId

    const courses = await Course.find({ educator: educatorId })
    const totalCourses = courses.length
    const courseIds = courses.map(course => course._id)

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate("userId", "name imageUrl")

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    )

    const enrolledStudentsData = purchases.map(purchase => ({
      student: purchase.userId,
      courseId: purchase.courseId,
      purchaseDate: purchase.createdAt
    }))

    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings,
        totalEnrollments: purchases.length,
        enrolledStudentsData
      }
    })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

//get enrolled students data with purchased courses
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educatorId = req.auth.userId

        // Get all educator courses
        const courses = await Course.find({ educator: educatorId })
        const courseIds = courses.map(course => course._id)

        // Get completed purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        }).populate("userId", "name imageUrl").populate("courseId", "courseTitle")

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))
        res.json({success: true, enrolledStudents})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}