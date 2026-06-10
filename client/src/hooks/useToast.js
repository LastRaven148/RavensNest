import { useEffect, useRef, useState } from "react";

export default function useToast() {

  const [toast, setToast] = useState("");

  const timeoutRef = useRef(null);

  function showToast(message) {

  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  setToast(message);

  timeoutRef.current = setTimeout(() => {
    setToast("");
  }, 3000);

}

  return {
    toast,
    showToast
  };

}