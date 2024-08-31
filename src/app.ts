import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index";

let app = express();

app.use(cors());
app.use(helmet());

routes(app);

export default app;