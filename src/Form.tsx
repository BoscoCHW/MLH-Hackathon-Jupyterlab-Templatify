import React, { useState } from 'react';
import {
  IDescriptiveStatConfig,
  INotebookConfig,
  IPreliminaryConfig
} from './tokens';

const idToCamalCase = (id: string) => {
  const idTokens = id.split('-');
  let camalCase = idTokens[0];
  for (let i = 1; i < idTokens.length; i++) {
    camalCase += idTokens[i][0].toUpperCase() + idTokens[i].slice(1);
  }
  return camalCase;
};

const LIBRARIES = [
  { name: 'all of below', id: 'all' },
  { name: 'numpy (as np)', id: 'numpy' },
  { name: 'pandas (as pd)', id: 'pandas' },
  { name: 'matplotlib.pyplot (as plt)', id: 'pyplot' },
  { name: 'seaborn (as sns)', id: 'seaborn' }
];

const rendererFactory =
  (type: string) =>
  (name: string, id: string, changeHandler: React.ChangeEventHandler) => {
    if (type === 'simple-checkbox') {
      return (
        <div className="notebook-settings-item">
          <label>
            {name}
            <input
              type="checkbox"
              id={id}
              name={id}
              value={id}
              onChange={changeHandler}
            />
          </label>
        </div>
      );
    } else if (type === 'import-liraries') {
      return (
        <div className="notebook-settings-item">
          <div> {name} </div>
          {LIBRARIES.map(library => (
            <label key={library.id}>
              {library.name}
              <input
                type="checkbox"
                id={library.id}
                name={library.id}
                value={library.id}
                onChange={changeHandler}
              />
            </label>
          ))}
        </div>
      );
    } else if (type === 'scatter-plots') {
      return <div></div>;
    } else if (type === 'Feature To Feature Corr') {
      return <div></div>;
    } else {
      return <></>;
    }
  };

const PRELIMINARY_OPTIONS = [
  {
    name: 'Project Description',
    id: 'project-description',
    renderer: rendererFactory('simple-checkbox')
  },
  {
    name: 'Import Libraries',
    id: 'import-libraries',
    renderer: rendererFactory('import-liraries')
  },
  {
    name: 'Import Data',
    id: 'import-data',
    renderer: rendererFactory('simple-checkbox')
  },
  {
    name: 'Null Values',
    id: 'null-values',
    renderer: rendererFactory('simple-checkbox')
  }
];

const DESCRIPTIVE_STAT_OPTIONS = [
  {
    name: 'Histogram',
    id: 'histogram',
    renderer: rendererFactory('simple-checkbox')
  },
  {
    name: 'Scatter Plots',
    id: 'scatter-plots',
    renderer: rendererFactory('scatter-plots')
  },
  {
    name: 'Feature To Feature Corr',
    id: 'feature-to-feature-corr',
    renderer: rendererFactory('feature-to-feature-corr')
  }
];

export interface IFormProps {
  handleClick(notebookConfig: INotebookConfig): void;
}

export const FormComponent: React.FunctionComponent<IFormProps> = ({
  handleClick
}): JSX.Element => {
  const [filePath, setFilePath] = useState<string>('');
  const [preliminaryConfig, setPreliminaryConfig] =
    useState<IPreliminaryConfig>({});
  const [descriptiveStatConfig] = useState<IDescriptiveStatConfig>({});
  console.log(preliminaryConfig, filePath);
  return (
    <div className="templatify-body">
      <h1>Templatify</h1>
      <p>Create a Jupyter notebook template</p>
      <form id="settingsForm">
        <label>
          Please select a csv file to proceed.
          <input
            type="file"
            id="file"
            name="file"
            onChange={e => setFilePath(e.target.value)}
          />
        </label>
        <h2>Preliminary Settings</h2>
        <ul className="notebook-settings-list">
          {PRELIMINARY_OPTIONS.map(({ name, id, renderer }) => {
            const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
              const fieldNameCamalCase = idToCamalCase(id);
              if (fieldNameCamalCase === 'importLibraries') {
                setPreliminaryConfig({ importLibraries: [e.target.value] });
              } else {
                setPreliminaryConfig({
                  [fieldNameCamalCase]: e.target.checked
                });
              }
            };
            return renderer(name, id, changeHandler);
          })}
        </ul>
        <h2>Types of Data Analysis</h2>
        <ul className="data-settings-list">
          {DESCRIPTIVE_STAT_OPTIONS.map(({ name, id, renderer }) => {
            const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
              const fieldNameCamalCase = idToCamalCase(id);
              if (fieldNameCamalCase === 'importLibraries') {
                setPreliminaryConfig({ importLibraries: [e.target.value] });
              } else {
                setPreliminaryConfig({
                  [fieldNameCamalCase]: e.target.checked
                });
              }
            };
            return renderer(name, id, changeHandler);
          })}
        </ul>
        <button
          onClick={e => {
            e.preventDefault();
            handleClick({ filePath, preliminaryConfig, descriptiveStatConfig });
          }}
        >
          Generate
        </button>
      </form>
    </div>
  );
};
