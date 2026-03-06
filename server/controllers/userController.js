import User from "../models/User.js"
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";

//get user data
export const getUserData = async (req, res)=>{
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        res.json({success: true, user})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//user enrolled courses with lectures links
export const userEnrolledCourses = async (req, res)=>{
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate("enrolledCourses")
        res.json({success: true, enrolledCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
} 


//purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.auth.userId

    const courseData = await Course.findById(courseId)

    if (!courseData) {
      return res.json({ success: false, message: "Course not found" })
    }

    const finalAmount =
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount: Number(finalAmount.toFixed(2)),
    })

    // ✅ STRIPE CODE MUST BE HERE

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

    const frontendUrl = process.env.FRONTEND_URL
    const currency = process.env.CURRENCY.toLowerCase()

    const lineItems = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(finalAmount * 100),
        },
        quantity: 1,
      },
    ]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${frontendUrl}/loading/my-enrollments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}`,
      line_items: lineItems,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    })

    res.json({ success: true, sessionUrl: session.url })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

//update user course progress
export const updateCourseProgress = async (req, res)=>{

    try {
       const userId = req.auth.userId
        const {courseId, lectureId} = req.body
        const progressData = await CourseProgress.findOne({userId, courseId})
        if(progressData) {
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: true, message: "Lecture already marked as completed"})
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
            return res.json({success: true, message: "Lecture marked as completed"})
        } else {
            const newProgress = await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
            return res.json({success: true, message: "Lecture marked as completed", newProgress})
        }
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//get user course progress
export const getUserCourseProgress = async (req, res)=>{
    try {
        const userId = req.auth.userId
        const {courseId} = req.body

        let progressData = await CourseProgress.findOne({userId, courseId})

        // ✅ If no progress exists, return empty progress
        if(!progressData){
            progressData = {
                lectureCompleted: []
            }
        }

        res.json({success: true, progressData})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//add user ratings to course
export const addUserRating = async (req, res)=>{

    const userId = req.auth.userId
    const {courseId, rating} = req.body
    
    if(!userId || !courseId || !rating || rating < 1 || rating > 5){
        return res.json({success: false, message: "Invalid rating data"})
    }

    try {
        const courseData = await Course.findById(courseId)
        if(!courseData){
            return res.json({success: false, message: "Course not found"})
        }
        const user = await User.findById(userId)
        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success: false, message: "User not enrolled in this course"})
        }
        if (!courseData.ratings) {
            courseData.ratings = []
        }

        const existingRatingIndex = courseData.ratings.findIndex(
        (r) => r.userId.toString() === userId
        )

        if (existingRatingIndex > -1) {
        courseData.ratings[existingRatingIndex].rating = rating
        } else {
        courseData.ratings.push({ userId, rating })
        }
        await courseData.save()
        return res.json({success: true, message: "Rating added successfully"})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}