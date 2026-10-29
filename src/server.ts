
import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
  await initDB();
  
  const port = Number(config.port);
  app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main().catch((err) => {
  console.error("Error starting the server:", err);
  process.exit(1);
});
