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

export default function App() {

  const [profileMenu, setProfileMenu] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef(null);

  const [chats, setChats] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const [unread, setUnread] = useState({});
  const [
  profileUser,
  setProfileUser
] = useState(null);

  const [
  settingsOpen,
  setSettingsOpen
] = useState(false);

  const [
  toast,
  setToast
] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const toastTimeoutRef = useRef(null);

function showToast(message) {

  if (toastTimeoutRef.current) {
    clearTimeout(
      toastTimeoutRef.current
    );
  }

  setToast(message);

  toastTimeoutRef.current =
    setTimeout(() => {

      setToast("");

    }, 3000);

}

useEffect(() => {

  return () => {

    if (toastTimeoutRef.current) {

      clearTimeout(
        toastTimeoutRef.current
      );

    }

  };

}, []);

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

useEffect(() => {

  function handleEsc(e) {

    if (e.key !== "Escape") {
      return;
    }

    if (profileMenu) {
      setProfileMenu(false);
      return;
    }

    if (chat.activeChat) {
  chat.setActiveChat(null);
  return;
}

  }

  window.addEventListener(
    "keydown",
    handleEsc
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleEsc
    );
  };

}, [
  profileMenu,
  chat.activeChat
]);

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

  if (!username) {
    return;
  }

  loadDialogs(
    username
  );

  loadProfile(
    username
  );

}, [username]);

  useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [chats]);

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>RavensNest</h1>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={login}>
            Login
          </button>

          <button
            className="secondary"
            onClick={register}
          >
            Register
          </button>
        </div>
      </div>
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
  bottomRef={bottomRef}
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