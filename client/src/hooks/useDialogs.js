import {
  useState,
  useCallback
} from "react";

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

const updateDialog =
  useCallback((msg) => {

    setDialogs(prev => {

      const username =
        msg.from;

      const existing =
        prev.find(
          dialog =>
            dialog.username === username
        );

      if (!existing) {
        return prev;
      }

      const updated = {
        ...existing,
        lastMessage: msg.text
      };

      return [
        updated,
        ...prev.filter(
          dialog =>
            dialog.username !== username
        )
      ];

    });

  }, []);

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