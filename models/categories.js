import mongoose from "mongoose";
const { Schema } = mongoose;

const categoriesSchema = new Schema(
    
    {
        name:{
            type:String,
            required:true
        },
        user_id:{
            type:String,
            default:"general",
            required:true
        }
    }
);

export default mongoose.model("Category",categoriesSchema);