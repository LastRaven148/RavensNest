import { useState } from "react";

import {
  getDialogs
}
from "../services/api";

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

    filteredDialogs

  };

}