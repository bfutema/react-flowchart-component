import styled from 'styled-components/macro'
import { StyleableTrashIcon } from '../'

const baseStyles = props => (`
  fill: ${props.fill ? props.fill : 'white'};
  stroke: ${(props.selected || props.highlighted) ? props.theme.primary.color : 'black'};
  stroke-width: ${props.selected ? '5' : '2'};
  color: ${props.theme.primary.color};
`)

export const Rectangle = styled.rect.attrs(props => ({
  rx: props.rounded ? 20 : 0,
  shapeRendering: 'optimizeQuality'
}))`
  ${props => baseStyles(props)}
`

export const WorkflowTrashIcon = styled(StyleableTrashIcon)`
  width: 12px;
  height: 14px;
  cursor: pointer;
  ${props => baseStyles(props)}
`

export const Group = styled.g`
  box-sizing: border-box;
  cursor: ${props => (props.dragging || props.grabbing) ? 'grabbing' : 'pointer'};
  pointer-events: bounding-box;
  transform: ${ props => `translate(${props.position.x}px, ${props.position.y}px)` };
`

export const TextContainer = styled.foreignObject`
  box-sizing: border-box;
  ${props => props.anchor === 'center' && `transform: translate(-${(props.textWidth || props.width)/2}px, -${(props.textHeight || props.height)/2}px);`}
  ${props => props.onClick && 'cursor: pointer;'}

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
      width: ${ props => props.textWidth || props.width}px;
      height: ${ props => props.textHeight || props.height}px;
      overflow: hidden;
      text-overflow: ellipsis;

      background: ${props => props.background || 'transparent'};
      user-select: none;
      color: ${ props => props.isPlaceholder ? '#aaa' : ((props.selected || props.highlighted) ? props.theme.primary.color : 'black')};
    }
  }
`

const ArrowMarkerPath = styled.path.attrs({
  d: 'M 0 0 L 10 5 L 0 10 z'
})`
  stroke: ${props => props.selected ? props.theme.primary.color : 'black'};
  fill: ${props => props.selected ? props.theme.primary.color : 'black'};
`

export const ArrowMarker = ({ id, selected = false }) => (
  <marker id={id} viewBox='0 0 10 10' refX='5' refY='5'
      markerWidth='4' markerHeight='4'
      orient='auto-start-reverse'>
    <ArrowMarkerPath selected={selected} />
  </marker>
)

export const Text = ({ width, height, children, textWidth, textHeight, position, background, onClick, anchor = 'topLeft', selected, placeholder, overridePlaceholder, highlighted }) => {

  return (
    <TextContainer x={position && position.x} y={position && position.y} width={width} selected={selected}
        height={height} textWidth={textWidth} textHeight={textHeight} background={background} onClick={onClick}
        anchor={anchor} isPlaceholder={overridePlaceholder ? false : !children} highlighted={highlighted}>
      <div>
        <div>
          {children || placeholder}
        </div>
      </div>
    </TextContainer>
  )
}

const Polyline = styled.polyline`
  fill: none;
  stroke: ${props => props.selected ? props.theme.primary.color : 'black'};
  stroke-width: ${props => props.selected ? '3' : '2'};
`

const InvisibleRectangle = styled.rect`
  fill: none;
  pointer-events: all;
  cursor: pointer;
`

const findPoints = (origin, destination, straight) => {
  if ( straight || origin.x === destination.x || origin.y === destination.y ) {
    return [origin, destination]
  } else if ((origin.outlet === 'bottom' && destination.outlet === 'top') || (origin.outlet === 'top' && destination.outlet === 'bottom')) {
    const p1 = {x: origin.x, y: (origin.y + destination.y) / 2 }
    const p2 = {x: destination.x, y: (origin.y + destination.y) / 2 }
    return [origin, p1, p2, destination]
  } else {
    const p1 = {x: (origin.x + destination.x) / 2, y: origin.y }
    const p2 = {x: (origin.x + destination.x) / 2, y: destination.y }
    return [origin, p1, p2, destination]
  }
}

export const Arrow = ({selected, origin, destination, onClick, straight = false}) => {
  const points = findPoints(origin, destination, straight)

  let rectangles = []
  for (var i = 0; i < points.length - 1; i++){
    var x1 = Math.min(points[i].x, points[i+1].x)
    var y1 = Math.min(points[i].y, points[i+1].y)
    var x2 = Math.max(points[i].x, points[i+1].x)
    var y2 = Math.max(points[i].y, points[i+1].y)
    rectangles.push({x: x1 - 3, y: y1 - 3, width: x2 - x1 + 6, height: y2 - y1 + 6})
  }

  return (
    <>
      <Polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} markerEnd={`url(#arrow${selected ? 'Selected' : ''})`} selected={selected}/>
      {rectangles.map(rectangle =>
        <InvisibleRectangle onClick={onClick} x={rectangle.x} y={rectangle.y} width={rectangle.width} height={rectangle.height} />
      )}
    </>
  )
}

export const Diamond = styled.polygon.attrs(props => ({
  points: [`0,${props.height/2}`, `${props.width/2},0`, `${props.width},${props.height/2}`, `${props.width/2},${props.height}` ]
}))`
  ${props => baseStyles(props)}
`
