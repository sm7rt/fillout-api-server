import express from "express";
import dotenv from "dotenv";
import { routes } from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

routes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
