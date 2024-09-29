import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {getNextQuestion} from "../utils/nextQuestion.js"

const handleMessage = asyncHandler(async (req, res) => {
  const openai = req.get("openai");
  const userId = req.ip; //Used IP address to identify user
  const { message } = req.body;
  if (!openai) {
    throw new ApiError(401, "Something went wrong while connecting to openai");
  }
  if (!message) {
    throw new ApiError(404, "User message not found!!");
  }
  const nextQuestion = await getNextQuestion(userId, message);
});

export { handleMessage };
