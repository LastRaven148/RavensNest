import { useRef } from "react";
import useOutsideClick
from "../hooks/useOutsideClick";
import DialogItem
from "./DialogItem";

export default function Sidebar({
  username,
  avatar,
  profileMenu,
  setProfileMenu,
  closeProfileMenu,
  openSettings,
  fileInputRef,
  uploadAvatar,
  logout,
  search,
  setSearch,
  dialogs,
  activeChat,
  openChat,
  unread,
  API
}) {

  const menuRef = useRef(null);

useOutsideClick(
  menuRef,
  () => {

    if (profileMenu) {
      closeProfileMenu();
    }

  }
);

  return (
    <div className="sidebar">

      <div
        className="profile"
        onClick={() =>
          setProfileMenu(!profileMenu)
        }
      >

        <div className="profile-avatar">

          {avatar ? (

            <img
              src={`${API}${avatar}`}
              alt=""
              className="avatar-image"
            />

          ) : (

            username
              .charAt(0)
              .toUpperCase()

          )}

        </div>

        <div className="profile-info">
          <div>{username}</div>
          <small>connected</small>
        </div>

      </div>

      {profileMenu && (

        <div
  className="profile-menu"
  ref={menuRef}
>

          <div
  className="menu-item"
  onClick={() => {

    openSettings();

    closeProfileMenu();

  }}
>
  Profile
</div>

           <div
  className="menu-item"
  onClick={() => {

    fileInputRef.current?.click();

  }}
>
  Change avatar
</div>

          <input
  type="file"
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={(e) => {

    uploadAvatar(e);

    closeProfileMenu();

  }}
/>

          <div
  className="menu-item danger"
  onClick={() => {

    closeProfileMenu();

    logout();

  }}
>
  Logout
</div>

        </div>

      )}

      <div className="search">

        <input
          placeholder="Search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

{dialogs.map(dialog => (

  <DialogItem
    key={dialog.username}
    dialog={dialog}
    activeChat={activeChat}
    openChat={openChat}
    unread={unread}
    API={API}
  />

))}

    </div>
  );
}