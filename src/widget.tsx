import { ReactWidget } from '@jupyterlab/apputils';

import React, { useState } from 'react';

const addJupyterNotebook = () => {
  console.log('adding a notebook');

};

/**
 * React component for a counter.
 *
 * @returns The React component
 */
const CounterComponent = (): JSX.Element => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <p>You clicked {counter} times!</p>
      <button
        onClick={(): void => {
          setCounter(counter + 1);
          addJupyterNotebook();
        }}
      >
        Increment
      </button>
    </div>
  );
};

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class CounterWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return <CounterComponent />;
  }
}
