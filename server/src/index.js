import dotenv from "dotenv";
import { app } from "./app.js";
import connectOpenAI from "./OpenAi/index.js";

dotenv.config({
  path: "./.env",
});

const startServer = (app) => {
  app.listen(process.env.PORT || 8000, () => {
    console.info(
      `📑 Visit the documentation at: http://localhost:${
        process.env.PORT || 8000
      }`
    );
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
  });
};
connectOpenAI(app)
  .then((app) => {
    startServer(app);
  })
  .catch((err) => {
    console.log("OpenAi connect error: ", err);
  });
