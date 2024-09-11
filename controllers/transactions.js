import User from "../models/user.js";
import Transaction from "../models/transaction.js"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var ObjectId = require('mongoose').Types.ObjectId;
import moment from "moment";



export const receiveTransaction= async (req,res)=>{
    const data = req.body;
    console.log(data)
    try{
        const result = await Transaction.create(data)
        const result2= await User.updateOne({_id:data.user_id},{
            accounting_balance: data.accounting_balance
        })
        res.status(200).json({ success: true, result, result2 }); 
  
    }catch (err) {
        res.status(500).json({ success: false, error: err.message }); 
    }
}

export const insertTransactions= async(req,res)=>{
    const {data, user_id,user } = req.body;
    // console.log(data.at(-1).accounting_balance);
    try{
        const result= await Transaction.deleteMany({user_id})
        const result2 = await Transaction.insertMany(data)
        const result3= await User.updateOne({_id:user_id},{
            accounting_balance: data.at(-1).accounting_balance
        })
        const balance= await User.findById(user_id,"accounting_balance")
        const savings= await User.findById(user_id,"savings")
        console.log(savings.savings)
        return(res.json({
            _id:user._id,
            name: user.name,
            email:user.email,
            role:user.role,
            image:user.image,
            accounting_balance:balance.accounting_balance,
            savings:savings.savings}))
        
    }catch (err) {
        console.log(err);
    }
}


export const fetchData = async (req,res)=>{
    try{
        const balance= await User.findById(req.body.id,"accounting_balance")
        console.log(balance)
        return(res.json(balance.accounting_balance))
    }catch(err){
        console.log(err)
    }
}

export const addCategory = async (req,res)=>{
    const {category,description,user_id}=req.body
    console.log(category,description,user_id)
    try{
        const result=await Transaction.updateMany(  {description:description,user_id: user_id},
                                                    {category:category})
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "No matching transactions found to update." });
        }
        return res.json(result);
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: "An error occurred while updating the transactions." });
  
    }
}

export const fetchTransaction =async (req,res)=>{
    const {user_id} = req.body
    try{
    const result1 = await Transaction.find({user_id:user_id})
    const user = await User.findById(user_id)
    return(res.json({result1,
        user:{
            _id:user._id,
            name: user.name,
            email:user.email,
            role:user.role,
            image:user.image,
            savings:user.savings,
            accounting_balance:user.accounting_balance
        }
    }))
    }catch(err){console.log(err)}
}



