import { memo } from "react";

import { formatTime }
from "../utils/date";

function Message({
  message,
  username
}) {
console.log(
  "MESSAGE",
  message._id,
  message.text
);
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

export default memo(Message);