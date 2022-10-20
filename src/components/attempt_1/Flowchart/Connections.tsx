/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useMemo } from 'react';

import styled from 'styled-components/macro';

import { findOutlet } from './ConnectionOutlets';
import { Arrow, Text, WorkflowTrashIcon } from './Shapes';

const ConnectionGroup = styled.g`
  font-size: 0.8em;
`;

const angle = (cx: any, cy: any, ex: any, ey: any) => {
  const dy = ey - cy;
  const dx = ex - cx;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  return theta;
};

const angle360 = ({ x: cx, y: cy }: any, { x: ex, y: ey }: any) => {
  let theta = angle(cx, cy, ex, ey); // range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
};

const findCorners = (position: any, dimensions: any) => {
  return {
    topLeft: { x: position.x, y: position.y },
    topRight: { x: position.x + dimensions.width, y: position.y },
    bottomRight: {
      x: position.x + dimensions.width,
      y: position.y + dimensions.height,
    },
    bottomLeft: { x: position.x, y: position.y + dimensions.height },
  };
};

const findConnectionOutlet = (
  position: any,
  dimensions: any,
  center: any,
  angle: any,
  isDestination = false,
) => {
  const corners = findCorners(position, dimensions);

  const angleTopLeft = angle360(center, corners.topLeft);
  const angleTopRight = angle360(center, corners.topRight);
  const angleBottomRight = angle360(center, corners.bottomRight);
  const angleBottomLeft = angle360(center, corners.bottomLeft);

  let outletName;
  if (angle >= angleBottomRight && angle < angleBottomLeft) {
    outletName = 'bottom';
  } else if (angle >= angleBottomLeft && angle < angleTopLeft) {
    outletName = 'left';
  } else if (angle >= angleTopLeft && angle < angleTopRight) {
    outletName = 'top';
  } else {
    outletName = 'right';
  }

  const outlet: any = findOutlet(dimensions, outletName);

  let offsetX = 0;
  let offsetY = 0;

  if (isDestination) {
    if (outletName === 'top') {
      offsetY = -dimensions.border;
    } else if (outletName === 'left') {
      offsetX = -dimensions.border;
    } else if (outletName === 'bottom') {
      offsetY = dimensions.border;
    } else if (outletName === 'right') {
      offsetX = dimensions.border;
    }
  }

  outlet.x = Math.round(outlet.x + position.x + offsetX);
  outlet.y = Math.round(outlet.y + position.y + offsetY);
  outlet.outlet = outletName;

  return outlet;
};

const findCenter = (position: any, dimensions: any) => ({
  x: position.x + dimensions.width / 2,
  y: position.y + dimensions.height / 2,
});

const findConnectionPoints = (
  originStep: any,
  destinationStep: any,
  stepComponents: any,
) => {
  const originComponent = stepComponents[originStep.type];
  const destinationComponent = stepComponents[destinationStep.type];

  const originCenter = findCenter(
    originStep.position,
    originComponent.dimensions,
  );
  const destinationCenter = findCenter(
    destinationStep.position,
    destinationComponent.dimensions,
  );

  const originOutlet = findConnectionOutlet(
    originStep.position,
    originComponent.dimensions,
    originCenter,
    angle360(originCenter, destinationCenter),
  );
  const destinationOutlet = findConnectionOutlet(
    destinationStep.position,
    destinationComponent.dimensions,
    destinationCenter,
    angle360(destinationCenter, originCenter),
    true,
  );

  return { origin: originOutlet, destination: destinationOutlet };
};

const isSelected = (selectedElement: any, element: any) => {
  if (selectedElement === Object(selectedElement)) {
    return (
      selectedElement.from === element.from && selectedElement.to === element.to
    );
  }

  return false;
};

const textWidth = 30;
const textHeight = 20;

const Connection = ({
  workflow,
  target,
  stepComponents,
  origin,
  selectedElement,
  onSelectCallback,
  onDelete,
}: any) => {
  const destination = useMemo(
    () => workflow.steps.find((element: any) => element.id === target.id),
    [workflow, target],
  );

  const {
    origin: originConnectionOutlet,
    destination: destinationConnectionOutlet,
  } = useMemo(
    () => findConnectionPoints(origin, destination, stepComponents),
    [origin, destination, stepComponents],
  );
  const textCoordinates = useMemo(
    () => ({
      x: (originConnectionOutlet.x + destinationConnectionOutlet.x) / 2,
      y: (originConnectionOutlet.y + destinationConnectionOutlet.y) / 2,
    }),
    [originConnectionOutlet, destinationConnectionOutlet],
  );
  const elementConnection = useMemo(
    () => ({ from: origin.id, to: target.id }),
    [origin, target],
  );
  const selected = useMemo(
    () => isSelected(selectedElement, elementConnection),
    [selectedElement, elementConnection],
  );

  const calculateTrashPosition = () => {
    if (destinationConnectionOutlet.outlet === 'bottom') {
      return {
        x: destinationConnectionOutlet.x + 6,
        y: destinationConnectionOutlet.y + 8,
      };
    }
    if (destinationConnectionOutlet.outlet === 'left') {
      return {
        x: destinationConnectionOutlet.x - 22,
        y: destinationConnectionOutlet.y - 20,
      };
    }
    return {
      x: destinationConnectionOutlet.x + 6,
      y: destinationConnectionOutlet.y - 20,
    };
  };

  const onSelect = (e: any) => {
    e.stopPropagation();
    if (onSelectCallback) onSelectCallback(origin, destination)();
  };

  return (
    <Fragment key={`connection-group-${origin.id}-${target.id}`}>
      <ConnectionGroup>
        <Arrow
          onClick={onSelect}
          caption={target.caption}
          origin={originConnectionOutlet}
          destination={destinationConnectionOutlet}
          selected={selected}
        />
        <Text
          position={{ x: textCoordinates.x, y: textCoordinates.y }}
          width={textWidth}
          height={textHeight}
          background={target.caption ? 'white' : 'transparent'}
          anchor="center"
          selected={selected}
          onClick={onSelect}
        >
          {target.caption && `Workflow.Decision.Caption.${target.caption}`}
        </Text>
      </ConnectionGroup>
      {selected && (
        <foreignObject
          x={calculateTrashPosition().x}
          y={calculateTrashPosition().y}
          height={20}
          width={12}
          onClick={onDelete}
        >
          <WorkflowTrashIcon />
        </foreignObject>
      )}
    </Fragment>
  );
};

const Connections = ({
  workflow,
  origin,
  stepComponents,
  selectedElement,
  onSelectCallback,
  onDelete,
}: any) => {
  const { id, targets } = origin;
  return (
    <>
      {targets &&
        targets.map((target: any) => (
          <Connection
            key={`connection-${id}-${target.id}`}
            workflow={workflow}
            origin={origin}
            stepComponents={stepComponents}
            selectedElement={selectedElement}
            onSelectCallback={onSelectCallback}
            onDelete={onDelete}
            target={target}
          />
        ))}
    </>
  );
};

const findConnectionToBeCreatedPoints = (
  originStep: any,
  mouse: any,
  stepComponents: any,
) => {
  const originComponent = stepComponents[originStep.type];

  const originCenter = findCenter(
    originStep.position,
    originComponent.dimensions,
  );

  const originOutlet = findConnectionOutlet(
    originStep.position,
    originComponent.dimensions,
    originCenter,
    angle360(originCenter, mouse),
  );

  return { origin: originOutlet, destination: mouse };
};

export const ConnectionToBeCreated = ({
  steps,
  origin,
  destination,
  stepComponents,
  caption,
  mouse,
}: any) => {
  const { origin: originPoint, destination: destinationPoint } =
    useMemo((): any => {
      if (origin !== destination) {
        const originStep = steps.find((step: any) => step.id === origin);
        const destinationStep =
          destination && steps.find((step: any) => step.id === destination);
        if (destinationStep) {
          return findConnectionPoints(
            originStep,
            destinationStep,
            stepComponents,
          );
        }
        if (mouse && mouse.x && mouse.y) {
          return findConnectionToBeCreatedPoints(
            originStep,
            destinationStep || { x: mouse.x - 1, y: mouse.y - 1 },
            stepComponents,
          );
        }
      }
      return {};
    }, [origin, destination, steps, mouse, stepComponents]);
  const textCoordinates = useMemo(() => {
    if (originPoint && destinationPoint) {
      return {
        x: (originPoint.x + destinationPoint.x) / 2,
        y: (originPoint.y + destinationPoint.y) / 2,
      };
    }

    return {};
  }, [originPoint, destinationPoint]);

  if (originPoint && destinationPoint) {
    return (
      <ConnectionGroup>
        <Arrow
          caption={caption}
          origin={originPoint}
          destination={destinationPoint}
          straight={!destination}
        />
        <Text
          position={{ x: textCoordinates.x, y: textCoordinates.y }}
          width={textWidth}
          height={textHeight}
          background={caption ? 'white' : 'transparent'}
          anchor="center"
        >
          {caption && `Workflow.Decision.Caption.${caption}`}
        </Text>
      </ConnectionGroup>
    );
  }
  return null;
};

export default Connections;
