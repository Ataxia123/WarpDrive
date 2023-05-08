import React, { useState } from "react";

type Metadata = {
  srcUrl: string;
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
  interplanetaryStatusReport: string;
  selectedDescription: string;
  nijiFlag: boolean;
  vFlag: boolean;
  equipment: string;
  healthAndStatus: string;
  abilities: string;
  funFact: string;

  alienMessage: string;
};
interface ChatWithCaptainProps {
  metadata: Metadata;
}

const ChatWithCaptain: React.FC<ChatWithCaptainProps> = ({ metadata }) => {
  const scanResults = metadata.abilities;
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");

  const handleUserMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch("/api/chatWithCaptain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metadata, userMessage }),
      });

      const data = await response.json();
      setChatLog([...chatLog, userMessage, data.captainResponse]);
      setUserMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="spaceship-display-screen " style={{ padding: "1.5rem", marginLeft: "-2.5%" }}>
      <div className="chat-container ">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <div key={index} className={index % 2 === 0 ? "user-message" : "captain-message"}>
              {message}
            </div>
          ))}

          <input
            type="text"
            className="prompt-input description-text spaceship-display-screen"
            value={userMessage}
            onChange={handleUserMessageChange}
            placeholder="Type your message..."
          />
        </div>
      </div>
      <button className="spaceship-button" onClick={handleSendMessage}>
        <span className="" style={{ color: "white" }}>
          Send
        </span>
      </button>
    </div>
  );
};

export default ChatWithCaptain;
