import express from "express"
const router =  express.Router();

import { insertTransactions,fetchData,addCategory,fetchTransaction,receiveTransaction,removeGoalCategory,addGoalCategory} from "../controllers/transactions.js";

router.post("/insert-transactions",insertTransactions);
router.post("/fetch-data",fetchData);
router.post("/add-category",addCategory);
router.post("/fetch-transaction",fetchTransaction);
router.post("/receive-transaction",receiveTransaction);
router.post("/add-goal-category",addGoalCategory);
router.post("/remove-goal",removeGoalCategory);


export default router;