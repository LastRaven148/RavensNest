import {
  useState,
  useEffect
}
from "react";

import {
  loginUser,
  registerUser
}
from "../services/api";

export default function useAuth({
  showToast
}) {

  const [
    username,
    setUsername
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    token,
    setToken
  ] = useState(
    localStorage.getItem("token")
    
  );

useEffect(() => {

  const savedToken =
    localStorage.getItem(
      "token"
    );

  const savedUsername =
    localStorage.getItem(
      "username"
    );

  if (
    savedToken &&
    savedUsername
  ) {

    setToken(savedToken);

    setUsername(
      savedUsername
    );

  }

}, []);

  async function login() {

  try {

    const data =
      await loginUser(
        username,
        password
      );

    if (!data.token) {

      showToast(
        data.error ||
        "Login error"
      );

      return false;

    }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "username",
        username
      );

      setToken(data.token);

      return true;

    } catch {

      showToast(
        "Server offline"
      );

      return false;

    }

  }

  async function register() {

    try {

      const data =
        await registerUser(
          username,
          password
        );

      if (data.ok) {

        showToast(
          "Account created"
        );

      } else {

        showToast(
          data.error ||
          "Registration error"
        );

      }

    } catch {

      showToast(
        "Server offline"
      );

    }

  }

  function logout(
    socketRef
  ) {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "username"
    );

    if (
      socketRef?.current
    ) {

      socketRef.current.disconnect();

    }

    setToken(null);

    setUsername("");

    setPassword("");

  }

  return {

    username,
    setUsername,

    password,
    setPassword,

    token,
    setToken,

    login,
    register,
    logout

  };

}