import { ApiError } from "./ApiError.js";
export const processInputWithOpenAI = async (inputText, openai) => {
  try {
    if (!openai) {
      throw new ApiError(
        401,
        "Something went wrong while connecting to openai"
      );
    }
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `The user is interacting with a chatbot for home improvement services. Based on their query: "${inputText}", guide them with relevant questions, provide clear options, or answer their request accordingly.`,
        },
      ],
    });
    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return "I'm sorry, I couldn't process that. Can you please try again?";
  }
};
