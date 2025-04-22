import { useState } from "react";
import { ChatMessage, ChatProps } from "../types"
import { X } from "lucide-react";

export const Chat = (props: ChatProps) => {
  const { showChat, setShowChat } = props
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const message: ChatMessage = {
      sender: "Player", // Replace with actual player name
      message: newMessage,
      timestamp: new Date(),
    };
    setChatMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>Chat</h3>
        <button className="close-button" onClick={() => setShowChat(false)}>
          <X size={16} />
        </button>
      </div>
      <div className="chat-messages">
        {chatMessages.length > 0 ? (
          chatMessages.map((msg, index) => (
            <div key={index} className="chat-message">
              <span className="message-sender">{msg.sender}:</span>
              <span className="message-content">{msg.message}</span>
            </div>
          ))
        ) : (
          <div className="empty-chat">Chưa có tin nhắn nào</div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  )
}