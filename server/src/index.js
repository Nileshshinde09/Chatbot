import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});


;(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.info(
      `📑 Visit the documentation at: http://localhost:${
        process.env.PORT || 8080
      }`
    );
    console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
  });
})();



