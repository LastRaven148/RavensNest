import { useEffect, useRef, useState } from "react";
import "./App.css";
import { API } from "./config/api";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import UserProfileModal
from "./components/UserProfileModal";
import Toast
from "./components/Toast";
import SettingsModal
from "./components/SettingsModal";
import {
  getChatId
} from "./utils/chat";
import useSocket from "./hooks/useSocket";
import useProfile
from "./hooks/useProfile";
import useAuth
from "./hooks/useAuth";
import useDialogs
from "./hooks/useDialogs";
import useChat
from "./hooks/useChat";
import useToast from "./hooks/useToast";
import useUI from "./hooks/useUI";
import LoginPage
from "./components/LoginPage";
import useEsc from "./hooks/useEsc";

export default function App() {

  const {
  profileMenu,
  setProfileMenu,

  profileUser,
  setProfileUser,

  settingsOpen,
  setSettingsOpen

} = useUI();
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef(null);

  const [chats, setChats] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const [unread, setUnread] = useState({});

const {
  toast,
  showToast
} = useToast();

  const socketRef = useRef(null);

const {
  username,
  setUsername,

  password,
  setPassword,

  token,

  login,
  register,
  logout

} = useAuth({
  showToast
});

const {
  loadProfile,
  uploadAvatar,
  saveBio
} = useProfile({
  username,
  setAvatar,
  setBio,
  showToast
});

const {
  dialogs,
  search,
  setSearch,
  loadDialogs,
  updateDialog,
  filteredDialogs
} = useDialogs();

const chat = useChat({
  username,
  socketRef,
  setUnread,
  chats,
  dialogs
});
useEsc(
  profileMenu,
  setProfileMenu,
  chat.activeChat,
  chat.setActiveChat
);

  useSocket({
  token,
  username,
  activeChat: chat.activeChat,
  setChats,
  setUnread,
  setOnlineUsers,
  getChatId,
  updateDialog,
  socketRef,
  API
});

useEffect(() => {

  if (!token || !username) {
    return;
  }

  loadDialogs(username);
  loadProfile(username);

}, [token, username]);

if (!token) {

  return (

    <LoginPage
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      login={login}
      register={register}
    />

  );

}

  return (
  <div className="app">

    <Sidebar
      username={username}
      avatar={avatar}
      profileMenu={profileMenu}
      setProfileMenu={setProfileMenu}
      fileInputRef={fileInputRef}
      uploadAvatar={uploadAvatar}
      logout={() =>
  logout(socketRef)
}
      search={search}
      setSearch={setSearch}
      dialogs={filteredDialogs}
      activeChat={chat.activeChat}
      openChat={chat.openChat}
      unread={unread}
      API={API}
      closeProfileMenu={() =>
  setProfileMenu(false)
}
openSettings={() =>
  setSettingsOpen(true)
}
    />

<Chat
  activeChat={chat.activeChat}
  activeDialog={chat.activeDialog}
  onlineUsers={onlineUsers}
  messages={chat.messages}
  username={username}
  text={chat.text}
  setText={chat.setText}
  handleKey={chat.handleKey}
  sendMessage={chat.sendMessage}
  openProfile={() =>
  setProfileUser(
    chat.activeDialog
  )
}
/>
{profileUser && (

  <UserProfileModal
    user={profileUser}
    API={API}
    onClose={() =>
      setProfileUser(null)
    }
  />

)}
{settingsOpen && (

  <SettingsModal
    bio={bio}
    setBio={setBio}
    saveBio={saveBio}
    onClose={() =>
      setSettingsOpen(false)
    }
  />

)}

<Toast
  message={toast}
/>

  </div>
);

}