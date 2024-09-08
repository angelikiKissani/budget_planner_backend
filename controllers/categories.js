import Category from "../models/categories.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data=require('./categories.json');

// console.log(data)
// const importData = async () => {
//     try {
//       await Category.create(data)
//       console.log('data successfully imported')
//       // to exit the process
//       process.exit()
//     } catch (error) {
//       console.log('error', error)
//     }
//   }
//   importData()

export const addNewCategory = async (req,res) =>{
    try {
        const { name,user_id } = req.body;
      
        if (!name) {
            return res.json({
                error: "Category name is required",
            });
        }
        if (!user_id) {
            return res.json({
                error: "User_id is required",
            });
        }
        
    
        const exist = await Category.findOne({name});
        if (!exist) {
            // console.log("Category doesn't exist")
            try{
                const category = await new Category({
                    name,user_id

                }).save();
                return res.json(category)
            }catch (err) {
                console.log(err);}

        }
        else{
            // console.log("category exists")
            return (console.log("category exists"))
        }
        
    } catch (err) {
        console.log(err);
    }
    
}


export const fetchCategories = async  (req,res) =>{
    const {user_id} = req.body
    console.log(user_id)
    try{
    const result1=await Category.find({user_id:'general'});
    const result2 = await Category.find({user_id});
    const result=result1.concat(result2);
    
    return(res.json({result:result}))
    }catch(err){console.log(err)}
}
