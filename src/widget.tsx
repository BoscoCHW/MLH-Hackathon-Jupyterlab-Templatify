import { JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ServerConnection } from '@jupyterlab/services';

import React from 'react';

const addJupyterNotebook = async () => {
  console.log('processing');
  const settings = ServerConnection.makeSettings({});
  const serverResponse = await ServerConnection.makeRequest(
    URLExt.join(settings.baseUrl, '/templatify/addNotebook'),
    { method: 'GET' },
    settings
  );
  const data = await serverResponse.json();
  console.log(data);
  return data.path;
};

const openNotebook = async (
  app: JupyterFrontEnd,
  path: string
): Promise<void> => {
  app.commands.execute('docmanager:open', {
    factory: 'Notebook',
    path
  });
};

/**
 * React component for a counter.
 *
 * @returns The React component
 */
// const CounterComponent = ({ app: JupyterFrontEnd }): JSX.Element => {
//   const [counter, setCounter] = useState(0)
//   return ;
// };

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class CounterWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  app: JupyterFrontEnd;
  browser: IFileBrowserFactory; // unused, can delete
  constructor(app: JupyterFrontEnd, browser: IFileBrowserFactory) {
    super();
    this.app = app;
    this.browser = browser;
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return (
      <div>
        <p>Click me to create a Jupyter notebook template!</p>
        <button
          onClick={async (): Promise<void> => {
            const path = await addJupyterNotebook();
            openNotebook(this.app, path);
          }}
        >
          Go
        </button>
      </div>
    );
  }
}
