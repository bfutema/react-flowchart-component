import React from 'react';

import { Flowchart } from './components/attempt_2/Flowchart';

import { GlobalStyles } from './styles/global';

const App: React.FC = () => {
  return (
    <>
      <div style={{ background: '#2a2a2a', padding: '8px', display: 'flex' }}>
        <h1>PageHeader</h1>
      </div>

      <div style={{ width: '100%', height: 'calc(100% - 53px)' }}>
        <Flowchart
          config={{
            colors: {
              primary: 'red',
              // grid: { fill: '#1c1c1c', lines: '#e0e0e0' },
              grid: {
                fill: 'rgba(28, 28, 28, 1)',
                aim: 'rgba(242, 242, 242, 0.3)',
                divisor: 'rgba(242, 242, 242, 0.01)',
                lines: 'rgba(242, 242, 242, 0.03)',
              },
              // grid: {
              //   fill: 'rgba(242, 242, 242, 1)',
              //   aim: 'rgba(66, 141, 245, 1)',
              //   divisor: 'rgba(113, 89, 193, 0.1)',
              //   lines: 'rgba(204, 204, 204, 0.2)',
              // },
            },
          }}
        />
      </div>

      <GlobalStyles />
    </>
  );
};

export { App };
