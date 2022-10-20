/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';

const StylableTrashIcon = ({ className }: any) => (
  <svg
    className={className}
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="trash"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    data-fa-i2svg=""
  >
    <path
      fill="currentColor"
      d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
    />
  </svg>
);

const baseStyles = ({ fill, selected, highlighted }: any) => `
  fill: ${fill || 'white'};
  stroke: ${selected || highlighted ? '#064591' : 'black'};
  stroke-width: ${selected ? '5' : '2'};
  color: ${'#064591'};
`;

export const Rectangle = styled.rect.attrs<any>((props) => ({
  rx: props.rounded ? 20 : 0,
  shapeRendering: 'optimizeQuality',
}))<any>`
  ${(props) => baseStyles(props)}
`;

export const WorkflowTrashIcon = styled(StylableTrashIcon)`
  width: 12px;
  height: 14px;
  cursor: pointer;
  ${(props) => baseStyles(props)}
`;

export const Group = styled.g<any>`
  box-sizing: border-box;
  cursor: ${(props) =>
    props.dragging || props.grabbing ? 'grabbing' : 'pointer'};
  pointer-events: bounding-box;
  transform: ${(props) =>
    `translate(${props.position.x}px, ${props.position.y}px)`};
`;

export const TextContainer = styled.foreignObject<{
  anchor: any;
  textWidth: any;
  width: any;
  textHeight: any;
  height: any;
  onClick: any;
  background: any;
  isPlaceholder: any;
  selected: any;
  highlighted: any;
}>`
  box-sizing: border-box;
  ${(props) =>
    props.anchor === 'center' &&
    `transform: translate(-${(props.textWidth || props.width) / 2}px, -${
      (props.textHeight || props.height) / 2
    }px);`}
  ${(props) => props.onClick && 'cursor: pointer;'}

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: ${(props) => props.textWidth || props.width}px;
      height: ${(props) => props.textHeight || props.height}px;
      overflow: hidden;
      text-overflow: ellipsis;

      background: ${(props) => props.background || 'transparent'};
      user-select: none;
      color: ${(props) =>
        props.isPlaceholder
          ? '#aaa'
          : props.selected || props.highlighted
          ? '#064591'
          : 'black'};
    }
  }
`;

const ArrowMarkerPath = styled.path.attrs({
  d: 'M 0 0 L 10 5 L 0 10 z',
})<{ selected: any }>`
  stroke: ${(props) => (props.selected ? '#064591' : 'black')};
  fill: ${(props) => (props.selected ? '#064591' : 'black')};
`;

export const ArrowMarker = ({ id, selected = false }: any) => (
  <marker
    id={id}
    viewBox="0 0 10 10"
    refX="5"
    refY="5"
    markerWidth="4"
    markerHeight="4"
    orient="auto-start-reverse"
  >
    <ArrowMarkerPath selected={selected} />
  </marker>
);

export const Text = ({
  width,
  height,
  children,
  textWidth,
  textHeight,
  position,
  background,
  onClick,
  anchor = 'topLeft',
  selected,
  placeholder,
  overridePlaceholder,
  highlighted,
}: any) => {
  return (
    <TextContainer
      x={position && position.x}
      y={position && position.y}
      width={width}
      selected={selected}
      height={height}
      textWidth={textWidth}
      textHeight={textHeight}
      background={background}
      onClick={onClick}
      anchor={anchor}
      isPlaceholder={overridePlaceholder ? false : !children}
      highlighted={highlighted}
    >
      <div>
        <div>{children || placeholder}</div>
      </div>
    </TextContainer>
  );
};

const Polyline = styled.polyline<{ selected: any }>`
  fill: none;
  stroke: ${(props) => (props.selected ? '#064591' : 'black')};
  stroke-width: ${(props) => (props.selected ? '3' : '2')};
`;

const InvisibleRectangle = styled.rect`
  fill: none;
  pointer-events: all;
  cursor: pointer;
`;

const findPoints = (origin: any, destination: any, straight: any) => {
  if (straight || origin.x === destination.x || origin.y === destination.y) {
    return [origin, destination];
  }
  if (
    (origin.outlet === 'bottom' && destination.outlet === 'top') ||
    (origin.outlet === 'top' && destination.outlet === 'bottom')
  ) {
    const p1 = { x: origin.x, y: (origin.y + destination.y) / 2 };
    const p2 = { x: destination.x, y: (origin.y + destination.y) / 2 };
    return [origin, p1, p2, destination];
  }
  const p1 = { x: (origin.x + destination.x) / 2, y: origin.y };
  const p2 = { x: (origin.x + destination.x) / 2, y: destination.y };
  return [origin, p1, p2, destination];
};

export const Arrow = ({
  selected,
  origin,
  destination,
  onClick,
  straight = false,
}: any) => {
  const points = findPoints(origin, destination, straight);

  const rectangles = [];
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = Math.min(points[i].x, points[i + 1].x);
    const y1 = Math.min(points[i].y, points[i + 1].y);
    const x2 = Math.max(points[i].x, points[i + 1].x);
    const y2 = Math.max(points[i].y, points[i + 1].y);
    rectangles.push({
      x: x1 - 3,
      y: y1 - 3,
      width: x2 - x1 + 6,
      height: y2 - y1 + 6,
    });
  }

  return (
    <>
      <Polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        markerEnd={`url(#arrow${selected ? 'Selected' : ''})`}
        selected={selected}
      />
      {rectangles.map((rectangle) => (
        <InvisibleRectangle
          onClick={onClick}
          x={rectangle.x}
          y={rectangle.y}
          width={rectangle.width}
          height={rectangle.height}
        />
      ))}
    </>
  );
};

export const Diamond = styled.polygon.attrs<any>((props) => ({
  points: [
    `0,${props.height / 2}`,
    `${props.width / 2},0`,
    `${props.width},${props.height / 2}`,
    `${props.width / 2},${props.height}`,
  ],
}))<any>`
  ${(props) => baseStyles(props)}
`;
