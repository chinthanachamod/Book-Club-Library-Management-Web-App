import {Router} from "express";
import {
    deleteBook, getBookIds,
    getBooks,
    getBooksById,
    // getISBN,
    saveBook,
    updateBook
} from "../controllers/book.controller";

const bookRoutes = Router()

bookRoutes.get("/", getBooks)
bookRoutes.post("/", saveBook)
// bookRoutes.get("/bookISBNs", getISBN)
bookRoutes.get("/bookIds", getBookIds)
bookRoutes.get("/:id", getBooksById)
bookRoutes.delete("/:id", deleteBook)
bookRoutes.put("/:id", updateBook)

export default bookRoutes;