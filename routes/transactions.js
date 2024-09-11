import express from "express"
const router =  express.Router();

import { insertTransactions,fetchData,addCategory,fetchTransaction,receiceTransactions} from "../controllers/transactions.js";

router.post("/insert-transactions",insertTransactions);
router.post("/fetch-data",fetchData);
router.post("/add-category",addCategory);
router.post("/fetch-transaction",fetchTransaction);
router.post("/receive-transactions",receiceTransactions)


export default router;