/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Draggable } from '../../Draggable/Draggable';
import { Hoverable } from '../../Hoverable/Hoverable';
import ConnectionOutlets from '../ConnectionOutlets';
import { Group, Rectangle, Text, WorkflowTrashIcon } from '../Shapes';

export const General = ({
  id,
  background,
  forwardRef,
  position,
  onMove,
  title,
  onClick,
  draggable = true,
  showConnectionOutlets,
  onDrop,
  selected,
  onDelete,
  onConnectionStart,
  onConnectionEnd,
  dimensions,
  overridePlaceholder = false,
  maxTargets,
  connecting,
  targets,
  onHoverDestination,
  onLeaveDestination,
  placeholderKey = 'Workflow.General',
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
                ref={forwardRef}
                selected={selected}
                highlighted={highlightOnHover && hovering}
              />
              <Text
                background={background}
                width={dimensions.width}
                height={dimensions.height}
                selected={selected}
                placeholder={placeholderKey}
                overridePlaceholder={overridePlaceholder}
                highlighted={highlightOnHover && hovering}
              >
                {title}
              </Text>
              {showConnectionOutlets &&
                (!targets || targets.length < maxTargets || connecting) && (
                  <ConnectionOutlets
                    dimensions={dimensions}
                    show={hovering}
                    onConnectionStart={
                      onConnectionStart && onConnectionStart(id)
                    }
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
