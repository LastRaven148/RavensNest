import { formatTime }
from "../utils/date";

export default function Message({
  message,
  username
}) {

  return (
    <div
      className={
        message.from === username
          ? "message me"
          : "message"
      }
    >
      <div className="message-text">
        {message.text}
      </div>

      <div className="message-time">
        {formatTime(
          message.createdAt
        )}
      </div>
    </div>
  );
}