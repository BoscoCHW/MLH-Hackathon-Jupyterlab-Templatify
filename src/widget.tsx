import { JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ServerConnection } from '@jupyterlab/services';

import React, { useState } from 'react';

const notebookSettings = [
  'Project Description',
  'Import Data',
  'Import Libraries',
  'Null Values'
];

const dataAnalysisSettings = [
  'Histogram',
  'Scatter Plots',
  'Feature to Feature Corr'
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
    scatterPlots: false,
    featureToFeatureCorr: false
  }
});

const handleTextFormat = (text: { target: { name: string } }) => {
  const formattedText = text.target.name.replace(/\s/g, '');
  return formattedText[0].toLowerCase() + formattedText.slice(1);
};

const Form = () => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: any) => {
    const text = handleTextFormat(e);
    let result: any;
    if (e.target.name === 'filePath') {
      result = e.target.value;
    } else if (e.target.checked === false) {
      result = false;
    } else {
      result = true;
    }

    const handleSetting = (str: string) => {
      console.log(str);
      if (str[0] === 'p' || str[0] === 'i' || str[0] === 'n') {
        setFormData({
          ...formData,
          preliminary: {
            ...formData.preliminary,
            [text]: result
          }
        });
      } else if (str[0] === 'f') {
        setFormData({
          ...formData,
          filePath: formData.filePath,
          [text]: result
        });
      } else {
        setFormData({
          ...formData,
          descriptiveStat: {
            ...formData.descriptiveStat,
            [text]: result
          }
        });
      }
    };

    handleSetting(text);

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
        {notebookSettings.map(setting => {
          return (
            <>
              <li key={setting.trim()}></li>
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
        {dataAnalysisSettings.map(setting => {
          return (
            <>
              <li key={setting.trim()}></li>
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

const addJupyterNotebook = async () => {
  console.log('processing');
  const settings = ServerConnection.makeSettings({});
  const serverResponse = await ServerConnection.makeRequest(
    URLExt.join(settings.baseUrl, '/templatify/addNotebook'),
    // { method: 'GET' },
    {
      method: 'POST',
      body: JSON.stringify({
        preliminary: {
          projectDescription: false,
          importLibraries: false,
          importData: false,
          nullValues: false
        },
        descriptiveStat: {
          histograms: true,
          scatterPlots: false,
          featureToFeatureCorr: false
        }
      })
    },
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
