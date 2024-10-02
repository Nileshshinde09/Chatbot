import { findServiceId } from "./findServiceId.js";
import { processInputWithOpenAI } from "./processInputWithOpenAI.js";
// {
//   'Category ID': '1',
//   'Category Name': 'Gutters',
//   'Service ID': '100',
//   'Question Funnel': 'What type of gutters are you interested in? > K-style | What is the nature of the service? > Install'
// },

// if (!message) {
//   throw new ApiError(404, "User message not found!!");
// }

export const getNextQuestion = async (
  userId,
  userResponse,
  categoryid,
  userStates,
  credentials,
  data,
  openai
) => {
  data.map((obj) => {
    if (typeof obj["Question Funnel"] === "string") {
      obj["Question Funnel"] = obj["Question Funnel"].split("|").map((val) => {
        const [question, answer] = val.split(">").map((str) => str.trim());
        return {
          question,
          answer,
        };
      });
    }
    return obj;
  });

  if (Object.keys(userStates).length === 0 && categoryid) {
    const obj = data.find((obj) => obj["Category ID"] === String(categoryid));

    const introResponse = await processInputWithOpenAI(
      `
      greet user with a warm,friendly message. Introduce yourself as "Botly,your virtual assistant."
      "${obj["Category Name"]}"
      ---is the service category name selected by the user---.
      ||Dont explain the category name only tell the name of category to user||.
      { each time greet user diffrently }
      ---|| give small response to user , "dont ask anything" , "dont ask for further assistance" ||---
      `,
      openai
    );

    userStates[0] = {
      nextstep: 1,
      answers: [
        { category_name: obj["Category Name"], botResponse: introResponse },
      ],
    };

    return {
      botResponse: [introResponse],
      data: null,
      question_options: [],
    };
  }

  if (Object.keys(userStates).length === 0 && !categoryid) {
    let categories = new Set([]);
    data.forEach((obj) => {
      categories.add(obj["Category Name"]);
    });
    const introResponse = await processInputWithOpenAI(
      `
      greet user with a warm,friendly message. Introduce yourself as "Botly,your virtual assistant."
      "Select Category from give options"--dont give category name "the names provided with seperatly so dont mention options"---
      [ this is not for project this is for home service ]
      { each time greet user diffrently }
      ---|| give small response to user , "dont ask anything" , "dont ask for further assistance" ||---
      `,
      openai
    );
    return {
      botResponse: [introResponse],
      data: null,
      question_options: [...categories],
    };
  }
  if (userStates[0].nextstep === 1) {
    const newData = data.filter(
      (obj) => obj["Category Name"] === userStates[0].answers[0].category_name
    );
    const question_funnel_answers_option = new Set([]);
    newData.map((val) => {
      question_funnel_answers_option.add(
        val["Question Funnel"][userStates[0].answers.length - 1].answer
      );
    });

    if (!userResponse.answer) {
      const botResponse = await processInputWithOpenAI(
        `
        ${newData["0"]["Question Funnel"][userStates[0].answers.length - 1].question} || this is the question || choose option from below -- aks this only {dont} ask anything extra-- keep it 'short' {dont provide options}.
        `,
        openai
      );

      return {
        botResponse: [botResponse],
        data: null,
        question_options: [...question_funnel_answers_option],
      };
    } else {
      if (
        [...question_funnel_answers_option].filter(
          (opt) => userResponse.answer === opt
        )
      ) {
        const oldanswer = userStates[0];
        const newAnswerKey = `ans${oldanswer.answers.length}`;

        userStates[0] = {
          nextstep: 1,
          answers: [
            ...oldanswer.answers,
            { [newAnswerKey]: userResponse.answer },
          ],
        };
      }
      if (
        newData[0]["Question Funnel"].length ===
        userStates[0].answers.length - 1
      ) {
        userStates[0].nextstep = 2;
      }
      return userStates[0];
    }
  }

  // Credential section

  if (userStates[0].nextstep === 2) {
    if (!credentials.name) {
      if (userResponse.answer) {
        const getnameresponse = await processInputWithOpenAI(
          `You’re a highly specialized text extraction assistant with expertise in identifying and isolating names from various types of sentences. Your role is to recognize and extract user names accurately, regardless of whether they are embedded in a complete sentence or provided as standalone names.

Your task is to extract the user’s name from the following input. Here’s the input you might encounter:
- Input:{${userResponse.answer}}

Keep in mind that the input could be a full sentence containing a name, or it could be just the name itself. Your goal is to output just the extracted name without any additional text or context.

For example, if the input is “Hello, my name is John Doe,” your output should be “John Doe.” If the input is simply “Alice,” your output should just be “Alice.”

(--{ if user provide wrong input then return "null" keyword only , return this single word}--)
`,
          openai
        );
        if (getnameresponse !== "null") {
          credentials.name = getnameresponse;
          return {
            botResponse: [getnameresponse],
            data: null,
            question_options: [],
          };
        }
        return {
          botResponse: ["Sorry, I don't understand. Can you clarify?"],
          data: null,
          question_options: [],
        };
      } else {
        const getnameresponse = await processInputWithOpenAI(
          `
          Ask name of user || example ->{${"Can you please tell me your name?"} -- make slight change in question each time || --"dont expand question"-- }
          `,
          openai
        );

        return {
          botResponse: [getnameresponse],
          data: null,
          question_options: [],
        };
      }
    }

    if (!credentials.email) {
      if (userResponse.answer) {
        const getemailresponse = await processInputWithOpenAI(
          `You're a highly specialized text extraction assistant with expertise in identifying and isolating email addresses from various types of sentences. Your role is to recognize and extract email addresses accurately, regardless of whether they are embedded in a complete sentence or provided as standalone addresses.
Your task is to extract the user's email address from the following input. Here's the input you might encounter:
Input: {${userResponse.answer}}
Keep in mind that the input could be a full sentence containing an email address, or it could be just the email itself. Your goal is to output only the extracted email address without any additional text or context.
For example, if the input is “My email is john.doe@example.com,” your output should be “john.doe@example.com.” If the input is simply “alice@example.com,” your output should just be “alice@example.com.”
(--{ if user provide wrong input then return "null" keyword only , return this single word}--)
`,
          openai
        );
        if (getemailresponse !== "null") {
          credentials.email = getemailresponse;
          return {
            botResponse: [getemailresponse],
            data: null,
            question_options: [],
          };
        }
        return {
          botResponse: ["Sorry, I don't understand. Can you clarify?"],
          data: null,
          question_options: [],
        };
      } else {
        const getemailresponse = await processInputWithOpenAI(
          `
          Ask email of user || example ->{${"Could you please provide your email ID ?"} -- make slight change in question each time || --"dont expand question"-- }
          `,
          openai
        );
        return {
          botResponse: [getemailresponse],
          data: null,
          question_options: [],
        };
      }
    }
    if (!credentials.zip) {
      if (userResponse.answer) {
        const getzipresponse = await processInputWithOpenAI(
          `Extract the 5-digit or 9-digit (ZIP+4) zip code from the following sentence: ${userResponse.answer}."
This uses ${userResponse.answer} as the input where the zip code will be extracted.
          (--{ if user provide wrong input then return "null" keyword only , return this single word}--)
          `,
          openai
        );
        if (getzipresponse !== "null") {
          credentials.zip = getzipresponse;
          return {
            botResponse: [getzipresponse],
            data: null,
            question_options: [],
          };
        }
        return {
          botResponse: ["Sorry, I don't understand. Can you clarify?"],
          data: null,
          question_options: [],
        };
      } else {
        const getzipresponse = await processInputWithOpenAI(
          `
         Ask zip code of user || example ->{${"Could you please provide your zip code ?"} -- make slight change in question each time || --"dont expand question"-- }
          
         `,
          openai
        );

        return {
          botResponse: [getzipresponse],
          data: null,
          question_options: [],
        };
      }
    }
    if (!credentials.mob_no) {
      if (userResponse.answer) {
        const getmob_noresponse = await processInputWithOpenAI(
          `You're a highly specialized text extraction assistant with expertise in identifying and isolating mobile numbers from various types of sentences. Your role is to recognize and extract mobile numbers accurately, regardless of whether they are embedded in a complete sentence or provided as standalone numbers.

Your task is to extract the user's mobile number from the following input. Here's the input you might encounter:

Input: {${userResponse.answer}}
Keep in mind that the input could be a full sentence containing a mobile number, or it could be just the number itself. Your goal is to output only the extracted mobile number without any additional text or context.

For example, if the input is “My phone number is 9876543210,” your output should be “9876543210.” If the input is simply “9876543210,” your output should just be “9876543210.
(--{ if user provide wrong input then return "null" keyword only , return this single word}--)`,
          openai
        );
        if (getmob_noresponse !== "null") {
          credentials.mob_no = getmob_noresponse;
          return {
            botResponse: [getmob_noresponse],
            data: null,
            question_options: [],
          };
        }
        return {
          botResponse: ["Sorry, I don't understand. Can you clarify?"],
          data: null,
          question_options: [],
        };
      } else {
        const getmob_noresponse = await processInputWithOpenAI(
          `
         Ask mobile number of user || example ->{${"Could you please provide your mobile number ?"} -- make slight change in question each time || --"dont expand question"-- }
          `,
          openai
        );

        return {
          botResponse: [getmob_noresponse],
          data: null,
          question_options: [],
        };
      }
    }
    if (!credentials.address) {
      if (userResponse.answer) {
        const getaddressresponse = await processInputWithOpenAI(
          `You're a highly specialized text extraction assistant with expertise in identifying and isolating addresses from various types of sentences. Your role is to recognize and extract addresses accurately, regardless of whether they are embedded in a complete sentence or provided as standalone addresses.

Your task is to extract the user's address from the following input. Here's the input you might encounter:

Input: {${userResponse.answer}}
Keep in mind that the input could be a full sentence containing an address, or it could be just the address itself. Your goal is to output only the extracted address without any additional text or context.

For example, if the input is “My address is 123 Main St, Springfield,” your output should be “123 Main St, Springfield.” If the input is simply “456 Elm St, Apt 4B,” your output should just be “456 Elm St, Apt 4B.
(--{ if user provide wrong input then return "null" keyword only , return this single word}--)`,
          openai
        );
        if (getaddressresponse !== "null") {
          credentials.address = getaddressresponse;
          return {
            botResponse: [getaddressresponse],
            data: null,
            question_options: [],
          };
        }
        return {
          botResponse: ["Sorry, I don't understand. Can you clarify?"],
          data: null,
          question_options: [],
        };
      } else {
        const getaddressresponse = await processInputWithOpenAI(
          `
         Ask Address of user || example ->{${"Could you please provide your Address ?"} -- make slight change in question each time || --"dont expand question"-- }
          `,
          openai
        );

        return {
          botResponse: [getaddressresponse],
          data: null,
          question_options: [],
        };
      }
    }
    if (Object.values(credentials).every((value) => value !== false)) {
      return {
        botResponse: ["Check Your Credentials"],
        data: {
          service_id: 1234,
          ...credentials,
        },
        question_options: [],
      };
    }
  }

  return "Sorry, I don't understand. Can you clarify?";
};
