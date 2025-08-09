import { Router } from "express"
import {
    createReader,
    deleteReader, getReaderIds,
    // getReaderNames,
    getReaders,
    getReadersById,
    updateReader
} from "../controllers/reader.contoller";

const readerRoutes = Router()

readerRoutes.get("/", getReaders)
readerRoutes.post("/", createReader)
// readerRoutes.get("/readerNames", getReaderNames)
readerRoutes.get("/readerIds", getReaderIds)
readerRoutes.get("/:id", getReadersById)
readerRoutes.put("/:id", updateReader)
readerRoutes.delete("/:id", deleteReader)

export default readerRoutes;