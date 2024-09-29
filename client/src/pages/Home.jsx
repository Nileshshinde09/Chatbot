import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaRegWindowRestore } from "react-icons/fa6";
import { FaRegWindowMaximize } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [portabalBotWindow, setPortabalBotWindow] = useState(true);
  const [toggleBot, setToggleBot] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Cutu is best!", sender: "bot" },
        ]);
      }, 1000);
    }
  };

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
            {messages.map((message, index) => (
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
                      : "bg-black text-white rounded-b-2xl rounded-tr-2xl mr-auto"
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
