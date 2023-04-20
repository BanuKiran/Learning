import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { itemsRouter } from "./items/items.router";
import { contentRouter } from "./content/content.router";
import * as MySQLConnector from './util/mysql.connector';
import { teamsRouter } from "./teams/teams.router";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
 }
 
const PORT: number = parseInt(process.env.PORT as string, 10);
 
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/menu/items", itemsRouter);
app.use("/api/content", contentRouter);
app.use("/api/teams", teamsRouter);


MySQLConnector.init();

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });