import styled from 'styled-components/macro'
import { PlusOutlined, MinusOutlined, AimOutlined } from '@ant-design/icons'

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
`

const ZoomAction = styled.li`
  padding: 0 5px;
  width: 24px;
  height: 20px;
  text-align: center;
  color: ${props => props.disabled ? '#ccc' : '#333'};
  user-select: none;

  > span {
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    vertical-align: middle;
    outline: none;
  }
`

const noop = () => {}

const ZoomControl = ({ controls = {}, zoom, min, max }) => {
  return (
    <Container>
      <ZoomAction>
        <AimOutlined onClick={controls.resetZoom || noop} />
      </ZoomAction>
      <ZoomAction disabled={zoom >= max} >
        <PlusOutlined onClick={(zoom < max && controls.zoomIn) || noop} />
      </ZoomAction>
      <ZoomAction disabled={zoom <= min} >
        <MinusOutlined onClick={(zoom > min && controls.zoomOut) || noop} />
      </ZoomAction>
    </Container>
  )
}

export default ZoomControl
