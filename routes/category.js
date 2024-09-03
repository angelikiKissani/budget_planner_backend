import express from "express"
const router =  express.Router();

import { addNewCategory, fetchCategories} from "../controllers/categories.js"

router.post("/add-new-category",addNewCategory)
router.post("/fetch-categories",fetchCategories)

export default router;