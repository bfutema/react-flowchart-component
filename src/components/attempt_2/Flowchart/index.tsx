import React, { useRef, useMemo, useState } from 'react';

import { useDimensions } from '../../../hooks/useDimensions';
import { IConfig } from './types';

import { Container, Diagram } from './styles';

interface IFlowchartProps {
  config: IConfig;
}

export const Flowchart: React.FC<IFlowchartProps> = ({ config }) => {
  const diagramRef = useRef<SVGSVGElement>(null);

  const [center, setCenterOriginal] = useState({ x: 0, y: 0, init: false });
  const [zoom, setZoom] = useState<number>(0);

  const [ref, dimensions] = useDimensions();

  const scale = useMemo(() => 1 + -zoom * 0.1, [zoom]);

  const bounds = useMemo(() => {
    const defaultBounds = { x: 0, y: 0, width: 0, height: 0 };

    if (!dimensions) return defaultBounds;

    if (dimensions.width && dimensions.height && center && scale) {
      const bound = {
        x: center.x - (dimensions.width * scale) / 2,
        y: center.y - (dimensions.height * scale) / 2,
        width: dimensions.width * scale,
        height: dimensions.height * scale,
      };

      return bound;
    }

    return defaultBounds;
  }, [dimensions, scale, center]);

  return (
    <Container>
      <Diagram
        ref={diagramRef}
        colors={config.colors}
        viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
      >
        <defs />
      </Diagram>
    </Container>
  );
};
