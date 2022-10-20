/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from 'react';

import { useClickOutside } from '../../../hooks/useClickOutside';

const noop = () => {};

export const Draggable = ({
  children,
  position,
  onMove,
  disabled,
  onDrop,
  onClick,
  mouse,
}: any) => {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);
  const [initialPosition, setInitialPosition] = useState(position);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onCancel = useCallback(() => {
    if (dragging) {
      setDragging(false);
      if (onMove) onMove(initialPosition);
      if (onDrop) onDrop(initialPosition);
    }
  }, [dragging, initialPosition, onDrop, onMove]);
  useClickOutside(ref, onCancel);

  const newPosition = useMemo(() => {
    if (mouse && offset && mouse.x && mouse.y) {
      return {
        x: mouse.x - offset.x,
        y: mouse.y - offset.y,
      };
    }
    return initialPosition;
  }, [mouse, initialPosition, offset]);

  const onStart = useCallback(async () => {
    await setInitialPosition(position);
    await setOffset({ x: mouse.x - position.x, y: mouse.y - position.y });
    setDragging(true);
  }, [position, mouse]);

  const onStop = useCallback(
    (evt: any) => {
      if (dragging) {
        if (
          Math.abs(initialPosition.x - newPosition.x) <= 3 &&
          Math.abs(initialPosition.y - newPosition.y) <= 3
        ) {
          if (onClick) onClick(evt);
        } else if (onDrop) onDrop(newPosition);
      }

      setDragging(false);
      setInitialPosition(newPosition);
      setOffset({ x: 0, y: 0 });
    },
    [
      dragging,
      newPosition,
      initialPosition.x,
      initialPosition.y,
      onDrop,
      onClick,
    ],
  );

  useLayoutEffect(() => {
    if (dragging) {
      if (onMove) onMove(newPosition);
    }
  }, [dragging, newPosition, onMove]);

  React.Children.only(children);
  const element = React.cloneElement(children, {
    position,
    ref,
    dragging,
    onMouseDown: disabled ? noop : onStart,
    onMouseUp: disabled ? noop : onStop,
    onClick: (e) => e.stopPropagation(),
  });
  return element;
};
