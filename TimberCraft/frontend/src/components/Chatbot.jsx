import React, { useState } from "react";
import axios from "axios";
import { AiFillAlert, AiOutlineClose } from "react-icons/ai";
// Replace with your image

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:4000/api/chat", {
        message: input,
      });

      const botMessage = { text: res.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot API error:", error);
    }
  };

  return (
    <div className="w-[350px] h-[500px] flex flex-col shadow-xl rounded-xl bg-white overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 text-white flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <AiFillAlert size={35} />
          <h2 className="text-lg font-semibold">ChatBot</h2>
        </div>
        <button onClick={onClose}>
          <AiOutlineClose size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-gray-100 p-3 overflow-y-auto space-y-2 text-sm">
        {messages.length === 0 && (
          <div className="bg-green-100 p-3 rounded-lg">
            Great to see you here! <br />
            What information are you looking for? Ask me anything about
            TimberCraft ✨
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-100 ml-auto text-right"
                : "bg-green-100 mr-auto text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center p-2 border-t bg-white gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Write a message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
