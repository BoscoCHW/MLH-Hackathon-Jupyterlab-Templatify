import { JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ServerConnection } from '@jupyterlab/services';
import React from 'react';
import { FormComponent, INotebookConfig } from './Form';

const addJupyterNotebook = async (body: INotebookConfig) => {
  const settings = ServerConnection.makeSettings({});
  const serverResponse = await ServerConnection.makeRequest(
    URLExt.join(settings.baseUrl, '/templatify/addNotebook'),
    {
      method: 'POST',
      body: JSON.stringify(body)
    },
    settings
  );
  const data = await serverResponse.json();
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

export class Templatify extends ReactWidget {
  app: JupyterFrontEnd;
  browser: IFileBrowserFactory; // unused, can delete
  constructor(app: JupyterFrontEnd, browser: IFileBrowserFactory) {
    super();
    this.app = app;
    this.browser = browser;
    this.addClass('jp-Templatify');
  }

  render(): JSX.Element {
    const handleClick = async (formData: INotebookConfig): Promise<void> => {
      const path = await addJupyterNotebook(formData);
      openNotebook(this.app, path);
    };
    return <FormComponent handleClick={handleClick} />;
  }
}
