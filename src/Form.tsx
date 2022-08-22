import React, { useState } from 'react';
import {
  IDescriptiveStatConfig,
  INotebookConfig,
  IPreliminaryConfig
} from './tokens';

import {
  checkBoxWithTextWrapperStyle,
  descriptionStyle,
  formNormalTextStyle,
  formStyle,
  generateButtonStyle,
  libraryOptionStyle,
  libraryOptionsWrapperStyle,
  sectionHeaderStyle,
  settingItemStyle,
  templatifyStyle,
  textInputStyle
} from './style/FormStyle';
import { classes } from 'typestyle';

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
  (
    name: string,
    id: string,
    ...changeHandlers: React.ChangeEventHandler<HTMLInputElement>[]
  ) => {
    if (type === 'simple-checkbox') {
      return (
        <div className={classes(formNormalTextStyle, settingItemStyle)}>
          <label>
            <input
              type="checkbox"
              id={id}
              name={id}
              value={id}
              onChange={changeHandlers[0]}
            />
            <span>{name}</span>
          </label>
        </div>
      );
    } else if (type === 'import-liraries') {
      return (
        <div className={classes(formNormalTextStyle, settingItemStyle)}>
          <div> {name} </div>
          <span className={libraryOptionsWrapperStyle}>
            {LIBRARIES.map(library => (
              <label key={library.id} className={libraryOptionStyle}>
                <input
                  type="checkbox"
                  id={library.id}
                  name={library.id}
                  value={library.id}
                  onChange={changeHandlers[0]}
                />
                <span>{library.name}</span>
              </label>
            ))}
          </span>
        </div>
      );
    } else if (type === 'scatter-plots') {
      return (
        <div
          className={classes(
            formNormalTextStyle,
            settingItemStyle,
            checkBoxWithTextWrapperStyle
          )}
        >
          <label>
            <input
              type="checkbox"
              id={id}
              name={id}
              value={id}
              onChange={changeHandlers[0]}
            />
            <span>{name}</span>
          </label>
          <label className={textInputStyle}>
            <span> Y-var: </span>
            <input
              type="text"
              id="y-var"
              name="y-var"
              onChange={changeHandlers[1]}
            />
          </label>
        </div>
      );
    } else if (type === 'feature-to-feature-corr') {
      return (
        <div
          className={classes(
            formNormalTextStyle,
            settingItemStyle,
            checkBoxWithTextWrapperStyle
          )}
        >
          <label key={id}>
            <input
              type="checkbox"
              id={id}
              name={id}
              value={id}
              onChange={changeHandlers[0]}
            />
            {name}
          </label>
          <label className={textInputStyle}>
            <span> Target variable: </span>
            <input
              type="text"
              id="target-var"
              name="target-var"
              onChange={changeHandlers[1]}
            />
          </label>
        </div>
      );
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
    name: 'Feature To Feature Correlation',
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
  const [descriptiveStatConfig, setDescriptiveStatConfig] =
    useState<IDescriptiveStatConfig>({});
  console.log(preliminaryConfig, descriptiveStatConfig, filePath);
  return (
    <div className={templatifyStyle}>
      <h1>Templatify</h1>
      <p className={descriptionStyle}>
        The extension allows users to select a csv file and choose the types of
        data analysis that they would like to perform. These analyses can range
        from histograms, scatter plots, to correlation matrices.
      </p>
      <form className={formStyle}>
        <label>
          <div className={formNormalTextStyle}>Please select a csv file.</div>
          <input
            type="file"
            id="file"
            name="file"
            onChange={e => setFilePath(e.target.value)}
          />
        </label>
        <div className={sectionHeaderStyle}>Preliminary Settings</div>
        <div className="preliminary-settings-list">
          {PRELIMINARY_OPTIONS.map(({ name, id, renderer }) => {
            const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
              const fieldNameCamalCase = idToCamalCase(id);
              if (fieldNameCamalCase === 'importLibraries') {
                setPreliminaryConfig(prevState => {
                  if (e.target.checked) {
                    return {
                      ...prevState,
                      importLibraries: prevState.importLibraries
                        ? [...prevState.importLibraries, e.target.value]
                        : [e.target.value]
                    };
                  } else {
                    if (prevState.importLibraries) {
                      return {
                        ...prevState,
                        importLibraries: prevState.importLibraries.filter(
                          lib => lib !== e.target.value
                        )
                      };
                    } else {
                      return prevState;
                    }
                  }
                });
              } else {
                setPreliminaryConfig(prevState => ({
                  ...prevState,
                  [fieldNameCamalCase]: e.target.checked
                }));
              }
            };
            return renderer(name, id, changeHandler);
          })}
        </div>
        <div className={sectionHeaderStyle}>Types of Data Analysis</div>
        <div className="descriptive-stat-settings-list">
          {DESCRIPTIVE_STAT_OPTIONS.map(({ name, id, renderer }) => {
            const fieldNameCamalCase = idToCamalCase(id);
            const checkBoxChangeHandler = (
              e: React.ChangeEvent<HTMLInputElement>
            ) =>
              setDescriptiveStatConfig(prevState => {
                if (fieldNameCamalCase === 'scatterPlots') {
                  if (e.target.checked) {
                    return {
                      ...prevState,
                      [fieldNameCamalCase]: (
                        document.querySelector('#y-var') as HTMLInputElement
                      ).value
                    };
                  } else {
                    delete prevState[fieldNameCamalCase];
                    return prevState;
                  }
                }
                if (fieldNameCamalCase === 'featureToFeatureCorr') {
                  if (e.target.checked) {
                    return {
                      ...prevState,
                      [fieldNameCamalCase]: (
                        document.querySelector(
                          '#target-var'
                        ) as HTMLInputElement
                      ).value
                    };
                  } else {
                    delete prevState[fieldNameCamalCase];
                    return prevState;
                  }
                }
                return {
                  ...prevState,
                  [fieldNameCamalCase]: e.target.checked
                };
              });

            const handlers = [checkBoxChangeHandler];
            if (fieldNameCamalCase !== 'histogram') {
              handlers.push(e =>
                setDescriptiveStatConfig(prevState => ({
                  ...prevState,
                  [fieldNameCamalCase]: e.target.value
                }))
              );
            }
            return renderer(name, id, ...handlers);
          })}
        </div>
        <button
          className={generateButtonStyle}
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
