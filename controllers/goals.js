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
        
        const result= await Goal.findOneAndDelete({name,user_id})
      return( res.json(result))

    }catch (err) {
        console.log(err);
    }

}

///////ADD MONEY TO GOAL///////
export const addMoneyGoal = async(req,res)=>{
    try{
        const {name,saved_this_month,progress,user_id } = req.body;
        
        const result= await Goal.findOneAndUpdate({name,user_id},{
            saved_this_month:saved_this_month,
            progress:progress
        },{new: true ,useFindAndModify:false})
        res.json(result)
        

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