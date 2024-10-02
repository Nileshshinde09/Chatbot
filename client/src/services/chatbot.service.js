import axios from "axios";
class _ChatBot {
  handleMessages = async ({
    message = null,
    categoryid = null,
    answer = null,
  }) => {
    try {
      const res = await axios.post("/api/v1/chatbot/message", {
        message,
        categoryid,
        answer,
      });
      return res.data.data.message
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}

export const ChatBot = new _ChatBot();