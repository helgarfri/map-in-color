import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export default function useUnsavedChangesPrompt(when, onBlocked) {
  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker?.state === "blocked") {
      onBlocked?.(blocker);
    }
  }, [blocker, onBlocked]);

  return blocker;
}
