import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaRegWindowRestore, FaRegWindowMaximize } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { ChatBot } from "@/services";

const Chatbot = () => {
  const [toggle, setToggle] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [portabalBotWindow, setPortabalBotWindow] = useState(true);
  const [toggleBot, setToggleBot] = useState(false);
  const messageEndRef = useRef(null);
  const { categoryId } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      // Add user's message to messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);

      // Call chatbot service with user input
      const res = await ChatBot.handleMessages({
        message: null,
        categoryid: categoryId || input,
        answer: input,
      });
      setToggle(!toggle);
      if (res && res.botResponse && res.botResponse[0]) {
        if (res.data) {
          setData(res.data);
        }
        // Add bot's response to messages state
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: res.botResponse[0], sender: "bot" },
        ]);
     
      }
      // Clear the input field
      setInput("");
    }
  };

  useEffect(() => {
    // if(!categoryId) return;
    (async () => {
      const res = await ChatBot.handleMessages({
        message: null,
        categoryid: categoryId,
        answer: null,
      });
      if (res) {
        if (res.data) {
          setData(res.data);
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: res.botResponse[0], sender: "bot" },
        ]);
        if (res?.question_options.length) {
          res.question_options.map((msg) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: (
                  <Button
                    value={msg}
                    onClick={(e) => {
                      setInput(e.target.value);
                    }}
                  >
                    {msg}
                  </Button>
                ),
                sender: "bot",
              },
            ]);
          });
         
        }
      }
    })();
  }, [categoryId, toggle]);

  return (
    <div
      className={`h-screen w-full bg-transparent flex flex-col justify-center items-center ${
        portabalBotWindow ? "sm:items-end sm:justify-end" : ""
      } p-4`}
    >
      {toggleBot && (
        <div className="transition-all z-50 relative w-full max-w-md h-4/5 border-2 border-zinc-700 bg-[#171717] shadow-lg rounded-3xl overflow-hidden">
          <RxCross2
            className="absolute m-4 cursor-pointer text-white"
            onClick={() => setToggleBot(false)}
          />
          <div className="absolute bottom-2 w-full px-4 max-w-md mt-2 flex items-center space-x-2 no-scrollbar">
            {portabalBotWindow ? (
              <FaRegWindowMaximize
                onClick={() => setPortabalBotWindow(!portabalBotWindow)}
                className="cursor-pointer text-white w-6 h-6 max-sm:hidden"
              />
            ) : (
              <FaRegWindowRestore
                onClick={() => setPortabalBotWindow(!portabalBotWindow)}
                className="cursor-pointer text-white w-6 h-6 max-sm:hidden"
              />
            )}
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="text-white flex-grow rounded-md bg-[#070707]"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <IoSend
              onClick={handleSendMessage}
              className="w-8 h-8 cursor-pointer text-white hover:scale-105 transition-all"
            />
          </div>
          <div className="h-full w-full p-4 pb-16 overflow-y-auto no-scrollbar space-y-3">
            {data&&
              (<form className="mx-2 ">
                <div className="grid gap-2 text-center ">
                  <h1 className="text-3xl font-bold text-white">Sign Up</h1>
                </div>
                <div className="grid gap-4 text-black dark:text-white">
                  <div className="grid gap-2">
                    <label
                      htmlFor="fullName"
                      className="text-white"
                    >
                      Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={data ? data.name : ""}
                      placeholder="John D'Souza"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="email"
                      className="text-white"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={data ? data.email : ""}
                      name="email"
                      placeholder="m@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="username"
                      className="text-white"
                    >
                      Mobile No.
                    </label>
                    <input
                      id="username"
                      type="number"
                      value={data ? data.mob_no : ""}
                      name="username"
                      placeholder="Striver"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="username"
                      className="text-white"
                    >
                      Zip Code
                    </label>
                    <input
                      id="username"
                      type="number"
                      value={data ? data.zip : ""}
                      name="username"
                      placeholder="Striver"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="fullName"
                      className="text-white"
                    >
                      Address
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={data ? data.address : ""}
                      placeholder="John D'Souza"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </div>
              </form>)
            }

            {!data&&messages.map((message, index) => (
              <div
                key={index}
                className={`flex space-x-2 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender !== "user" && (
                  <img
                    src="chatbot.png"
                    alt="Chatbot Avatar"
                    className="border-2 border-zinc-700 w-10 h-10 rounded-full hover:scale-110 transition-all cursor-pointer"
                  />
                )}
                <div
                  className={`py-2 px-3 max-w-[65%] w-fit ${
                    message.sender === "user"
                      ? "bg-white text-black rounded-b-2xl rounded-tl-2xl ml-auto"
                      : "bg-slate-700 text-white rounded-b-2xl rounded-tr-2xl mr-auto"
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === "user" && (
                  <img
                    src="profile.png"
                    alt="User Avatar"
                    className="border-2 border-zinc-700 w-10 h-10 rounded-full"
                  />
                )}
              </div>
            ))}
            <div ref={messageEndRef} className="my-1 w-full" />
          </div>
        </div>
      )}
      <img
        src="chatbot.png"
        alt="Chatbot Icon"
        onClick={() => setToggleBot(!toggleBot)}
        className="z-10 absolute bottom-4 right-4 border-2 border-zinc-700 w-16 h-16 rounded-full hover:scale-110 transition-all cursor-pointer"
      />
    </div>
  );
};

export default Chatbot;
