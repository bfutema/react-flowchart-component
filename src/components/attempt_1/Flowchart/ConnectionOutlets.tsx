/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import styled from 'styled-components/macro';

export const findOutlets = (dimensions: any) => [
  { name: 'top', x: dimensions.width / 2, y: 0 },
  { name: 'right', x: dimensions.width, y: dimensions.height / 2 },
  { name: 'bottom', x: dimensions.width / 2, y: dimensions.height },
  { name: 'left', x: 0, y: dimensions.height / 2 },
];

export const findOutlet = (dimensions: any, name: any) =>
  findOutlets(dimensions).find((out) => out.name === name);

const Outlet = styled.circle`
  fill: white;
  stroke: #064591;
  cursor: pointer;
  &:hover {
    stroke: none;
    fill: #064591;
    opacity: 1;
  }
`;

const ConnectionOutlets = ({ dimensions, show, onConnectionStart }: any) => {
  const outlets = useMemo(() => findOutlets(dimensions), [dimensions]);

  return (
    <>
      {show &&
        outlets.map((outlet) => (
          <Outlet
            key={`outlet-${outlet.name}`}
            cx={outlet.x}
            cy={outlet.y}
            onMouseDown={(evt) => {
              evt.stopPropagation();
              if (onConnectionStart) onConnectionStart();
            }}
            onClick={(evt) => {
              evt.stopPropagation();
            }}
          />
        ))}
    </>
  );
};

export default ConnectionOutlets;
