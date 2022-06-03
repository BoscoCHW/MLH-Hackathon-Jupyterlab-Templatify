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

const notebookSettings = [
  'Project Description',
  'Import Data',
  'Import Libraries',
  'Null Values'
];

const dataAnalysisSettings = ['Histogram'];

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
        <h1>Templatify</h1>
        <p>Create a Jupyter notebook template</p>
        <label>
          Please select a csv file to proceed.
          <input type="file" id="filePath" name="filePath" />
          <h2>Notebook Settings</h2>
          <ul className="settings-list">
            {notebookSettings.map((setting, index) => {
              return (
                <>
                  <li key={index}></li>
                  <div className="notebook-settings-item">
                    <label>
                      {setting}
                      <input
                        type="checkbox"
                        id={'checkbox-${index}'}
                        name={setting}
                        value={setting}
                      />
                    </label>
                  </div>
                </>
              );
            })}
          </ul>
          <h2>Types of Data Analysis</h2>
          <ul className="settings-list">
            {dataAnalysisSettings.map((setting, index) => {
              return (
                <>
                  <li key={index}></li>
                  <div className="notebook-settings-item">
                    <label>
                      {setting}
                      <input
                        type="checkbox"
                        id={'checkbox-${index}'}
                        name={setting}
                        value={setting}
                      />
                    </label>
                  </div>
                </>
              );
            })}
          </ul>
          <button
            onClick={async (): Promise<void> => {
              const path = await addJupyterNotebook();
              openNotebook(this.app, path);
            }}
          >
            Generate
          </button>
        </label>
      </div>
    );
  }
}
