const ChatSection = ({
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage,
}) => {
  return (
    <>
      <h3>Chat</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={handleSendMessage}>Send</button> <br />
    </>
  );
};

export default ChatSection;
