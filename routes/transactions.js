import express from "express"
const router =  express.Router();

import { insertTransactions,fetchData,addCategory,fetchTransaction,receiveTransaction} from "../controllers/transactions.js";

router.post("/insert-transactions",insertTransactions);
router.get("/fetch-data",fetchData);
router.post("/add-category",addCategory);
router.post("/fetch-transaction",fetchTransaction);
router.post("/receive-transaction",receiveTransaction)


export default router;