import Message
from "./Message";

import ChatHeader
from "./ChatHeader";

export default function Chat({
  activeChat,
  activeDialog,
  onlineUsers,
  messages,
  username,
  bottomRef,
  text,
  setText,
  handleKey,
  sendMessage,
  openProfile,
  closeChat
}) {

  return (
    <div className="chat">

      {activeChat ? (
        <>
          <ChatHeader
  activeChat={activeChat}
  activeDialog={activeDialog}
  onlineUsers={onlineUsers}
  openProfile={openProfile}
/>
          <div className="messages">

            {messages.map((m) => (

  <Message
    key={m._id}
    message={m}
    username={username}
  />

))}

            <div ref={bottomRef} />

          </div>

          <div className="composer">

            <input
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              onKeyDown={handleKey}
              placeholder="Message..."
            />

            <button
              onClick={sendMessage}
            >
              Send
            </button>

          </div>
        </>
      ) : (
        <div className="empty">
          Select a chat
        </div>
      )}

    </div>
  );
}