import { API } from "../config/api";

export async function sendMessageApi(
  from,
  to,
  text
) {

  const res = await fetch(
    `${API}/message`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        text
      })
    }
  );

  return res.json();
}