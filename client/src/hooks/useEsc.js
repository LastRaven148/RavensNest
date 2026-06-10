import { useEffect } from "react";

export default function useEsc(
  profileMenu,
  setProfileMenu,
  activeChat,
  setActiveChat
) {

  useEffect(() => {

    function handleEsc(e) {

      if (e.key !== "Escape") {
        return;
      }

      if (profileMenu) {

        setProfileMenu(false);

        return;

      }

      if (activeChat) {

        setActiveChat(null);

      }

    }

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleEsc
      );

    };

  }, [
    profileMenu,
    activeChat
  ]);

}