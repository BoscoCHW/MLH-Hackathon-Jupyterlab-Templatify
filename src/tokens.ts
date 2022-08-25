export interface INotebookConfig {
  /**
   * The file path of the csv file.
   */
  filePath: string;
  /**
   * Configuration options for preliminary code blocks.
   */
  preliminaryConfig?: IPreliminaryConfig;
  /**
   * Configuration options for descriptive statistics code blocks.
   */
  descriptiveStatConfig?: IDescriptiveStatConfig;
}

export interface IPreliminaryConfig {
  /**
   * Whether the project description block should be included.
   */
  projectDescription?: boolean;
  /**
   * The libraries to import in the Jupyter notebook..
   */
  importLibraries?: string[];
  /**
   * Whether the import data block should be included.
   */
  importData?: boolean;
  /**
   * The columns to drop for data analysis.
   */
  columnsToDrop?: string[];
  /**
   * Whether the null values block should be included.
   */
  nullValues?: boolean;
}

export interface IDescriptiveStatConfig {
  /**
   * Whether the histogram block should be included.
   */
  histograms?: boolean;
  /**
   * The y-variable to use when plotting scatter plots.
   */
  scatterPlots?: string;
  /**
   * The column to drop for feature to feature correlation matrix.
   */
  featureToFeatureCorr?: string;
}
