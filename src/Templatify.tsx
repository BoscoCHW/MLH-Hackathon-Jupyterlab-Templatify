import { JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ServerConnection } from '@jupyterlab/services';
import React from 'react';
import { FormComponent } from './Form';
import { INotebookConfig } from './tokens';

/**
 * Create a jupyter notebook in the current working directory.
 * @param body The jupyter notebook configuration options.
 * @returns The file path of the jupyter notebook.
 */
const addJupyterNotebook = async (body: INotebookConfig): Promise<string> => {
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

/**
 * Open a file in Jupyterlab.
 * @param app The Jupyterlab frontend app.
 * @param path The path of the file.
 */
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
 * A wrapper class which renders the jupyter notebook generation form.
 */
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
