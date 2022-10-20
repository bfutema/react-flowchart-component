/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export const Hoverable = ({
  render,
  onEnter: onEnterOriginal,
  onLeave: onLeaveOriginal,
}: any) => {
  const [hovering, setHovering] = useState(false);

  const onEnter = () => {
    setHovering(true);
    if (onEnterOriginal) onEnterOriginal();
  };
  const onLeave = () => {
    setHovering(false);
    if (onLeaveOriginal) onLeaveOriginal();
  };

  return render({ hovering, onEnter, onLeave });
};
