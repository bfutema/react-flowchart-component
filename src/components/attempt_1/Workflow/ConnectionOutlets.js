import { useMemo } from 'react'
import styled from 'styled-components/macro'

export const findOutlets = (dimensions) => ([
  {name: 'top', x: dimensions.width / 2, y: 0 },
  {name: 'right', x: dimensions.width, y: dimensions.height / 2 },
  {name: 'bottom', x: dimensions.width / 2, y: dimensions.height },
  {name: 'left', x: 0, y: dimensions.height / 2 }
])

export const findOutlet = (dimensions, name) => findOutlets(dimensions).find(out => out.name === name)

const Outlet = styled.circle`
  r: 5px;
  fill: white;
  stroke: ${props => props.theme.primary.color};
  cursor: pointer;
  &:hover {
    stroke: none;
    fill: ${props => props.theme.primary.color};
    opacity: 1;
  }
`

const ConnectionOutlets = ({ dimensions, show, onConnectionStart }) => {
  const outlets = useMemo(_ => findOutlets(dimensions), [dimensions])

  return (
    <>
      { show && outlets.map( outlet =>
          <Outlet key={ `outlet-${outlet.name}` } cx={ outlet.x } cy={ outlet.y }
            onMouseDown={(evt) => {
              evt.stopPropagation()
              onConnectionStart && onConnectionStart()
            }}
            onClick={(evt) => {
              evt.stopPropagation()
            }}/>
      )}
    </>
  )
}

export default ConnectionOutlets
