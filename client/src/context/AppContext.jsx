import { useEffect, useState } from "react"
import { createContext }  from "react"
import { dummyCourses } from "../assets/assets"
import { useNavigate } from "react-router-dom"
import humanizeDuration  from "humanize-duration"


export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const currency = import.meta.env.VITE_CURRENCY

    const [allCourses, setAllCourese] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])

     const navigate = useNavigate()


     // function to calculate average rating course
    const calculateRating = (course)=>{
        if (course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0
        
        course.courseRatings.forEach(rating =>{
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }

    // function to calculate course chapter time

    const calculateChapterTime = (chapter)=>{
        let time = 0
        chapter.chapterContent.map((lecture)=>time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    // function to calculate course duration
    const calculateCourseDuration = (course) => {
    let totalMinutes = 0;

    course?.courseContent?.forEach((chapter) => {
        chapter?.courseContent?.forEach((lecture) => {
            totalMinutes += lecture?.lectureDuration || 0;
        });
    });

    return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"] });
};

    // function caculate to No of Lecture in course
    const calculateNoOfLectures = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach(chapter=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        })
        return totalLectures
    }

    // Fetch user enrolled courses
    const fetchUserEnrolledCourses = async ()=> {
        setEnrolledCourses(dummyCourses)
    }

    // fetch all courses

    const fetchAllCourses = async ()=>{
        setAllCourese(dummyCourses)
    }

    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])

    const value = {
        currency, allCourses, navigate, calculateRating, 
        isEducator, setIsEducator, calculateNoOfLectures, 
        calculateCourseDuration, calculateChapterTime,
        enrolledCourses, fetchUserEnrolledCourses
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}