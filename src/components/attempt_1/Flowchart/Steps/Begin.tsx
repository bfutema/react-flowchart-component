/* eslint-disable @typescript-eslint/no-explicit-any */
import { Draggable } from '../../Draggable/Draggable';
import { Hoverable } from '../../Hoverable/Hoverable';
import ConnectionOutlets from '../ConnectionOutlets';
import { Rectangle, Group, Text, WorkflowTrashIcon } from '../Shapes';

export const Begin = ({
  id,
  forwardRef,
  position = { x: 0, y: 0 },
  onMove,
  onDrop,
  showConnectionOutlets,
  draggable = true,
  selected,
  onDelete,
  onConnectionStart,
  targets,
  dimensions,
  maxTargets,
  connecting,
  highlightOnHover = false,
  grabbing = false,
  mouse,
}: any) => {
  return (
    <>
      <Hoverable
        render={({ hovering, onEnter, onLeave }: any) => (
          <Draggable
            position={position}
            onMove={onMove}
            disabled={!draggable}
            onDrop={onDrop}
            mouse={mouse}
          >
            <Group
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              grabbing={grabbing}
            >
              <Rectangle
                width={dimensions.width}
                height={dimensions.height}
                rounded
                ref={forwardRef}
                selected={selected}
                highlighted={highlightOnHover && hovering}
              />
              <Text
                width={dimensions.width}
                height={dimensions.height}
                selected={selected}
              >
                Workflow.Begin
              </Text>
              {showConnectionOutlets &&
                !connecting &&
                (!targets || targets.length < maxTargets) && (
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
