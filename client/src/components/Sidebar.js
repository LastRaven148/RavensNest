import { useRef } from "react";
import useOutsideClick
from "../hooks/useOutsideClick";

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

        <div
          key={dialog.username}
          className={
            activeChat === dialog.username
              ? "user active"
              : "user"
          }
          onClick={() => {

  openChat(dialog.username);

}}
        >

          <div className="avatar">

  {dialog.avatar ? (

    <img
      src={`${API}${dialog.avatar}`}
      alt=""
      className="avatar-image"
    />

  ) : (

    dialog.username
      .charAt(0)
      .toUpperCase()

  )}

</div>

          <div className="dialog-info">

            <div className="user-name">
              {dialog.username}
            </div>

            <div className="dialog-preview">
              {dialog.lastMessage}
            </div>

          </div>

          <div className="dialog-time">
            {new Date(
              dialog.createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>

          {unread[dialog.username] > 0 && (
            <div className="unread">
              {unread[dialog.username]}
            </div>
          )}

        </div>

      ))}

    </div>
  );
}