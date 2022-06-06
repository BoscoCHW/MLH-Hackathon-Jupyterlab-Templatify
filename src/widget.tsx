import { JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ServerConnection } from '@jupyterlab/services';

import React, { useState } from 'react';

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
  preliminary: {
    projectDescription: false,
    importLibraries: false,
    importData: false,
    columnsToDrop: '',
    nullValues: false
  },
  descriptiveStat: {
    histograms: false,
    scatterPlots: {
      selected: false,
      targetVar: ''
    },
    featureToFeatureCorr: {
      selected: false,
      targetVar: ''
    }
  }
});

const handleTextFormat = (text: {
  target: { name: { split: () => string[] } };
}) => {
  const formattedText = text.target.name
    .split()
    .map(
      (word: string) =>
        word.charAt(0).toLowerCase() + word.substring(1) + word.trim()
    )
    .join('');
  return formattedText;
};

const Form = () => {
  const [formData, setFormData] = useState(initialFormData);

  // const handlePreliminary = () => {
  //   const preliminarySettings = { ...formData.preliminary };

  // };

  const handleChange = (e: any) => {
    const text = handleTextFormat(e);
    let result;
    if (e.target.value !== false) {
      result = true;
    } else {
      result = false;
    }
    setFormData({
      ...formData,
      [text]: result
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
                    value={setting}
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
