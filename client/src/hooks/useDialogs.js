import { useState } from "react";

import {
  getDialogs
} from "../services/api";

export default function useDialogs() {

  const [
    dialogs,
    setDialogs
  ] = useState([]);

  const [
    search,
    setSearch
  ] = useState("");

  async function loadDialogs(
    currentUser
  ) {

    try {

      const data =
        await getDialogs(
          currentUser
        );

      setDialogs(data);

    } catch (err) {

      console.error(err);

    }

  }

  function updateDialog(
  msg,
  currentUser
) {

  setDialogs(prev => {

      const dialogUser =
      msg.from === currentUser
        ? msg.to
        : msg.from;

    const existing =
      prev.find(
        dialog =>
          dialog.username === dialogUser
      );

      if (!existing) {

      return [
        {
          username: dialogUser,
          lastMessage: msg.text,
          online: false
        },
        ...prev
      ];

    }

      const updated = {
      ...existing,
      lastMessage: msg.text
    };

      return [
      updated,
      ...prev.filter(
        dialog =>
          dialog.username !== dialogUser
      )
    ];

  });

}

  const filteredDialogs =
    dialogs.filter(dialog =>
      dialog.username
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return {

    dialogs,

    search,
    setSearch,

    loadDialogs,
    updateDialog,

    filteredDialogs

  };

}