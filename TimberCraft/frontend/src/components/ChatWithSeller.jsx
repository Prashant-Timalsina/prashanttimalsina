import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const ChatWithSeller = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socket = useRef();
  const { token, backendUrl } = useContext(ShopContext);

  // Parse user data from token
  const userData = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = userData?.id;
  const userRole = userData?.role;

  useEffect(() => {
    // Only initialize chat if user is not an admin
    if (userRole === "admin") {
      setLoading(false);
      return;
    }

    // Initialize socket connection
    socket.current = io(backendUrl);

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/chat/user/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        // Only show error if it's not just "no messages"
        if (
          !error.response ||
          (error.response && error.response.status !== 404)
        ) {
          toast.error("Failed to load messages");
        }
        // If 404 or no messages, just set empty array
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.current.on(`chat:${userId}`, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token, userRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || userRole === "admin") return;

    try {
      await axios.post(
        `${backendUrl}/api/chat/user/send`,
        {
          userId,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show message if user is admin
  if (userRole === "admin") {
    return (
      <div className="w-full flex flex-col bg-gray-50 h-[500px] rounded-lg shadow-lg">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Chat with Seller
            </h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-gray-600 text-lg mb-4">
              Please use the admin panel to chat with users
            </p>
            <button
              onClick={() => (window.location.href = "/admin/chat")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Go to Admin Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-50 h-[500px] rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Chat with Seller
          </h2>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 py-4">
          <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            {/* Messages Container */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              id="chat-messages"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t p-4 bg-white sticky bottom-0"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithSeller;
