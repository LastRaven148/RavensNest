export default function ProfileMenu({
  menuRef,
  openSettings,
  closeProfileMenu,
  fileInputRef,
  uploadAvatar,
  logout
}) {

  return (

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
        style={{
          display: "none"
        }}
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

  );

}