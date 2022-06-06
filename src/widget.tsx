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
    // { method: 'POST', body: JSON.stringify({}) },
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

const dataAnalysisSettings = [
  'Histogram',
  'ScatterPlots',
  'Feature to Feature Correlation Matrix'
];

const initialFormData = Object.freeze({
  filePath: '',
  'Project Description': '',
  'Import Data': '',
  'Import Libraries': '',
  'Null Values': '',
  Histogram: '',
  ScatterPlots: '',
  'Feature to Feature Correlation Matrix': ''
});

const Form = () => {
  const [formData, updateFormData] = React.useState(initialFormData);

  const handleChange = (e: any) => {
    console.log(e);
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
    console.log(formData);
  };

  return (
    <form id="settingsForm">
      <label>
        Please select a csv file to proceed.
        <input
          type="file"
          id="filePath"
          name="filePath"
          onChange={handleChange}
        />
      </label>
      <h2>Notebook Settings</h2>
      <ul className="notebook-settings-list">
        {notebookSettings.map((setting, index) => {
          return (
            <>
              <li key={index}></li>
              <div className="notebook-settings-item">
                <label>
                  {setting}
                  <input
                    type="checkbox"
                    id={setting}
                    name={setting}
                    value={setting}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </>
          );
        })}
      </ul>
      <h2>Types of Data Analysis</h2>
      <ul className="data-settings-list">
        {dataAnalysisSettings.map((setting, index) => {
          return (
            <>
              <li key={index}></li>
              <div className="notebook-settings-item">
                <label>
                  {setting}
                  <input
                    type="checkbox"
                    id={setting}
                    name={setting}
                    value="true"
                    onChange={handleChange}
                  />
                </label>
              </div>
            </>
          );
        })}
      </ul>
    </form>
  );
};

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
    this.addClass('jp-Templatify');
  }
  render(): JSX.Element {
    return (
      <>
        <div className="templatify-body">
          <h1>Templatify</h1>
          <p>Create a Jupyter notebook template</p>
          <br />
          <Form />
          <button
            onClick={async (): Promise<void> => {
              const path = await addJupyterNotebook();
              openNotebook(this.app, path);
            }}
          >
            Generate
          </button>
        </div>
      </>
    );
  }
}
