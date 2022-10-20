/* eslint-disable @typescript-eslint/no-explicit-any */
import { Draggable } from '../../Draggable/Draggable';
import { Hoverable } from '../../Hoverable/Hoverable';
import ConnectionOutlets from '../ConnectionOutlets';
import { Rectangle, Group, Text, WorkflowTrashIcon } from '../Shapes';

export const End = ({
  id,
  forwardRef,
  position,
  onMove,
  onClick,
  draggable = true,
  showConnectionOutlets,
  onDrop,
  selected,
  onDelete,
  onConnectionStart,
  onConnectionEnd,
  dimensions,
  connecting,
  onHoverDestination,
  onLeaveDestination,
  highlightOnHover = false,
  grabbing = false,
  mouse,
}: any) => {
  return (
    <>
      <Hoverable
        onEnter={onHoverDestination && onHoverDestination(id)}
        onLeave={onLeaveDestination}
        render={({ hovering, onEnter, onLeave }: any) => (
          <Draggable
            position={position}
            onMove={onMove}
            disabled={!draggable}
            onDrop={onDrop}
            onClick={onClick}
            mouse={mouse}
          >
            <Group
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              onMouseUpCapture={() => onConnectionEnd && onConnectionEnd(id)}
              grabbing={grabbing}
            >
              <Rectangle
                width={dimensions.width}
                height={dimensions.height}
                rounded
                ref={forwardRef}
                selected={selected}
                highlighted={highlightOnHover && hovering}
                fill="#EEDDDD"
              />
              <Text
                width={dimensions.width}
                height={dimensions.height}
                selected={selected}
                highlighted={highlightOnHover && hovering}
              >
                Workflow.End
              </Text>
              {showConnectionOutlets && connecting && (
                <ConnectionOutlets
                  dimensions={dimensions}
                  show={hovering}
                  onConnectionStart={onConnectionStart && onConnectionStart(id)}
                />
              )}
            </Group>
          </Draggable>
        )}
      />
      {selected && (
        <foreignObject
          x={position.x + dimensions.width + 6}
          y={position.y + dimensions.height - 14}
          height={20}
          width={12}
          onClick={onDelete}
        >
          <WorkflowTrashIcon />
        </foreignObject>
      )}
    </>
  );
};
