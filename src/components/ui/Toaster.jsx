import { useEffect } from "react";

export function Toaster() {
  useEffect(() => {
    console.warn(
      "Toaster component mounted. Replace this with a real implementation if needed."
    );
  }, []);

  return null;
}
