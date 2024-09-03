import mongoose from "mongoose";
const { Schema } = mongoose;
import moment from "moment";
const goalSchema = new Schema(
{
    name: {
        type: String,
        trim: true,
        required: true,
    },
    user_id:{
        type:Object,
        required:true
    },
    
    progress: {
        type: Number,
        required: true,
        default:0
    },
    goal_money: {
        type: Number,
        required:true
    },
    start_date: {
        type:String,
        required:true,
    },
    finish_date: {
        type:String,
        required:true,
    },
    money_per_month: {
        type:Number,
        required:true,
        default:0,
 
    },
    saved_this_month: {
        type:Number,
        required: true,
        default:0
        
        
    },
    icon_family:{
        type:String,
        required:true,
    },
    icon_name:{
        type:String,
        required:true,
        
    },

    
    },
    { timestamps: true }
);

goalSchema.methods.calculateMoneyPerMonth =function(){
    const today =moment();
    const finishDate = moment(this.finish_date, "DD-MM-YYYY");
    if(today.month()>finishDate.month() && !(today.year()<finishDate.year())){
        return
    }
    
    const months_remaining = (finishDate.year()-today.year())*12 +(finishDate.month()-today.month())+1;
    // console.log(this.name, (this.goal_money-this.progress)/months_remaining)
    this.money_per_month = (this.goal_money-this.progress)/months_remaining;
}
export default mongoose.model("Goal", goalSchema);