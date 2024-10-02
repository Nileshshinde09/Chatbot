import dotenv from "dotenv";
import { app } from "./app.js";
import connectOpenAI from "./OpenAi/index.js";
import { readCSVFile } from "./utils/fileReader.js";

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
(async () => {
  try {
    const data = await readCSVFile(
      "./db/corrected_final_home_improvement_services.csv"
    );
    app.set("data",data)
  } catch (err) {
    console.error("Error reading CSV file:", err);
  }
})();


// readCSVFile("./db/corrected_final_home_improvement_services.csv")
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.error("Error reading CSV file:", err);
//   });

connectOpenAI(app)
  .then((app) => {
    startServer(app);
  })
  .catch((err) => {
    console.log("OpenAi connect error: ", err);
  });
