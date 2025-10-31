import "dotenv/config";
import app from "./index";
import { config } from "dotenv";

config();
const port = Number(process.env.PORT || 8000);

const server = app.listen(port, () => {
  console.info(`Application started @ http://localhost:${port}`);
});

// Optional: export server for manual shutdown if needed
export default server;
