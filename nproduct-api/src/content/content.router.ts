import express, { Request, Response } from "express";
import * as ContentService from "./content.service";


export const contentRouter = express.Router();

contentRouter.get("/", async (req: Request, res: Response) => {
    try {
        const notes = ContentService.listContent();
       
        res.status(200).send(notes);
    } catch (e) {
        res.status(500).send((e as Error).message);
    }
});

