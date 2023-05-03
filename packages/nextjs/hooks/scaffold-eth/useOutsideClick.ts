import React, { useEffect } from "react";

/**
 * Check if a click was made outside the passed ref
 */
export const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: { (): void }) => {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return;
      }

      // Check if the ref exists and if the click was made outside the ref
      if (ref.current && !ref.current.contains(event.target)) {
        callback(); // Call the callback function
      }
    }

    // Add an event listener to the document object
    document.addEventListener("click", handleOutsideClick);
    // Remove the event listener when the component unmounts
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [ref, callback]);
};
