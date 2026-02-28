import mongoose from "mongoose"

//conect to the Mongodb databes

const connectDB = async()=>{
    mongoose.connection.on("connected", ()=>console.log("Database Connected"))

    await mongoose.connect(`${process.env.MONGODB_URI}/MPTC`)
}

export default connectDB