
import { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'

import { useClickOutside } from '../../hooks'

const ToolList = styled.ul`
  list-style-type: none;
  padding: 5px 0;
  margin: 0;
  position: absolute;
  top: 5px;
  left: 5px;
  background: #f6f6f6;
  border: 1px solid #aaa;
  border-radius: 3px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`

const ToolItem = styled.li`
  padding: 0 5px;

  > svg > g {
    cursor: grab;
  }
`

const ToolItemContainer = styled.svg`
  width: 75px;
`

const Tool = ({ tool, onSelect }) => {
  const ToolComponent  = tool.component
  const theme = useContext(ThemeContext)

  return (
    <ToolItemContainer viewBox='0 0 95 60' onMouseDown={() => onSelect && onSelect(tool)}>
      <ToolComponent background={theme.workflow[tool.type]} position={{x: 5, y: 5}} {...tool.defaultProps} dimensions={{width: 85, height: 50}}
        highlightOnHover draggable={false} />
    </ToolItemContainer>
  )
}

const ToolPalette = ({ tools, onSelect, onCancel, diagramRef }) => {
  useClickOutside(diagramRef, onCancel)

  return (
    <ToolList>
      {tools.map(tool =>
        <ToolItem key={`${tool.type}`}>
          <Tool tool={tool} onSelect={onSelect} />
        </ToolItem>
      )}
    </ToolList>
  )
}

export default ToolPalette
