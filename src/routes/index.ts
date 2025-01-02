import { Router } from "express";
import tasksRouter from "./tasks";

const routes = Router();

routes.use(tasksRouter);

export default routes;
