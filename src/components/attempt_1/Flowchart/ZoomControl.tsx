/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { FiCrosshair, FiMinus, FiPlus } from 'react-icons/fi';

import styled from 'styled-components/macro';

const Container = styled.ul`
  list-style-type: none;
  padding: 5px 0;
  margin: 0;
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #f6f6f6;
  border: 1px solid #aaa;
  border-radius: 3px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  user-select: none;
`;

const ZoomAction = styled.li<any>`
  padding: 0 5px;
  width: 24px;
  height: 20px;
  text-align: center;
  color: ${(props) => (props.disabled ? '#ccc' : '#333')};
  user-select: none;

  > span {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    vertical-align: middle;
    outline: none;
  }
`;

const noop = () => {};

const ZoomControl = ({ controls = {}, zoom, min, max }: any) => {
  return (
    <Container>
      <ZoomAction>
        <FiCrosshair onClick={controls.resetZoom || noop} size={14} />
      </ZoomAction>
      <ZoomAction disabled={zoom >= max}>
        <FiPlus onClick={(zoom < max && controls.zoomIn) || noop} size={14} />
      </ZoomAction>
      <ZoomAction disabled={zoom <= min}>
        <FiMinus onClick={(zoom > min && controls.zoomOut) || noop} size={14} />
      </ZoomAction>
    </Container>
  );
};

export default ZoomControl;
