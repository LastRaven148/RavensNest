import { API } from "../config/api";

export async function getUsers() {
  const res =
    await fetch(`${API}/users`);

  return res.json();
}

export async function getDialogs(
  username
) {
  const res =
    await fetch(
      `${API}/dialogs/${username}`
    );

  return res.json();
}

export async function getProfile(
  username
) {
  const res =
    await fetch(
      `${API}/profile/${username}`
    );

  return res.json();
}

export async function loginUser(
  username,
  password
) {
  const res = await fetch(
    `${API}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }
  );

  return res.json();
}

export async function registerUser(
  username,
  password
) {
  const res = await fetch(
    `${API}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }
  );

  return res.json();
}

export async function uploadAvatarApi(
  username,
  file
) {
  const form =
    new FormData();

  form.append(
    "avatar",
    file
  );

  form.append(
    "username",
    username
  );

  const res =
    await fetch(
      `${API}/upload-avatar`,
      {
        method: "POST",
        body: form
      }
    );

  return res.json();
}

export async function updateBioApi(
  username,
  bio
) {
  const res =
    await fetch(
      `${API}/profile/update`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          username,
          bio
        })
      }
    );

  return res.json();
}