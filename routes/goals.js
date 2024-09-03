import express from "express"
const router =  express.Router();

import { addGoal,showGoal ,deleteGoal,addMoneyGoal, updateGoal,firstOfTheMonth} from "../controllers/goals.js";

router.post("/add-goal",addGoal);
router.post("/show-goal",showGoal);
router.post("/delete-goal",deleteGoal);
router.post("/add-money-goal",addMoneyGoal);
router.post("/update-goal",updateGoal);
router.post("/first_of_the_month",firstOfTheMonth)


export default router;