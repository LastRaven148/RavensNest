export function addMessageToChat(
  prevChats,
  msg
) {

  const chatId =
    msg.chatId;

  return {

    ...prevChats,

    [chatId]: [
      ...(prevChats[chatId] || []),
      msg
    ]

  };

}

export function incrementUnread(
  prevUnread,
  msg
) {

  return {

    ...prevUnread,

    [msg.from]:
      (prevUnread[msg.from] || 0) + 1

  };

}