/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';

function useStepConnector(onConnect: any) {
  const [from, setFrom] = useState(null);
  const [caption, setCaption] = useState(null);
  const [to, setTo] = useState(null);

  const connecting = useMemo(() => !!from, [from]);

  const resetConnection = () => {
    setFrom(null);
    setTo(null);
    setCaption(null);
  };

  const onConnectionStart = (id: any, captionProp: any) => () => {
    setFrom(id);
    setCaption(captionProp);
  };

  const onHoverDestination = (toProp: any) => () => connecting && setTo(toProp);
  const onLeaveDestination = () => setTo(null);

  const onConnectionEnd = () => {
    if (connecting) {
      onConnect(from, to, caption);
      resetConnection();
    }
  };

  return {
    onConnectionStart,
    onConnectionEnd,
    resetConnection,
    onHoverDestination,
    onLeaveDestination,
    connectionOrigin: from,
    connectionDestination: to,
    connectionCaption: caption,
    connecting,
  };
}

export { useStepConnector };
