export default function ChatHeader({
  activeChat,
  activeDialog,
  onlineUsers,
  openProfile,
  closeChat
}) {

  return (
    <div
  className="chat-header"
  onClick={openProfile}
>
      <div className="chat-avatar">

  {activeDialog?.avatar ? (

    <img
      src={`http://localhost:3001${activeDialog.avatar}`}
      alt=""
      className="avatar-image"
    />

  ) : (

    activeChat?.charAt(0).toUpperCase()

  )}

</div>

      <div>

        <div className="chat-name">
          {activeChat}
        </div>

        <div className="chat-status">
  {onlineUsers.includes(activeChat)
    ? "online"
    : "offline"}
</div>

      </div>

    </div>
  );
}