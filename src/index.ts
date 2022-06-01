import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the templatify extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'templatify:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension templatify is activated!');
  }
};

export default plugin;
