import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path : path.join(process.cwd(), '.env')
});

const config = {
    connectionString: process.env.CONNECTION_STRING as string,
    port: process.env.PORT || "5000",
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

export default config;