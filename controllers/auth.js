import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import {nanoid} from "nanoid";
import { v2 as cloudinary } from 'cloudinary';


// CLOUDINARY
cloudinary.config({
    cloud_name:"demhttv9p",
    api_key:"782819135857778",
    api_secret:"ErlOQ35WxiQzooB413WlswhjHcI"

})

import { createRequire } from "module";
import { error } from "console";
const require = createRequire(import.meta.url);

// SENDGRID
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

//////////////SIGNUP/////////////
export const signup = async (req, res) => {

    console.log("Signup Hit");

    try {
        
        const { name, email, password } = req.body;

        if (!name) {
            return res.json({
                error: "Name is required",
            });
        }
        if (!email) {
            return res.json({
                error: "Email is required",
            });
        }
        if (!password) {
            return res.json({
                error: "Password is required",
            });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: "Email is taken",
            });
        }

        // hash password
        const hashedPassword = await hashPassword(password);
        try {

            const user = await new User({
                name,
                email,
                savings:0,
                password: hashedPassword,
            }).save();

            // create signed token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: "1d"});

            // console.log(user);

            const { password, ...rest } = user._doc;

            return res.json({
                token,
                user: rest,
            });

        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
};

///////////////SIGNIN/////////////
export const signin = async (req, res) => {
console.log(req.body);
    try {

        const { email, password } = req.body;

        // check for the same email in our database
        const user = await User.findOne({ email });
        
        if (!user) {
            
            return (
                res.status(404).json({ error: "No user found" })
                
            );
        }

        // check for the same password in our database
        const match = await comparePassword(password, user.password);
        
        if (!match) {
            
            // throw new Error("Wrong password")
            return (
                res.json({ error: "Wrong password" }));
        }

        // signed token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: "7d"});

        user.password = undefined;
        user.secret = undefined;
        
        res.json({
            token,
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};

//////////FORGOT PASSWORD///////////
export const forgotPassword = async (req, res) => {

    const { email } = req.body;

    // check for the same email in our database
    const user = await User.findOne({ email });
    console.log("USER ===> ", user);

    console.log(process.env.EMAIL_FROM);
    if (!user) {
        return res.json({ error: "User not found" });
    }
    // generate code
    const resetCode = nanoid(5).toUpperCase();
    // save to db
    user.resetCode = resetCode;
    user.save();
    // prepare email
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password reset code",
        html: `<h1>Your password  reset code is: ${resetCode}</h1>`
    };
    // send email
    try {
        const data = await sgMail.send(emailData);
        console.log(data);
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.json({ ok: false });
    }
};

////////////RESET PASSWORD//////////
export const resetPassword = async (req, res) => {
    try {
        const { email, password, resetCode } = req.body;

        // check for the same email in our database
        const user = await User.findOne({ email, resetCode });
        
        if (!user) {
            return res.json({ error: "Email or reset code is invalid" });
        }
        if (!password || password.length < 6) {
            return res.json({
            error: "Password is required and should be 6 characters long",
        });
        }

        // hash password
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        user.resetCode = "";
        user.save();
        return res.json({ ok: true });
    } catch (err) {
    console.log(err);
    }
};

//////////UPLOAD IMAGE//////////
export const uploadImage =async (req,res)=>{
    
    try{
        
        const result = await cloudinary.uploader.upload(req.body.image, {
            public_id:nanoid() , 
            resource_type:"image"
        });

        const user =await User.findByIdAndUpdate(
            req.body.user._id,
            {
                image:{
                    public_id:result.public_id,
                    url:result.secure_url,
                },
            },{ new: true ,
                useFindAndModify: false
            }
            
               
        );
        // if (!user) {
        //     return res.status(404).json({ error: 'User not found' });
        // }
      
        return res.json({
            _id:user._id,
            name: user.name,
            email:user.email,
            role:user.role,
            image:user.image,
            savings:user.savings,
            acounting_balance:user.acounting_balance
        })
    }catch(err){
        console.log(err);
    }
};

//////////UPDATE PASSWORD//////////
export const updatePassword = async (req,res) =>{
   try{ 
        
        const password = req.body.password;
        const hashedPassword = await hashPassword(password);
        const user =await User.findByIdAndUpdate(
            req.body.user._id,
            {
                password:hashedPassword,
            },{ new: true ,
                useFindAndModify: false
            });

            user.password=undefined;
            user.secret=undefined;
            return res.json({
                user
            })
    }catch(err) {console.log(err)}


}

///////UPDATE INFO/////////
export const updateName = async (req,res)=>{
    try{ 
        const fullName = req.body.name;
        
        const user =await User.findByIdAndUpdate(
            req.body.user._id,
            {
                name:fullName,
            },{ new: true ,
                useFindAndModify: false
            });

            return res.json({
                _id:user._id,
                name: user.name,
                email:user.email,
                role:user.role,
                image:user.image,

            })
    }catch(err) {console.log(err)}

}





