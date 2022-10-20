/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';

const useClickOutside = (ref: React.RefObject<any>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && ref.current && !ref.current.contains(event.target)) {
        if (callback) callback();
      }
    };

    document.addEventListener('mouseup', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [ref, callback]);
};

export { useClickOutside };
