import User from "../models/user.js";
import Transaction from "../models/transaction.js"
import Goal from "../models/goal.js"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var ObjectId = require('mongoose').Types.ObjectId;
import moment from "moment";



// export const receiveTransaction= async (req,res)=>{
//     const data = req.body;
//     console.log(data)
//     try{
//         const result = await Transaction.create(data)

//         const user = await User.findOne({ _id: data.user_id });

//         if (!user) {
//           return res.status(404).json({ success: false, message: "User not found" });
//         }
    
//         const currentSavings = user.savings;
//         const accountingBalance = data.accounting_balance; 
//         const availableBalance = accountingBalance - currentSavings;

//         if (availableBalance < 0) {
//             console.log(`Excess amount detected: ${availableBalance} EUR. Adjusting savings...`);

//             //find all goals
//             // const userGoals = await Goal.find({ user_id });
//             // if (!userGoals || userGoals.length === 0) {
//             //     return res.status(404).json({ success: false, message: "No goals found for this user." });
//             //   }


//             // for (const goal of userGoals) {
//             // // Calculate the proportion of savings to remove from this goal
//             //     const proportionToRemove = parseFloat((goal.progress / currentSavings) * Math.abs(availableBalance)).toFixed(1);
        
//             //     // Update this goal's savings for this month
//             //     const newProgress = Math.max(0, goal.progress - proportionToRemove);


//             //     const today =moment();
//             //     const finishDate = moment(goal.finish_date, "DD-MM-YYYY");
//             //     if(today.month()>finishDate.month() && !(today.year()<finishDate.year())){
//             //         continue
//             //     }
//             //     // Check if the goal is still ongoing
//             //     if (today.isAfter(finishDate, 'month')) {
//             //         continue;  // Skip updating this goal if the finish date has passed
//             //     }
        
                
//             //     const months_remaining = (finishDate.year()-today.year())*12 +(finishDate.month()-today.month())+1;
//             //     const new_money_per_month = parseFloat(((goal.goal_money - newProgress) / months_remaining).toFixed(1));

        
//             //     // Update the goal in the database
//             //     await Goal.updateOne(
//             //         { _id: goal._id },
//             //         { progress: newProgress,
//             //         saved_this_month:0,
//             //         money_per_month: new_money_per_month

//             //         }
//             //     );
//             // }

//             // //update savings
//             // const newsavings= currentSavings+availableBalance;
//             // await User.findOneAndUpdate({ _id: data.user_id },{
//             //     savings: newsavings ,
//             // });

//         }


//         const result2= await User.updateOne({_id:data.user_id},{
//             accounting_balance: data.accounting_balance
//         })
//         res.status(200).json({ success: true, result, result2 }); 
  
//     }catch (err) {
//         res.status(500).json({ success: false, error: err.message }); 
//     }
// }

export const receiveTransaction= async (req,res)=>{
    const data = req.body;
    console.log(data)
    try{
        const result = await Transaction.create(data)

        const user = await User.findOne({ _id: data.user_id });

        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
    
        const currentSavings = user.savings;
        const accountingBalance = data.accounting_balance; 
        const availableBalance = accountingBalance - currentSavings;

        if (availableBalance < 0) {
            console.log(`Excess amount detected: ${availableBalance} EUR. Adjusting savings...`);

            // find all goals
            const userGoals = await Goal.find({ user_id:data.user_id });
            if (!userGoals || userGoals.length === 0) {
                return res.status(404).json({ success: false, message: "No goals found for this user." });
              }



            for (const goal of userGoals) {
            // Calculate the proportion of savings to remove from this goal
                const proportionToRemove = parseFloat((goal.progress / currentSavings) * Math.abs(availableBalance).toFixed(1));
        
                // Update this goal's savings for this month
                const newProgress = Math.max(0, goal.progress - proportionToRemove);


                const today =moment();
                const finishDate = moment(goal.finish_date, "DD-MM-YYYY");
                if(today.month()>finishDate.month() && !(today.year()<finishDate.year())){
                    continue
                }
                // Check if the goal is still ongoing
                if (today.isAfter(finishDate, 'month')) {
                    continue;  // Skip updating this goal if the finish date has passed
                }
        
                
                const months_remaining = (finishDate.year()-today.year())*12 +(finishDate.month()-today.month())+1;
                const new_money_per_month = parseFloat(((goal.goal_money - newProgress) / months_remaining).toFixed(1));
                
                
                console.log("goal:"+goal.name+"\n"+"progress:"+newProgress+"moneypermonth"+new_money_per_month+"\n")
        
                // Update the goal in the database
                await Goal.updateOne(
                    { _id: goal._id },
                    { progress: parseFloat(newProgress.toFixed(1)),
                    saved_this_month:0,
                    money_per_month: new_money_per_month

                    }
                );
            }

            //update savings
            const newsavings= currentSavings+availableBalance;

            console.log("new savings:"+newsavings)
            await User.findOneAndUpdate({ _id: data.user_id },{
                savings: newsavings ,
            });

        }


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


const updateGoal= async (goal, price, old,user_id)=>{
    console.log("goal progress:"+goal.progress)
    console.log("price:"+price)
    const progressChange = old ? goal.progress + price : goal.progress - price;
    const goalMoneyChange = old ? goal.goal_money + price : goal.goal_money - price;

    await Goal.findOneAndUpdate(
        {name:goal.name,user_id:user_id},
        {
        progress:parseFloat(progressChange.toFixed(1)),
        goal_money:parseFloat(goalMoneyChange.toFixed(1)),
        saved_this_month:0
        }, 
        {useFindAndModify:false})
    const updatedGoal =await Goal.findOne({name:goal.name,user_id:user_id})
    
    updatedGoal.calculateMoneyPerMonth();
    await updatedGoal.save();
}

const updateTransaction = async (transaction_id,goal,res)=>{
    try{
        const result=await Transaction.updateOne({transaction_id:transaction_id},
                                                    {goal:{
                                                        goal_id:goal._id,
                                                        goal_name:goal.name
                                                    }
                                                    })
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "No matching transactions found to update." });
        }
        return res.json(result);
    }catch(err) {return res.status(500).json({ error: "An error occurred while updating the transactions." });}
        
}

export const addGoalCategory = async (req,res)=>{
    const {goal_name,user_id,price,transaction_id}=req.body   
    try{ 
        const goal = await Goal.findOne({user_id:user_id,name:goal_name})
        if (price > goal.progress) {
            return res.json("Not enough MONEY");
        }
            

        //check if the goal-category has already been declared
        const transaction=( await  Transaction.findOne({transaction_id:transaction_id}))
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }
        if (goal_name==transaction.goal.goal_name){
            //user has already spent the money from the goal to this transaction
            return res.json("The goal has already been decrared and the money has already been removed from the goal")
        }


        //goal_name!= transaction.category
        //1) The transaction doesn't have a goal as a category yet so user wants to add it
        //2) The transaction has already another goal as a category so the user want to switch it to another goal
            
        //check if the transaction has already used a goal as a category
        //Handle case 2:
        const all_goals = await Goal.find({user_id:user_id})
        for (const onegoal of all_goals){
            if (onegoal.name==transaction.goal.goal_name){
                //2)
                //the transaction _category is a goal
                //onegoal is the OLD GOAL and the money will be returned to the old goal
                // goal_name is the NEW GOAL that the user established 

                // return the money to the OLD GOAL : onegoal
                await updateGoal(onegoal, price, true,user_id);
                //remove money from the NEW GOAL:goal_name
                await updateGoal(goal,price,false,user_id)
                
                //update the transaction_category
                return updateTransaction (transaction_id,goal,res)

            }
        }

        
        //1)
        // I have to remove the money from the total savings

        await updateGoal(goal,price,false,user_id)
        const user = await User.findById(user_id)
        const savingsChange= user.savings-price;
        await User.findByIdAndUpdate(user_id,{
            savings:parseFloat(savingsChange.toFixed(1))
        },{useFindAndModify:false})

        return updateTransaction(transaction_id,goal,res)
            


    }catch(err) {
        console.log(err);
        return res.status(500).json({ error: "An error occurred while processing the request." });
   
    }
}

export const removeGoalCategory=async (req,res)=>{
    try{
        const {transaction_id,price,user_id}= req.body;
        const transaction_b= await Transaction.findOne({transaction_id:transaction_id});
        const result = await Transaction.findOneAndUpdate({transaction_id:transaction_id},{
            goal:{
                goal_id:"",
                goal_name:""
            }
        },{useFindAndModify:false})
        console.log(transaction_b.goal.goal_name)
        const goal= await Goal.findOne({user_id:user_id,name:transaction_b.goal.goal_name})
        console.log(goal.progress)
        await updateGoal(goal, price, true,user_id);
        
        const user = await User.findById(user_id)
        const savingsChange= user.savings+price;
        await User.findByIdAndUpdate(user_id,{
            savings:parseFloat(savingsChange.toFixed(1))
        },{useFindAndModify:false})


        return res.json(result)
    }catch(err) {res.json(err)}
}

export const addCategory = async (req,res)=>{
    const {category,description,user_id,transaction_id,price}=req.body
    console.log(category,description,user_id)
    try{
        const transaction=( await  Transaction.findOne({transaction_id:transaction_id}))
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        //check if the transaction has a goal as a category
        const all_goals = await Goal.find({user_id:user_id})
        for (const onegoal of all_goals){
            if (onegoal.name==transaction.category){
                
                // return the money to the OLD GOAL : onegoal
                await updateGoal(onegoal, price, true,user_id);
                              
                
                //update the transaction_category
                return updateTransaction (transaction_id,category,res)

            }
        }
     }catch(err){
        console.log(err)
        return res.status(500).json({ error: "An error occurred while updating the transactions." });
  
    }
}





