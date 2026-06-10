import { useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  addMessageToChat,
  incrementUnread
} from "../utils/chatState";

export default function useSocket({
  token,
  username,
  activeChat,
  setChats,
  setUnread,
  setOnlineUsers,
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

const socket = io(API, {
  auth: {
    token
  }
});

socket.on("connect_error", err => {
  console.log(
    "SOCKET ERROR",
    err.message
  );
});

    socketRef.current = socket;

    socket.on(
  "newMessage",
  (msg) => {

        setChats(prev =>
  addMessageToChat(
    prev,
    msg
  )
);

        if (
  msg.from !== username &&
  activeChatRef.current !== msg.from
) {
          setUnread(prev =>
  incrementUnread(
    prev,
    msg
  )
);
        }

        updateDialog(msg);
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