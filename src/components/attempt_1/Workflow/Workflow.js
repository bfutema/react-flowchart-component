/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useReducer, useMemo, useState, useEffect, useRef, useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'

import { v4 as uuidv4 } from 'uuid'
import { useDebouncedCallback } from 'use-debounce'
import useMouse from '@react-hook/mouse-position'
import { SyncOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'

import { General, Begin, BeginV2, End, Decision } from './Steps'
import Connections, { ConnectionToBeCreated } from './Connections'
import ToolPalette from './ToolPalette'
import ZoomControl  from './ZoomControl'
import { useDimensions, useStepConnector } from '../../hooks'
import { ArrowMarker } from './Shapes'
import { Indicator } from '../../components'

const Container = styled.div`
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
`

const Diagram = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  user-select:none;
  cursor: ${props => props.dragging ? 'grabbing' : 'grab'};

  background:
    linear-gradient(-90deg, rgba(0,0,0,.05) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px),
    linear-gradient(-90deg, rgba(0, 0, 0, .04) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px),
    linear-gradient(transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px),
    linear-gradient(-90deg, #aaa 1px, transparent 1px),
    linear-gradient(-90deg, transparent 3px, #f2f2f2 3px, #f2f2f2 78px, transparent 78px),
    linear-gradient(#aaa 1px, transparent 1px),
    #f2f2f2;
  background-size:
    4px 4px,
    4px 4px,
    80px 80px,
    80px 80px,
    80px 80px,
    80px 80px,
    80px 80px,
    80px 80px;
`

const StatusIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`

const workflowReducer = (state, { type, payload }) => {
  switch (type) {
    case 'moveStep':
      return {
        ...state,
        dirty: true,
        workflow: {
          ...state.workflow,
          steps: [
            ...state.workflow.steps.map(step => {
              if (step.id === payload.id) {
                return {
                  ...step,
                  position: payload.position
                }
              } else {
                return step
              }
            })
          ]
        }
      }
    case 'addStep':
      return {
        ...state,
        dirty: true,
        workflow: {
          ...state.workflow,
          steps: [
            ...state.workflow.steps,
            { ...payload, new: true }
          ]
        }
      }
    case 'deleteStep':
      if (payload === Object(payload)) {
        return {
          ...state,
          dirty: true,
          workflow: {
            ...state.workflow,
            steps: [
              ...state.workflow.steps.map(item => {
                if (payload.from === item.id) {
                  const itemCopy = { ...item }

                  if (itemCopy.targets) {
                    itemCopy.targets = itemCopy.targets.filter(target => target.id !== payload.to)
                    if (itemCopy.targets && itemCopy.targets.length === 0) {
                      delete itemCopy.targets
                    }
                  }

                  return itemCopy
                }

                return item
              })
            ]
          }
        }
      } else {
        return {
          ...state,
          dirty: true,
          workflow: {
            ...state.workflow,
            steps: [
              ...state.workflow.steps.filter(item => item.id !== payload)
                .map(item => {
                  const itemCopy = { ...item }

                  if (itemCopy.targets) {
                    itemCopy.targets = itemCopy.targets.filter(target => target.id !== payload)
                    if (itemCopy.targets && itemCopy.targets.length === 0) {
                      delete itemCopy.targets
                    }
                  }

                  return itemCopy
                })
            ]
          }
        }
      }
    case 'addConnection':
      return {
        ...state,
        dirty: true,
        workflow: {
          ...state.workflow,
          steps: [
            ...state.workflow.steps.map(step => {
              if (step.id === payload.from) {
                let typeTarget = state.workflow.steps.filter(s => s.id == payload.to).map(s => s.type)
                const target = {
                  id: payload.to,
                }

                if (payload.caption) {
                  target.caption = payload.caption
                }
                if(typeTarget[0] !== 'begin'){
                  return {
                    ...step,
                    targets: [
                      ...step.targets || [],
                      target
                    ]
                  }
                }else {
                  return step
                }

              } else {
                return step
              }
            })
          ]
        }
      }
    case 'init':
      return {
        workflow: payload,
        dirty: false
      }
    default:
      throw new Error(`Action ${type} is not supported`)
  }
}

const buildActions = (dispatch) => ({
  moveStep: (id, position) => dispatch({ type: 'moveStep', payload: { id, position } }),
  addStep: (type, position) => dispatch({ type: 'addStep', payload: { id: uuidv4(), type, position } }),
  deleteStep: (selectedElement) => dispatch({ type: 'deleteStep', payload: selectedElement }),
  addConnection: (from, to, caption) => dispatch({ type: 'addConnection', payload: { from, to, caption } }),
  init: (workflow) => dispatch({type: 'init', payload: workflow })
})

const stepComponents = (key = false, process = false, msg=false) =>{
  let components = {}

  if(process && process.revisions && process.revisions[0].sequential == 0) {
    components = {
      begin: { component: BeginV2, dimensions: { width: 150, height: 50, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.Begin' } },
      normal: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true },
      ar: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.AR' } },
      decision: { component: Decision, dimensions: { width: 200, height: 100, border: 3 }, maxTargets: 2, availableForPalette: true },
      epi: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.PPE' } },
      tool: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.Tool' } },
      instruction: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.Instruction' } },
      multiple_choice: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.MultipleChoice' } },
      only_choice: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.OnlyChoice' } },
      end: { component: End, dimensions: { width: 100, height: 50, border: 3 }, maxTargets: 0, availableForPalette: true }
    }
  }else{
    components = {
      begin: { component: Begin, dimensions: { width: 100, height: 50, border: 3 }, maxTargets: 1, availableForPalette: false },
      normal: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true },
      ar: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.AR' } },
      decision: { component: Decision, dimensions: { width: 200, height: 100, border: 3 }, maxTargets: 2, availableForPalette: true },
      epi: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.PPE' } },
      tool: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.Tool' } },
      instruction: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.Instruction' } },
      multiple_choice: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.MultipleChoice' } },
      only_choice: { component: General, dimensions: { width: 150, height: 75, border: 3 }, maxTargets: 1, availableForPalette: true, defaultProps: { placeholderKey: 'Workflow.OnlyChoice' } },
      end: { component: End, dimensions: { width: 100, height: 50, border: 3 }, maxTargets: 0, availableForPalette: true }
    }
  }

  return key ? components[key] : components;
}

const Step = ({ step, actions, onSelect, selected, onDelete,
  onConnectionStart, onConnectionEnd, connecting, onHoverDestination, onLeaveDestination,
  showConnectionOutlets = true, grabbing = false, readonlyDiagram = false, mouse, process = {} }) => {

  const { id, type } = step
  const stepComponent = stepComponents(type, process, 'Chamou do const <Step>')
  const theme = useContext(ThemeContext)

  if (stepComponent) {
    const Component = stepComponent.component

    return (
      <Component {...step} dimensions={stepComponent.dimensions} onMove={(newPosition) => actions.moveStep(id, newPosition)}
        onClick={readonlyDiagram ? null : onSelect}
        background={theme.workflow[type]}
        selected={selected}
        onDelete={readonlyDiagram ? null : onDelete}
        showConnectionOutlets={showConnectionOutlets}
        maxTargets={stepComponent.maxTargets}
        onConnectionStart={readonlyDiagram ? null : onConnectionStart}
        onConnectionEnd={readonlyDiagram ? null : onConnectionEnd}
        connecting={connecting}
        draggable={!readonlyDiagram}
        onHoverDestination={readonlyDiagram ? null : onHoverDestination}
        onLeaveDestination={readonlyDiagram ? null : onLeaveDestination}
        grabbing={readonlyDiagram ? false : grabbing} {...stepComponent.defaultProps}
        mouse={mouse} />
    )
  } else {
    return null
  }
}

export const Workflow = ({ onSelectStep, onChange, workflow: workflowData, status, readonlyDiagram = false ,onDeleteStep, process={} }) => {
  const diagramRef = useRef()
  const mouseRaw = useMouse(diagramRef)

  const [ref, dimensions] = useDimensions()
  const [state, dispatch] = useReducer(workflowReducer, { workflow: null, dirty: false })
  const { workflow, dirty } = state
  const actions = useMemo(() => buildActions(dispatch), [dispatch])
  const [creatingElement, setCreatingElement] = useState()
  const [selectedElement, setSelectedElement] = useState()
  const [zoom, setZoom] = useState(0)//Could be saved in the state and the api to load the same zoom factor
  const [center, setCenterOriginal] = useState({ x: 0, y: 0, init: false })
  const [dragOrigin, setDragOrigin] = useState()

  const setCenter = ({x, y}) => {
    setCenterOriginal({x, y, init: true})
  }

  const selectedElementRef = useRef()
  selectedElementRef.current = selectedElement

  const { onConnectionStart, onConnectionEnd, resetConnection, onHoverDestination, onLeaveDestination,
    connectionOrigin, connectionDestination, connecting, connectionCaption } = useStepConnector((from, to, caption) => {
      if (from && to && from !== to) {
          actions.addConnection(from, to, caption)
          resetConnection()
      } else {
        resetConnection()
      }
    })

  const onChangeDebounced = useDebouncedCallback(onChange || (() => {}), 1000)

  useEffect(_ => {
    actions.init(workflowData)
  }, [workflowData])

  useEffect(_ => {
    if (workflow && dirty) {
      onChangeDebounced.callback(workflow)
    }
  }, [workflow])

  const onSelectCallback = (origin, destination) => () => {
    if (destination) {
      setSelectedElement({ from: origin.id, to: destination.id })
    } else {
      if (!origin.new) {
        setSelectedElement(origin.id)
        onSelectStep && onSelectStep(origin)
      }
    }
  }

  const controls = {
    zoomIn: () => { setZoom( zoom + 1 ) },//use reducer
    zoomOut: () => { setZoom( zoom - 1 ) },
    resetZoom: () => { setZoom(0) }
  }

  const deleteSelected = useCallback(_ => {

    if (selectedElementRef.current) {
      actions.deleteStep(selectedElementRef.current)
      setSelectedElement(null)
      onDeleteStep && onDeleteStep()
    }

  }, [selectedElementRef, actions])

  useKeyAction('Escape', () => {
    resetConnection()
    setCreatingElement(null)
  })

  let steps = []
  let connections = []

  useEffect(_ => {
    if (!center.init && dimensions && dimensions.width && dimensions.height) {
      setCenter({x: dimensions.width/2, y: dimensions.height/2})
    }

  }, [dimensions])

  const scale = useMemo(_ => 1 + (-zoom * 0.1), [zoom])
  const bounds = useMemo(_ => {
    if (dimensions && dimensions.width && dimensions.height && center && scale) {
      let bound = {x: center.x - (dimensions.width*scale)/2, y: center.y - (dimensions.height*scale/2), width: dimensions.width*scale, height: dimensions.height*scale}
      return  bound
    }
    return null
  }, [dimensions, scale, center])

  const mouse = useMemo(_ => {
    if (mouseRaw && mouseRaw.x && mouseRaw.y) {
      return {
        x: Math.round(bounds.x + mouseRaw.x * scale),
        y: Math.round(bounds.y + mouseRaw.y * scale)
      }
    }
    return {
      x: null,
      y: null
    }
  }, [mouseRaw, scale, center])

  const creatingElementPosition = useMemo(_ => {
    if (creatingElement) {
      if (mouse.x && mouse.y) {
        return {
          x: Math.round(mouse.x - (creatingElement.dimensions.width / 2)),
          y: Math.round(mouse.y - (creatingElement.dimensions.height / 2))
        }
      }
    }
    return null
  }, [mouse, creatingElement])

  process && process.revisions && workflow && workflow.steps.forEach(step => {
    steps = [...steps,
      <Step key={`step-${step.id}`} step={step} actions={actions}
        selected={step.id === selectedElement} onSelect={onSelectCallback(step)} onDelete={ deleteSelected }
        onConnectionStart={ onConnectionStart } onConnectionEnd={ onConnectionEnd } connecting={connecting}
        onHoverDestination={onHoverDestination} onLeaveDestination={onLeaveDestination} mouse={mouse} readonlyDiagram={readonlyDiagram}
        process={process} />
    ]
    connections = [...connections,
    <Connections key={`connections-${step.id}`} workflow={workflow} origin={step} stepComponents={stepComponents(false, process, 'Chamou do component <Connections>')}
      selectedElement={selectedElement}
      onSelectCallback={readonlyDiagram ? null : onSelectCallback}
      onDelete={readonlyDiagram ? null : deleteSelected} />
    ]
  })

  const handleMouseDown = useCallback(event => {
    if(event.target === diagramRef.current){
      const mousePos = {x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }
      setDragOrigin(mousePos)
      event.stopPropagation()
    }
  }, [diagramRef])

  const handleMouseMove = useCallback(event => {
    if (dragOrigin) {
      const mousePos = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }
      const displacement = { x: dragOrigin.x - mousePos.x, y: dragOrigin.y - mousePos.y }
      setCenter({ x: Math.round(center.x + displacement.x * scale), y: Math.round(center.y + displacement.y * scale) })
    }
  }, [dragOrigin, scale])

  const handleMouseWheel = event => {
    if (event.deltaY > 0 && zoom > -8) {
      controls.zoomOut()
    } else if (event.deltaY < 0 && zoom < 8) {
      controls.zoomIn()
    }
  }

  return (
    <Container ref={ref}>
      <Diagram ref={diagramRef}
          dragging={!!dragOrigin}
          viewBox={bounds && `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
          onClick={() => setSelectedElement(null)} onMouseUp={(evt) => {
            if (creatingElement && creatingElement.type) {
              actions.addStep(creatingElement.type, creatingElementPosition)
            }
            resetConnection()
            setCreatingElement(null)
            setDragOrigin(null)
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onWheel={handleMouseWheel}
          onMouseOut={_ => setDragOrigin(null)}>
        <defs>
          <ArrowMarker id='arrow' />
          <ArrowMarker id='arrowSelected' selected />
        </defs>
        {workflow && process && process.revisions &&
          <>
            {connecting && connectionOrigin &&
              <ConnectionToBeCreated stepComponents={stepComponents(false, process, 'CHamou do <ConnectionToBeCreated>')} steps={workflow.steps}
                origin={connectionOrigin} destination={connectionDestination} diagram={ref} caption={connectionCaption} mouse={mouse}/>
            }
            {creatingElement && creatingElementPosition &&
              <Step step={{
                type: creatingElement.type,
                position: creatingElementPosition,
              }} draggable={false} showConnectionOutlets={false} grabbing readonlyDiagram={readonlyDiagram} process={process} />
            }
            {connections}
            {steps}
          </>
        }
      </Diagram>
      {
        process && process.revisions &&
        <ToolPalette position={{ x: 5, y: 5 }}
        diagramRef={diagramRef}
        tools={Object.entries(stepComponents(false, process, 'chamou do <ToolPalette>'))
          .filter(([, tool]) => tool.availableForPalette)
          .map(([key, tool]) => ({
            ...tool,
            type: key,
            defaultProps: {
              ...tool.defaultProps,
              overridePlaceholder: true
            }
          }))}
        onSelect={readonlyDiagram ? null : setCreatingElement}
        onCancel={() => setCreatingElement(null)} />
      }

      { status &&
        <StatusIndicator>
          { status === 'saving' && <Indicator renderIcon={() => <SyncOutlined style={{ fontSize: 25, opacity: 0.7 }} spin />}/> }
          { status === 'saved' && <Indicator renderIcon={() => <CheckCircleOutlined style={{ fontSize: 25, opacity: 0.7, color: 'green' }} />} /> }
          { status === 'error' && <Indicator renderIcon={() => <WarningOutlined style={{ fontSize: 25, opacity: 0.7, color: 'red' }} />} /> }
        </StatusIndicator>
      }
      <ZoomControl controls={controls} zoom={zoom} min={-8} max={8} />
    </Container>
  )
}

const useKeyAction = (targetKey, keyUpCallback) => {

  // If released key is our target key then set to false
  const upHandler = useCallback(({ key }) => {
    key === targetKey && keyUpCallback && keyUpCallback()
  }, [targetKey, keyUpCallback])

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keyup', upHandler)
    }
  }, [upHandler])

}
