import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getNextQuestion } from "../utils/nextQuestion.js";
let userStates = {};
let credentials = {
  name: false,
  email: false,
  zip: false,
  mob_no: false,
  address: false,
};
const handleMessage = asyncHandler(async (req, res) => {
  const userId = req.ip; //Used IP address to identify user
  const { message, categoryid, answer } = req.body;
  const nextQuestion = await getNextQuestion(
    userId,
    { message, answer },
    categoryid,
    userStates,
    credentials,
    req.app.get("data"),
    req.app.get("openai")
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: nextQuestion },
        "message retrived successfully!"
      )
    );
});

const handleCredentials = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, { name: "Nilesh Shinde", mobile: "9529573304" })
    );
});
export { handleMessage, handleCredentials };
