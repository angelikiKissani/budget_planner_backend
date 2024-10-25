import User from "../models/user.js";
import Goal from "../models/goal.js"



///////ADD NEW GOAL///////
export const addGoal = async (req,res) =>{
    try {
        const { name,start_date,finish_date,goal_money,icon_name,money_per_month,icon_family,user_id } = req.body;
       
        if (!name) {
            return res.json({
                error: "Goal name is required",
            });
        }
        if (!start_date) {
            return res.json({
                error: "Start Date is required",
            });
        }
        if (!finish_date) {
            return res.json({
                error: "Money goal is required",
            });
        }
        if (!goal_money) {
            return res.json({
                error: "Goal name is required",
            });
        }
        if (!icon_name) {
            return res.json({
                error: "Icon Name is required",
            });
        }
        if (!icon_family) {
            return res.json({
                error: "Icon Family is required",
            });
        }
        if (!money_per_month) {
            return res.json({
                error: "Money per Month is required",
            });
        }
        const exist = await Goal.findOne({ user_id });
        if (!exist) {
            // console.log("user with no goals")
            try{
                const goal = await new Goal({
                    name,start_date,finish_date,goal_money,money_per_month,icon_name,icon_family,user_id

                }).save();
                return res.json(goal)
            }catch (err) {
                console.log(err);}

        }
        else{
            console.log("user has goals")
            try{
                const name_exist= await Goal.find({user_id,name})
                if(name_exist[0]==null){
                    // console.log("create new goal");
                    try{
                        const goal = await new Goal({
                            name,
                            start_date,
                            finish_date,
                            goal_money,
                            money_per_month,
                            icon_name,
                            icon_family,
                            user_id,
                            }).save();
                        return res.json(goal)
                    }catch (err) {
                        console.log(err);}
                }
                else{
                    return res.json({
                    error: "Goal name exists",
                })

                }
            }catch (err) {
                console.log(err);}
        }
        
    } catch (err) {
        console.log(err);
    }
    
}


//////////SHOW GOAL/////
export const showGoal = async (req,res) =>{
    try{
        const { user_id } = req.body;
        // console.log(user_id);
        const goals= await Goal.find({user_id})
      return( res.json(goals))

    }catch (err) {
        console.log(err);
    }

}


////////DELETE GOAL////////
export const deleteGoal = async (req,res) =>{
    try{
        const {name, user_id } = req.body;
        
        const goal= await Goal.findOne({name,user_id})
        const user = await User.findById(user_id)
        console.log(user.savings,goal.progress)
        const savingsChange=user.savings-goal.progress
        const result2=await User.findByIdAndUpdate(user_id,{
            savings:parseFloat(savingsChange.toFixed(1))
        })
        const result =await Goal.findOneAndDelete({name,user_id})
        const result3= await User.findById(user_id)
        res.json(
            {
            _id:result3._id,
            name: result3.name,
            email:result3.email,
            role:result3.role,
            image:result3.image,
            savings:result3.savings,
            accounting_balance:result3.accounting_balance
            }
        )
        

    }catch (err) {
        console.log(err);
    }

}

///////ADD MONEY TO GOAL///////
// export const addMoneyGoal = async(req,res)=>{
//     try{
//         const {name,saved_this_month,newAdd,progress,user_id } = req.body;
        
//         const result= await Goal.findOneAndUpdate({name,user_id},{
//             saved_this_month:saved_this_month,
//             progress:progress
//         },{new: true ,useFindAndModify:false})
//         const user=await User.findById(user_id)
//         const result2 =await User.findByIdAndUpdate(user_id,{
//             savings:user.savings+newAdd
//         })
//         const result3= await User.findById(user_id)
//         console.log(user)
//         res.json(
//             {
//             _id:result3._id,
//             name: result3.name,
//             email:result3.email,
//             role:result3.role,
//             image:result3.image,
//             savings:result3.savings,
//             accounting_balance:result3.accounting_balance
//             }
//         )
        

//     }catch (err) {
//         console.log(err);
//     }

// }

export const addMoneyGoal = async(req,res)=>{
    try{
        const {name,saved_this_month,newAdd,progress,user_id } = req.body;
        

        const user = await User.findById(user_id);
        
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        const currentSavings = user.savings;
        const accountingBalance = user.accounting_balance; 
        const availableBalance = parseFloat(accountingBalance - currentSavings.toFixed(1));

        if (availableBalance < newAdd) {
            console.log(`Not enough savings to add ${newAdd} EUR to the goal. Available balance: ${availableBalance} EUR`)
            return res.json({
              success: false,
              message: `Not enough savings to add ${newAdd} EUR to the goal. Available balance: ${availableBalance} EUR`,
            });
          }

        const result= await Goal.findOneAndUpdate({name,user_id},{
            saved_this_month:saved_this_month,
            progress:progress
        },{new: true ,useFindAndModify:false})
        // const user=await User.findById(user_id)
        const result2 =await User.findByIdAndUpdate(user_id,{
            savings:parseFloat((user.savings+newAdd).toFixed(1))
        })
        const result3= await User.findById(user_id)
        console.log(user)
        res.json(
            {
            _id:result3._id,
            name: result3.name,
            email:result3.email,
            role:result3.role,
            image:result3.image,
            savings:result3.savings,
            accounting_balance:result3.accounting_balance
            }
        )
        

    }catch (err) {
        console.log(err);
    }

}

////////UPDATE GOAL////////
export const updateGoal =async (req,res)=>{
    try{
        const {name_old,name_new,finish_date,goal_money,user_id,money_per_month } = req.body;
        
        const result= await Goal.findOneAndUpdate({name:name_old,user_id},{
            name:name_new,
            finish_date:finish_date,
            goal_money:goal_money,
            money_per_month:money_per_month

        },{new: true ,useFindAndModify:false})
        
        return(res.json(result))

    }catch (err) {
        console.log(err);
    }

}


export const firstOfTheMonth = async (req,res)=>{
    try{
        const {name,money_per_month,user_id} = req.body;
        
        const result= await Goal.findOneAndUpdate({name,user_id},{
            money_per_month:money_per_month,
        },{new: true ,useFindAndModify:false})
        
        return(res.json(result))

    }catch (err) {
        console.log(err);
    }

}