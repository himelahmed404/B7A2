
import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
  await initDB();
  
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};

main().catch((err) => {
  console.error("Error starting the server:", err);
  process.exit(1);
});
