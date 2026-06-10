export default function DialogItem({
  dialog,
  activeChat,
  openChat,
  unread,
  API
}) {

  return (

    <div
      className={
        activeChat === dialog.username
          ? "user active"
          : "user"
      }
      onClick={() =>
        openChat(
          dialog.username
        )
      }
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

      <div className="dialog-meta">

        <div className="dialog-time">

          {new Date(
            dialog.createdAt
          ).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          )}

        </div>

        {unread[
          dialog.username
        ] > 0 && (

          <div className="unread">

            {
              unread[
                dialog.username
              ]
            }

          </div>

        )}

      </div>

    </div>

  );

}