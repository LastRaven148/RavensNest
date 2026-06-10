import Message
from "./Message";

import ChatHeader
from "./ChatHeader";

import {
  memo,
  useEffect,
  useRef
} from "react";

const Chat = memo(function Chat({
  activeChat,
  activeDialog,
  onlineUsers,
  messages,
  username,
  text,
  setText,
  handleKey,
  sendMessage,
  openProfile,
  closeChat
}) {

  const bottomRef = useRef(null);
const textareaRef = useRef(null);
const messagesRef = useRef(null);

  useEffect(() => {

  if (
    !messages.length ||
    !messagesRef.current
  ) {
    return;
  }

  messagesRef.current.scrollTop =
    messagesRef.current.scrollHeight;

}, [messages]);

useEffect(() => {

  if (
    text === "" &&
    textareaRef.current
  ) {

    textareaRef.current.style.height =
      "48px";

  }

}, [text]);
if (
  activeChat &&
  messages.length === 0
) {
  return (
    <div className="chat">
      Loading...
    </div>
  );
}
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

          <div
  className="messages"
  ref={messagesRef}
>
          
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

            <textarea
  ref={textareaRef}
  value={text}
  onChange={(e) => {

    setText(
      e.target.value
    );

    e.target.style.height = "auto";

const newHeight =
  Math.min(
    e.target.scrollHeight,
    160
  );

e.target.style.height =
  `${newHeight}px`;

  }}
  onKeyDown={handleKey}
  placeholder="Message..."
  rows={1}
/>
          </div>
        </>
            ) : (
        <div className="empty">
          Select a chat
        </div>
      )}

    </div>
  );

});

export default Chat;