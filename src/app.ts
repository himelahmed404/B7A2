import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { IssueRoutes } from "./modules/issue/issue.route";


const app: Application = express();
const port = config.port

app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(
  cors({
    origin: config.corsOrigin.split(",").map((o) => o.trim()),
    credentials: true,
  }),
);
  
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/issues", IssueRoutes);


app.use(globalErrorHandler);

export default app;
