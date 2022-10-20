/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */

import styled from 'styled-components/macro';

import { useClickOutside } from '../../../hooks/useClickOutside';

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
`;

const ToolItem = styled.li`
  padding: 0 5px;

  > svg > g {
    cursor: grab;
  }
`;

const ToolItemContainer = styled.svg`
  width: 75px;
`;

const Tool = ({ tool, onSelect }: any) => {
  const ToolComponent = tool.component;
  const theme: any = {
    workflow: {
      ar: '#cfbaff',
      normal: '#EBF4FA',
      epi: '#F3E5AB',
      tool: '#7FFFD4',
      instruction: '#FBBBB9',
      multiple_choice: '#C3FDB8',
      only_choice: '#CFFFBA',
    },
  };

  return (
    <ToolItemContainer
      viewBox="0 0 95 60"
      onMouseDown={() => onSelect && onSelect(tool)}
    >
      <ToolComponent
        background={theme.workflow[tool.type]}
        position={{ x: 5, y: 5 }}
        {...tool.defaultProps}
        dimensions={{ width: 85, height: 50 }}
        highlightOnHover
        draggable={false}
      />
    </ToolItemContainer>
  );
};

const ToolPalette = ({ tools, onSelect, onCancel, diagramRef }: any) => {
  useClickOutside(diagramRef, onCancel);

  return (
    <ToolList>
      {tools.map((tool: any) => (
        <ToolItem key={`${tool.type}`}>
          <Tool tool={tool} onSelect={onSelect} />
        </ToolItem>
      ))}
    </ToolList>
  );
};

export default ToolPalette;
