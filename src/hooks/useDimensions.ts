import { useRef, useState, useEffect, useCallback } from 'react';

function getDimensions(e?: HTMLDivElement | null): DOMRect {
  if (!e) return {} as DOMRect;

  const element = e as unknown as HTMLElement;

  return element.getBoundingClientRect();
}

type IResponse = [React.MutableRefObject<HTMLDivElement | null>, DOMRect];

function useDimensions(): IResponse {
  const ref = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState(getDimensions(ref.current));

  const handleResize = useCallback(
    () => setDimensions(getDimensions(ref.current)),
    [ref],
  );

  useEffect(() => {
    if (ref.current) {
      handleResize();

      if (typeof ResizeObserver === 'function') {
        const resizeObserver = new ResizeObserver(handleResize);

        resizeObserver.observe(ref.current);

        return () => {
          resizeObserver.disconnect();
        };
      }

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return [ref, dimensions];
}

export { useDimensions };
