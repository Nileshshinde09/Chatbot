import { findServiceId } from "./findServiceId.js";
import { processInputWithOpenAI } from "./processInputWithOpenAI.js";

let userStates = {};

export const getNextQuestion = async (userId, currentResponse) => {
    let state = userStates[userId] || { step: 0, answers: [] };
    if (state.step === 0) {
      userStates[userId] = { step: 1, answers: [{ category: currentResponse }] };
      return "Which service category would you like to choose? Options: Gutters, Bathroom Remodeling, Home Security, etc.";
    }
    if (state.step === 1) {
      const openAIResponse = await processInputWithOpenAI(currentResponse);
      // Process OpenAI response, update user state and proceed
      userStates[userId] = {
        step: 2,
        answers: [...state.answers, { service: openAIResponse }],
      };
      return `You chose ${openAIResponse}. What specific service do you need? Options: Install, Repair, etc.`;
    }
    if (state.step === 2) {
      const serviceId = findServiceId(state.answers[0].category, currentResponse); // Custom function to find service ID from CSV
      userStates[userId] = {
        step: 3,
        serviceId,
        answers: [...state.answers, { detail: currentResponse }],
      };
      return `You've selected service ID: ${serviceId}. Please provide your personal details.`;
    }
    if (state.step === 3) {
      userStates[userId] = {
        step: 4,
        answers: [...state.answers, { personalDetails: currentResponse }],
      };
      return `Thanks! Here's a summary of your request: ${JSON.stringify(userStates[userId])}. Would you like to confirm?`;
    }
    return "Sorry, I don't understand. Can you clarify?";
  };