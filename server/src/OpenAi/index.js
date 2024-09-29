import OpenAI from "openai";
import { OPENAI_API_KEY } from "../constants.js";

const connectOpenAI = async (app) => {
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    app.set("openai", openai);
    return app;
  } catch (error) {
    console.log("Open Ai connection FAILED ", error);
    process.exit(1);
  }
};

export default connectOpenAI;
