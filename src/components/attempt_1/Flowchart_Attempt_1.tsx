import React, { useCallback } from 'react';

import { Flowchart } from './Flowchart';

import { GlobalStyles } from '../../styles/global';

const FlowchartAttempt1: React.FC = () => {
  const process: any = {
    assets: { id: 1, name: 'example1 - igor' },
    certification_cycle: 365,
    created_by_user: { id: 103, name: 'Fernando M Oliveira' },
    id: 511,
    name: '0 - Processo - Validacao - Sequencial',
    processes_types: { id: 1, name: 'Manutenção' },
    revisions: [
      {
        compliance_check: 0,
        compliance_check_period: 0,
        created_at: new Date('2022-08-23T18:54:36.000Z'),
        created_by_user: { id: 103, name: 'Fernando M Oliveira' },
        duration: '01:01:10',
        id: 1,
        processes_status: { id: 2, name: 'Under construction' },
        sequential: 1,
        updated_at: new Date('2022-08-28T03:30:12.000Z'),
        updated_by_user: { id: 103, name: 'Fernando M Oliveira' },
      },
    ],
    updated_by_user: { id: 103, name: 'Fernando M Oliveira' },
  };

  const workflowData: any = {
    steps: [
      {
        id: '39997d5d-3932-4a2f-91cb-3d084bf5ee8a',
        position: { x: 114, y: 36 },
        targets: [{ id: '0f9e3bd7-70cb-4429-98d0-9939c743b4c1' }],
        title: '',
        type: 'begin',
      },
      {
        id: '0f9e3bd7-70cb-4429-98d0-9939c743b4c1',
        position: { x: 288, y: 23 },
        targets: [{ id: '80a41bca-38b0-4d4f-b28d-4340e27c335b' }],
        title: 'Passo 1 - Normal',
        type: 'normal',
      },
      {
        id: '80a41bca-38b0-4d4f-b28d-4340e27c335b',
        position: { x: 288, y: 174 },
        targets: [{ id: '28b3925b-86b7-42d8-bb34-d5945b8d53c0' }],
        title: 'Passo 2 - EPI',
        type: 'epi',
      },
      {
        id: '28b3925b-86b7-42d8-bb34-d5945b8d53c0',
        position: { x: 288, y: 325 },
        targets: [{ id: '5eff0a6e-d418-43d0-b222-a4d45672ce0c' }],
        title: 'Passo 3 - Tool',
        type: 'tool',
      },
      {
        id: '5eff0a6e-d418-43d0-b222-a4d45672ce0c',
        position: { x: 299, y: 469 },
        targets: [
          { id: '7b6900c7-2517-4a0c-87eb-bf06c38a6600' },
          { id: 'cdc5861c-3806-443a-9650-5ca7ccb2807c' },
        ],
        title: 'Passo 4 - Decisão',
        type: 'decision',
      },
      {
        id: '7b6900c7-2517-4a0c-87eb-bf06c38a6600',
        position: { x: 263, y: 744 },
        targets: [{ id: '8dc03ccf-dac1-4124-a413-0a221fd7ee87' }],
        title: 'Passo 5 - Sim - Uma Escolha',
        type: 'only_choice',
      },
      {
        id: 'cdc5861c-3806-443a-9650-5ca7ccb2807c',
        position: { x: 638, y: 720 },
        targets: [{ id: '8dc03ccf-dac1-4124-a413-0a221fd7ee87' }],
        title: 'Passo 6 - Sim - Múltipla Escolha',
        type: 'multiple_choice',
      },
      {
        id: '8dc03ccf-dac1-4124-a413-0a221fd7ee87',
        position: { x: 663, y: 1012 },
        targets: [],
        title: '',
        type: 'end',
      },
      {
        id: '9d067c7f-98ba-4784-8113-b4259113cd98',
        position: { x: 586, y: 90 },
        targets: [],
        title: '',
        type: 'only_choice',
      },
    ],
  };

  const onSelectStep = useCallback(() => {
    console.log('onSelectStep');
  }, []);

  const onChange = useCallback(() => {
    console.log('onChange');
  }, []);

  const onDeleteStep = useCallback(() => {
    console.log('onDeleteStep');
  }, []);

  return (
    <>
      <Flowchart
        process={process}
        workflowData={workflowData}
        readonlyDiagram={false}
        status="saved"
        onChange={onChange}
        onSelectStep={onSelectStep}
        onDeleteStep={onDeleteStep}
      />

      <GlobalStyles />
    </>
  );
};

export { FlowchartAttempt1 };
