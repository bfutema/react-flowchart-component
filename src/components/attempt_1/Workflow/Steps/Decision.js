import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Diamond, Group, Text, WorkflowTrashIcon } from '../Shapes'
import { Draggable, Hoverable } from '../..'
import ConnectionOutlets from '../ConnectionOutlets'

export const Decision = ({ id, forwardRef, position, onMove, onDrop, title, onClick, draggable = true,
    showConnectionOutlets, selected, onDelete, onConnectionStart, onConnectionEnd, dimensions, overridePlaceholder = false,
    maxTargets, connecting, targets, onHoverDestination, onLeaveDestination, highlightOnHover = false, grabbing = false, mouse }) => {
  const { t } = useTranslation()
  const hasYes = useMemo(_ => targets && targets.find(t => t.caption === 'yes'), [targets])
  return (
    <>
      <Hoverable onEnter={onHoverDestination && onHoverDestination(id)} onLeave={onLeaveDestination} render={({hovering, onEnter, onLeave}) => (
        <Draggable position={position} onMove={onMove} disabled={!draggable} onDrop={onDrop} onClick={onClick} mouse={mouse}>
          <Group onMouseEnter={onEnter} onMouseLeave={onLeave} onMouseUpCapture={() => onConnectionEnd && onConnectionEnd(id)} grabbing={grabbing}>
            <Diamond width={dimensions.width} height={dimensions.height} ref={forwardRef} selected={selected} highlighted={highlightOnHover && hovering} />
            <Text width={dimensions.width} height={dimensions.height} textWidth={100} textHeight={50}
                selected={selected} placeholder={t('Workflow.Decision.Placeholder')} overridePlaceholder={overridePlaceholder}
                highlighted={highlightOnHover && hovering}>
              {title}
            </Text>
            { showConnectionOutlets && ((!targets || targets.length < maxTargets) || connecting) &&
              <ConnectionOutlets dimensions={dimensions} show={ hovering }
                onConnectionStart={onConnectionStart && onConnectionStart(id, hasYes ? 'no' : 'yes')} />
            }
          </Group>
        </Draggable>
      )} />
      { selected &&
        <foreignObject
          x={ position.x + dimensions.width - 16 }
          y={ position.y + dimensions.height - 25 + 3 }
          height={20}
          width={12}
          onClick={ onDelete }>
          <WorkflowTrashIcon />
        </foreignObject>
      }
    </>
  )
}
