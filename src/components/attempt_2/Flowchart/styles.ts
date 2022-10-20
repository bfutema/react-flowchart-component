import styled, { css } from 'styled-components';

import { IConfig } from './types';

export const Container = styled.div`
  width: 100%;
  height: 100%;

  position: relative;

  display: flex;
`;

type IDiagramProps = IConfig;

export const Diagram = styled.svg<IDiagramProps>`
  ${({ colors }) => css`
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    user-select: none;

    background: linear-gradient(
        -90deg,
        ${colors.grid.lines} 1px,
        transparent 1px
      ),
      linear-gradient(${colors.grid.lines} 1px, transparent 1px),
      linear-gradient(-90deg, ${colors.grid.divisor} 1px, transparent 1px),
      linear-gradient(${colors.grid.divisor} 1px, transparent 1px),
      linear-gradient(
        transparent 3px,
        ${colors.grid.fill} 3px,
        ${colors.grid.fill} 78px,
        transparent 78px
      ),
      linear-gradient(-90deg, ${colors.grid.aim} 1px, transparent 1px),
      linear-gradient(
        -90deg,
        transparent 3px,
        ${colors.grid.fill} 3px,
        ${colors.grid.fill} 78px,
        transparent 78px
      ),
      linear-gradient(${colors.grid.aim} 1px, transparent 1px),
      ${colors.grid.fill};
    background-size: 4px 4px, 4px 4px, 80px 80px, 80px 80px, 80px 80px,
      80px 80px, 80px 80px, 80px 80px;
  `}
`;
