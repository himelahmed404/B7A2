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


const app: Application = express();
const port = config.port

app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
  
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


app.use("/api/auth", userRoutes);


app.use(globalErrorHandler);

export default app;
