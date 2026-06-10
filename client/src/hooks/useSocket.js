import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocket({
  token,
  username,
  activeChat,
  setChats,
  setUnread,
  setOnlineUsers,
  getChatId,
  updateDialog,
  socketRef,
  API
}) {

 const activeChatRef =
    useRef(null);

  useEffect(() => {

    activeChatRef.current =
      activeChat;

  }, [activeChat]);

  useEffect(() => {

    if (!token) return;

    console.log(
  "SOCKET CREATE",
  token
);

const socket = io(API, {
  auth: {
    token
  }
});

socket.on("connect", () => {
  console.log(
    "SOCKET CONNECTED",
    socket.id
  );
});

socket.on("connect_error", err => {
  console.log(
    "SOCKET ERROR",
    err.message
  );
});

    socketRef.current = socket;
console.count(
  "NEW_MESSAGE_SUBSCRIBE"
);
    socket.on(
  "newMessage",
  (msg) => {

    console.log(
      "NEW_MESSAGE_EVENT"
    );

    console.log(msg);

        const chatId = msg.chatId;

        setChats(prev => ({
          ...prev,
          [chatId]: [
            ...(prev[chatId] || []),
            msg
          ]
        }));

        if (
  msg.from !== username &&
  activeChatRef.current !== msg.from
) {
          setUnread(prev => ({
            ...prev,
            [msg.from]:
              (prev[msg.from] || 0) + 1
          }));
        }

        updateDialog(
  msg,
  username
);
      }
    );

    socket.on(
  "chatHistory",
  ({ chatId, msgs }) => {

    setChats(prev => ({
      ...prev,
      [chatId]: msgs
    }));
  }
);

    socket.on(
  "onlineUsers",
  (users) => {

    setOnlineUsers(users);

  }
);

    return () => {
      socket.disconnect();
    };

  }, [
  token,
  username
]);
}