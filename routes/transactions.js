import express from "express"
const router =  express.Router();

import { insertTransactions,fetchData,addCategory,fetchTransaction} from "../controllers/transactions.js";

router.post("/insert-transactions",insertTransactions);
router.post("/fetch-data",fetchData);
router.post("/add-category",addCategory);
router.post("/fetch-transaction",fetchTransaction);


export default router;