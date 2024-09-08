import express from "express"
const router =  express.Router();

import { signup,signin,forgotPassword,resetPassword,uploadImage,updatePassword,updateName} from "../controllers/auth.js"


router.get("/", (req, res) => {
  try{
    return res.json({data: "helloworld from the API"})
  }catch(error){
    console.log('There has been a problem with your fetch operation: ' + error.message);
    throw error;
  };
});

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword",resetPassword);
router.post("/upload-image",uploadImage);
router.post("/update-password",updatePassword);
router.post("/update-name",updateName);



export default router;