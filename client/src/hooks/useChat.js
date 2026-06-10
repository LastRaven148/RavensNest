import {
  useState,
  useMemo
} from "react";
import { getChatId } from "../utils/chat";
import { SOCKET_EVENTS } from "../constants/socketEvents";

export default function useChat({
  username,
  socketRef,
  setUnread,
  chats,
  dialogs
}) {

  const [activeChat, setActiveChat] =
    useState(null);

  const [text, setText] =
    useState("");

  function openChat(user) {

  if (activeChat === user) {
    return;
  }

  setActiveChat(user);

  setUnread(prev => ({
    ...prev,
    [user]: 0
  }));

  const socket =
    socketRef.current;

  if (!socket) return;

  const chatId =
    getChatId(
      username,
      user
    );

  socket.emit(
    SOCKET_EVENTS.JOIN_CHAT,
    chatId
  );

  socket.emit(
    SOCKET_EVENTS.GET_CHAT,
    {
      user1: username,
      user2: user
    }
  );

}

  function sendMessage() {

    if (!socketRef.current) return;

    if (!activeChat) return;

    if (!text.trim()) return;

    socketRef.current.emit(
      SOCKET_EVENTS.SEND_MESSAGE,
      {
        from: username,
        to: activeChat,
        text
      }
    );

    setText("");

  }

  function handleKey(e) {

    if (e.key === "Enter") {
      sendMessage();
    }

  }

const chatId =
  activeChat
    ? getChatId(
        username,
        activeChat
      )
    : null;

const messages =
  useMemo(() => {

    return (
      chats[chatId] || []
    );

  }, [
    chats,
    chatId
  ]);
  const activeDialog =
  dialogs?.find(
    d =>
      d.username === activeChat
  );

  return {

    activeChat,
    setActiveChat,

    text,
    setText,

    chatId,
    messages,
    activeDialog,
    openChat,
    sendMessage,
    handleKey

  };

}