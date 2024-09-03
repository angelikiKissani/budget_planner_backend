import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema(
    
    {
        user_id:{
            type:Object,
            required:true
        },
        transaction_id:{
            type:Object,
            required:true

        },
        date:{type: String},
        time:{type: String},
        description:{
            type: String,
            required:true
        },
        category:{
            type: String,
            
        },
        price:{
            type: Number,
            required:true
        },
        accounting_balance:{
            type: Number,
        }
   
   

});

export default mongoose.model("Transaction",transactionSchema);