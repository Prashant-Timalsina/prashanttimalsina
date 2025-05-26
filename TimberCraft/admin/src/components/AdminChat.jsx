import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socket = useRef();

  const { backendUrl } = useContext(AdminContext);

  useEffect(() => {
    socket.current = io(backendUrl);

    const fetchChats = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/chat/admin/chats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setChats(response.data.chats);
        }
      } catch (error) {
        toast.error("Failed to load chats");
      }
    };

    fetchChats();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/chat/admin/chats/${selectedChat.userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.success) {
            setMessages(response.data.messages);
          }
        } catch (error) {
          toast.error("Failed to load messages");
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();

      socket.current.on(`chat:${selectedChat.userId}`, (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await axios.post(
        `${backendUrl}/api/chat/admin/send`,
        {
          userId: selectedChat.userId,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Chat List */}
      <div className="w-1/3 max-w-sm bg-white border-r shadow-sm h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {chats.map((chat) => (
            <div
              key={chat.userId}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedChat?.userId === chat.userId ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{chat.userEmail}</p>
                {!chat.isRead && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {new Date(chat.lastMessage).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col h-full">
        {selectedChat ? (
          <>
            <div className="bg-white p-4 border-b shadow-sm">
              <h2 className="text-xl font-semibold">
                {selectedChat.userEmail}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="bg-white p-4 border-t shadow-sm"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
