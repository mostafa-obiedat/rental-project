import { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { X } from "lucide-react"; // أيقونة الإغلاق

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const steps = [
    { id: "1", message: "Hello! How can I assist you today? 😊", trigger: "2" },
    {
      id: "2",
      options: [
        { value: "buy", label: "🔎 Looking to buy an apartment", trigger: "3" },
        {
          value: "rent",
          label: "🏠 Looking to rent an apartment",
          trigger: "4",
        },
        { value: "support", label: "⚙️ Technical support", trigger: "5" },
      ],
    },
    { id: "3", message: "What is your budget range?", end: true },
    {
      id: "4",
      message: "Are you looking for a furnished or unfurnished apartment?",
      end: true,
    },
    {
      id: "5",
      message:
        "Please send us the details, and we will assist you immediately!",
      end: true,
    },
  ];

  const theme = {
    background: "#f0f7ff",
    fontFamily: "Arial",
    headerBgColor: "#0e7134",
    headerFontColor: "#fff",
    botBubbleColor: "#5dab79",
    botFontColor: "#fff",
    userBubbleColor: "#a4cfa7",
    userFontColor: "#fff",
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="bg-green-50">
      {/* 🤖 ChatBot Button */}
      <div
        onClick={toggleChat}
        className="fixed bottom-10 right-10 bg-green-600 p-4 rounded-full shadow-lg cursor-pointer transition duration-300 hover:bg-green-700"
      >
        <span className="text-white text-xl">🤖</span>
      </div>

      {/* 🤖 ChatBot Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-10 h-140 w-auto  rounded-lg shadow-lg z-50 flex flex-col">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center  p-2 rounded-t-lg">
            <X
              className=" text-green-600 cursor-pointer bg-white/50 rounded-lg hover:opacity-75"
              onClick={toggleChat}
            />
          </div>
          <div className="flex-grow overflow-hidden">
            <ThemeProvider theme={theme}>
              <ChatBot steps={steps} />
            </ThemeProvider>    
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;